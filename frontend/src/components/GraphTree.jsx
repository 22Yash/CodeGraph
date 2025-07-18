import { useEffect, useState } from "react";
import Tree from "react-d3-tree";

function GraphTree({ onNodeClick }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData({
      name: "src",
      children: [
        { name: "App.js" },
        { name: "Dashboard.js" },
        { name: "Header.js" },
        { name: "globals.css" },
      ],
    });
  }, []);

  if (!data) return <p>Loading graph…</p>;

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Tree
        data={data}
        orientation="vertical"
        translate={{ x: 300, y: 100 }}
        onNodeClick={({ name }) => onNodeClick({ name, path: `src/${name}`, type: "js", size: 800, deps: 1 })}
      />
    </div>
  );
}

export default GraphTree;
