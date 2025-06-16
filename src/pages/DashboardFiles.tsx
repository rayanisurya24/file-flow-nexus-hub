
import { useUser, useOrganization } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Download, Share, Trash2, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FileRecord {
  id: string;
  user_id: string;
  organization_id: string | null;
  file_name: string;
  file_url: string;
  file_size: number;
  is_public: boolean;
  created_at: string;
}

const DashboardFiles = () => {
  const { user } = useUser();
  const { organization } = useOrganization();
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['user-files', user?.id, organization?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (organization?.id) {
        query = query.eq('organization_id', organization.id);
      } else {
        query = query.eq('user_id', user.id).is('organization_id', null);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as FileRecord[];
    },
    enabled: !!user?.id,
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

  const togglePublicMutation = useMutation({
    mutationFn: async ({ fileId, isPublic }: { fileId: string; isPublic: boolean }) => {
      const { error } = await supabase
        .from('files')
        .update({ is_public: isPublic })
        .eq('id', fileId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-files'] });
      toast.success('File privacy updated!');
    },
    onError: () => {
      toast.error('Failed to update file privacy');
    },
  });

  const copyShareLink = (fileId: string) => {
    const shareUrl = `${window.location.origin}/share/${fileId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const previewFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-600">Loading your files...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Files</h1>
          <p className="text-gray-600 mt-2">
            {organization ? `Files in ${organization.name} workspace` : 'Your personal files'}
          </p>
        </div>

        {files.length === 0 ? (
          <Card className="bg-white border border-gray-200">
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
              <p className="text-gray-600">Upload your first file to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <Card key={file.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{file.file_name}</h3>
                        {file.is_public ? (
                          <Globe className="w-4 h-4 text-green-600" title="Public file" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-600" title="Private file" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => previewFile(file.file_url)}
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.file_url, '_blank')}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyShareLink(file.id)}
                        title="Share"
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublicMutation.mutate({ 
                          fileId: file.id, 
                          isPublic: !file.is_public 
                        })}
                        title={file.is_public ? "Make private" : "Make public"}
                      >
                        {file.is_public ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(file.id)}
                        disabled={deleteMutation.isPending}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardFiles;
