function GraphSidebar({ selectedFile }) {
    return (
      <div className="graph-sidebar">
        <h3 className="font-semibold text-lg mb-4">File Details</h3>
        {selectedFile ? (
          <div>
            <p><strong>Name:</strong> {selectedFile.name}</p>
            <p><strong>Path:</strong> {selectedFile.path}</p>
            <p><strong>Type:</strong> {selectedFile.type}</p>
            <p><strong>Size:</strong> {selectedFile.size} bytes</p>
            <p><strong>Dependencies:</strong> {selectedFile.deps}</p>
          </div>
        ) : (
          <p>Select a file node to see details</p>
        )}
      </div>
    );
  }
  
  export default GraphSidebar;
  