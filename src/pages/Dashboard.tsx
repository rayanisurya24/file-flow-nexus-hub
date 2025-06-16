
import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Share, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FileRecord {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  created_at: string;
}

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['user-files', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FileRecord[];
    },
    enabled: !!user?.id,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('user-files')
        .getPublicUrl(fileName);
      
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
        });
      
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-files'] });
      toast.success('File uploaded successfully!');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-files'] });
      toast.success('File deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete file');
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
    } finally {
      setUploading(false);
    }
  };

  const copyShareLink = (fileUrl: string) => {
    navigator.clipboard.writeText(fileUrl);
    toast.success('Share link copied to clipboard!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Please sign in to access your dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
              <p className="text-gray-600 mt-2">Manage your files and share them securely</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload"
              />
              <Button
                asChild
                disabled={uploading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload File'}
                </label>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Files</h2>
            
            {isLoading ? (
              <div className="text-center py-8">Loading your files...</div>
            ) : files.length === 0 ? (
              <div className="text-center py-12">
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No files uploaded yet. Upload your first file to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{file.file_name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.file_url, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyShareLink(file.file_url)}
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(file.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
