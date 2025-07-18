function convertGraphToTree(graph) {
    const nodes = {};
  
    for (const key of Object.keys(graph)) {
      if (!nodes[key]) nodes[key] = { name: key, children: [] };
      graph[key].forEach((child) => {
        if (!nodes[child]) nodes[child] = { name: child, children: [] };
      });
    }
  
    for (const key of Object.keys(graph)) {
      graph[key].forEach((child) => {
        nodes[key].children.push(nodes[child]);
      });
    }
  
    const referenced = new Set();
    for (const deps of Object.values(graph)) {
      deps.forEach((dep) => referenced.add(dep));
    }
  
    const roots = Object.keys(graph).filter((key) => !referenced.has(key));
  
    if (roots.length === 1) {
      return nodes[roots[0]];
    } else {
      return { name: "root", children: roots.map((key) => nodes[key]) };
    }
  }
  
  module.exports = { convertGraphToTree };
  