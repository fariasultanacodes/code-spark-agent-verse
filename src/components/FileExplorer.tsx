
import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
  isOpen?: boolean;
}

interface FileExplorerProps {
  files: FileItem[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (name: string, type: 'file' | 'folder', parentId?: string) => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
}

const FileExplorer = ({
  files,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
}: FileExplorerProps) => {
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const type = newFileName.includes('.') ? 'file' : 'folder';
      onFileCreate(newFileName, type);
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const handleRename = (fileId: string) => {
    if (renameValue.trim()) {
      onFileRename(fileId, renameValue);
      setRenamingFileId(null);
      setRenameValue('');
    }
  };

  const renderFileItem = (item: FileItem, depth = 0) => {
    const isActive = item.id === activeFileId;
    const isRenaming = renamingFileId === item.id;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer ${
            isActive ? 'bg-gray-600' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {item.type === 'folder' && (
            <button className="mr-1">
              {item.isOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          
          {item.type === 'folder' ? (
            <Folder className="w-4 h-4 mr-2 text-blue-400" />
          ) : (
            <File className="w-4 h-4 mr-2 text-gray-400" />
          )}

          {isRenaming ? (
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => handleRename(item.id)}
              onKeyPress={(e) => e.key === 'Enter' && handleRename(item.id)}
              className="h-6 text-xs bg-gray-700 border-gray-600"
              autoFocus
            />
          ) : (
            <span
              className="flex-1 text-sm text-gray-300"
              onClick={() => item.type === 'file' && onFileSelect(item.id)}
              onDoubleClick={() => {
                setRenamingFileId(item.id);
                setRenameValue(item.name);
              }}
            >
              {item.name}
            </span>
          )}

          <button
            onClick={() => onFileDelete(item.id)}
            className="ml-2 opacity-0 group-hover:opacity-100 hover:text-red-400"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {item.type === 'folder' && item.isOpen && item.children && (
          <div>
            {item.children.map((child) => renderFileItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-800 border-r border-gray-700">
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Explorer</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowNewFileInput(true)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        {showNewFileInput && (
          <div className="mt-2">
            <Input
              placeholder="File name..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={handleCreateFile}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
              className="h-6 text-xs bg-gray-700 border-gray-600"
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="overflow-y-auto">
        {files.map((file) => renderFileItem(file))}
      </div>
    </div>
  );
};

export default FileExplorer;
