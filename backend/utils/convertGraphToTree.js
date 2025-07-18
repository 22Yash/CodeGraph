/**
 * Converts a flat dependency graph (Madge output) into a hierarchical tree
 * based on the file system's directory structure.
 * It also stores the original dependencies for each file node.
 *
 * @param {object} graph - The flat dependency graph object (e.g., from Madge).
 * @param {string} rootName - The desired name for the top-level root node (e.g., "Go-organizer").
 * @returns {object} The root node of the generated tree structure, reflecting directory hierarchy.
 */
function convertGraphToTree(graph, rootName = "root") {
  const tree = { name: rootName, children: [], path: "" }; // Top-level root node
  const nodesMap = { "": tree }; // Map to quickly access nodes by their full path

  // Helper function to get or create a node for a given path
  const getOrCreateNode = (currentPath, parentNode, isDirectory = true) => {
    if (!nodesMap[currentPath]) {
      const name = currentPath.split('/').pop();
      const newNode = {
        name: name,
        children: [],
        path: currentPath,
        isDirectory: isDirectory,
        originalDependencies: [] // To store madge dependencies later
      };
      parentNode.children.push(newNode);
      nodesMap[currentPath] = newNode;
    }
    return nodesMap[currentPath];
  };

  // Iterate through all files found in the Madge graph
  for (const filePath of Object.keys(graph)) {
    const parts = filePath.split('/');
    let currentPath = "";
    let parentNode = tree;

    // Traverse parts to build directory hierarchy
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLastPart = (i === parts.length - 1);
      const isDirectory = !isLastPart; // If it's not the last part, it's a directory

      currentPath = currentPath === "" ? part : `${currentPath}/${part}`;

      if (isDirectory) {
        parentNode = getOrCreateNode(currentPath, parentNode, true);
      } else {
        // This is the file itself
        const fileNode = getOrCreateNode(currentPath, parentNode, false);
        // Store the original madge dependencies for this file
        fileNode.originalDependencies = graph[filePath];
      }
    }
  }

  // Optional: Sort children alphabetically for consistent rendering
  const sortChildren = (node) => {
    if (node.children) {
      node.children.sort((a, b) => {
        // Directories first, then files, then alphabetical
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortChildren);
    }
  };
  sortChildren(tree);

  return tree;
}

module.exports = { convertGraphToTree };
