
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Calendar, HardDrive, Lock } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type FileRecord = Tables<'files'>;

const FileShare = () => {
  const { fileId } = useParams();
  const { user } = useUser();

  const { data: file, isLoading, error } = useQuery({
    queryKey: ['shared-file', fileId],
    queryFn: async () => {
      if (!fileId) throw new Error('File ID is required');
      
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();
      
      if (error) {
        console.error('Error fetching file:', error);
        throw error;
      }

      // Check if file is public or if user owns it
      if (!data.is_public && (!user || data.user_id !== user.id)) {
        throw new Error('File is private and you do not have access');
      }

      return data as FileRecord;
    },
    enabled: !!fileId,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) return 'audio';
    return 'file';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading file...</div>
      </div>
    );
  }

  if (error || !file) {
    const isPrivateFile = error?.message?.includes('private');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            {isPrivateFile ? (
              <>
                <Lock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Private File</h2>
                <p className="text-gray-600">This file is private. You need to be signed in and have access to view it.</p>
              </>
            ) : (
              <>
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">File Not Found</h2>
                <p className="text-gray-600">This file doesn't exist or is not accessible.</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const fileType = getFileType(file.file_name);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CV</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">CloudVault</span>
          </div>
          <p className="text-gray-600">Secure file sharing</p>
        </div>

        <Card className="bg-white border border-gray-200 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-center gap-2">
              {file.file_name}
              {!file.is_public && <Lock className="w-5 h-5 text-gray-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              {fileType === 'image' && (
                <div className="max-w-2xl mx-auto mb-6">
                  <img 
                    src={file.file_url} 
                    alt={file.file_name}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
              
              {fileType === 'pdf' && (
                <div className="mb-6">
                  <iframe
                    src={file.file_url}
                    className="w-full h-96 rounded-lg border border-gray-200"
                    title={file.file_name}
                  />
                </div>
              )}
              
              {fileType === 'video' && (
                <div className="max-w-2xl mx-auto mb-6">
                  <video 
                    controls 
                    className="w-full h-auto rounded-lg shadow-lg"
                    src={file.file_url}
                  />
                </div>
              )}
              
              {fileType === 'audio' && (
                <div className="max-w-md mx-auto mb-6">
                  <audio 
                    controls 
                    className="w-full"
                    src={file.file_url}
                  />
                </div>
              )}
              
              {fileType === 'file' && (
                <div className="mb-6">
                  <FileText className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                </div>
              )}

              <Button 
                onClick={() => window.open(file.file_url, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <HardDrive className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">File Size</p>
                <p className="text-sm text-gray-600">{formatFileSize(file.file_size)}</p>
              </div>
              
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">Shared On</p>
                <p className="text-sm text-gray-600">{new Date(file.created_at).toLocaleDateString()}</p>
              </div>
              
              <div className="text-center">
                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">File Type</p>
                <p className="text-sm text-gray-600">{file.file_name.split('.').pop()?.toUpperCase()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Powered by CloudVault - Secure file sharing made simple
          </p>
        </div>
      </div>
    </div>
  );
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
  if (['pdf'].includes(extension || '')) return 'pdf';
  if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) return 'video';
  if (['mp3', 'wav', 'flac', 'aac'].includes(extension || '')) return 'audio';
  return 'file';
};

export default FileShare;
