
import { X } from 'lucide-react';

interface FileTab {
  id: string;
  name: string;
  isModified?: boolean;
}

interface FileTabsProps {
  tabs: FileTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

const FileTabs = ({ tabs, activeTabId, onTabSelect, onTabClose }: FileTabsProps) => {
  return (
    <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center px-3 py-2 border-r border-gray-700 cursor-pointer min-w-0 ${
            tab.id === activeTabId
              ? 'bg-gray-700 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          onClick={() => onTabSelect(tab.id)}
        >
          <span className="text-sm truncate mr-2">
            {tab.name}
            {tab.isModified && '*'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="hover:bg-gray-600 rounded p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileTabs;
