import React from 'react';
import { FileText, Code, Info, XCircle } from 'lucide-react';

const GraphSidebar = ({ selectedFile }) => {
  return (
    <aside className="w-80 bg-white rounded-lg shadow-lg p-6 flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Info size={20} className="mr-2 text-blue-600" />
        File Details
      </h3>

      {selectedFile ? (
        <div className="space-y-4">
          <div className="flex items-center text-lg font-semibold text-gray-700">
            <FileText size={18} className="mr-2 text-gray-500" />
            <span>{selectedFile.name.split('/').pop()}</span> {/* Display just the file name */}
          </div>
          <p className="text-sm text-gray-500 break-all">
            <span className="font-medium text-gray-600">Full Path:</span> {selectedFile.name}
          </p>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
              <Code size={16} className="mr-2 text-purple-600" />
              Dependencies
            </h4>
            {selectedFile.children && selectedFile.children.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {selectedFile.children.map((child, index) => (
                  <li key={index} className="truncate">{child.name.split('/').pop()}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No direct dependencies found.</p>
            )}
          </div>
          {/* Add more details here as needed, e.g., file content preview */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
          <XCircle size={48} className="mb-4 text-gray-300" />
          <p>Select a node on the graph to view its details.</p>
        </div>
      )}
    </aside>
  );
};

export default GraphSidebar;
