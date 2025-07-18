import { ArrowLeft, ListTree, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GraphHeader() {
  const navigate = useNavigate();

  return (
    <div className="graph-header">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-blue-600 font-semibold"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="flex gap-2">
        <button className="flex items-center gap-2 border px-3 py-1 rounded-md">
          <ListTree size={16} />
          Tree
        </button>
        <button className="flex items-center gap-2 border px-3 py-1 rounded-md">
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
}

export default GraphHeader;
