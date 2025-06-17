
import { useUser, useOrganization } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardUpload = () => {
  const { user } = useUser();
  const { organization } = useOrganization();
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${organization?.id || user.id}/${Date.now()}.${fileExt}`;
      
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
          organization_id: organization?.id || null,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          is_public: false,
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      await uploadMutation.mutateAsync(file);
      // Reset the input
      event.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploading(true);
      try {
        await uploadMutation.mutateAsync(files[0]);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Files</h1>
          <p className="text-gray-600 mt-2">Upload and share your files securely</p>
        </div>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Choose Files to Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {uploading ? 'Uploading...' : 'Drop files here or click to browse'}
              </h3>
              <p className="text-gray-600 mb-6">
                Supports all file types. Maximum file size: 50MB
              </p>
              
              <Input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload"
                multiple
              />
              <Button
                asChild
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Select Files
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Upload Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Files uploaded to your {organization ? 'organization workspace' : 'personal workspace'} will be accessible to {organization ? 'all organization members' : 'you only'}</p>
              <p>• You can change file privacy settings after upload</p>
              <p>• Large files may take longer to process</p>
              <p>• All uploaded files are automatically scanned for security</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardUpload;
