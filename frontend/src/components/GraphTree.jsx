import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GraphTree = ({ data, onNodeClick }) => {
  const svgRef = useRef();
  const i = useRef(0); // Use ref for unique ID counter for D3 nodes
  const zoomBehavior = useRef(null); // Ref to store the D3 zoom behavior instance

  useEffect(() => {
    // Ensure data is available before attempting to render
    if (!data) {
      // Clear SVG if no data is provided
      d3.select(svgRef.current).html("");
      return;
    }

    // Define margins for the SVG canvas
    const margin = { top: 60, right: 20, bottom: 20, left: 20 };
    // Calculate the effective width and height for the tree layout
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Select the SVG element, clear its previous content
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .html(""); // Clear existing elements to prevent duplicates on re-render

    // Append a group element that will be zoomed and panned
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Implement zoom and pan functionality
    zoomBehavior.current = d3.zoom() // Store the zoom behavior in a ref
      .scaleExtent([0.1, 4]) // Allow zooming from 10% to 400%
      .on("zoom", (event) => {
        g.attr("transform", event.transform); // Apply the zoom transform to the group 'g'
      });

    svg.call(zoomBehavior.current); // Apply zoom behavior to the SVG

    // Create a D3 tree layout
    // For vertical layout, size is [width, height] and depth increases along y-axis
    const treeLayout = d3.tree().size([width, height]); // Swapped width and height for vertical layout

    // Assigns parent, children, height, and depth to the data
    const root = d3.hierarchy(data, d => d.children);
    root.x0 = width / 2; // Initial x-position for the root (for transitions)
    root.y0 = 0;          // Initial y-position for the root (for transitions)

    // Collapse all nodes initially except the root's direct children
    if (root.children) {
      root.children.forEach(collapse);
    }
    update(root); // Initial render

    // Function to recursively collapse nodes
    function collapse(d) {
      if (d.children) {
        d._children = d.children; // Store children in _children
        d._children.forEach(collapse); // Recursively collapse descendants
        d.children = null; // Hide children
      }
    }

    // Main update function for rendering and transitions
    function update(source) {
      // Compute the new tree layout, applying the treeLayout to the root
      const treeData = treeLayout(root);

      // Get lists of nodes and links (paths between parent and child)
      const nodes = treeData.descendants();
      const links = treeData.descendants().slice(1); // Exclude the root node from links

      // Normalize for fixed-depth spacing.
      // d.y now represents the vertical position (depth) of the node.
      // Increased spacing (150) to accommodate longer directory/file names vertically and prevent overlap.
      nodes.forEach(d => { d.y = d.depth * 150; }); // Adjusted depth spacing for vertical layout

      // ****************** Nodes section ******************

      // Select all existing node groups
      const node = g.selectAll('g.node') // Select from 'g' element
        .data(nodes, d => d.id || (d.id = ++i.current)); // Assign unique ID if not present

      // Enter any new nodes at the parent's previous position (for transition effect)
      const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${source.x0},${source.y0})`) // Swapped x0, y0 for vertical
        .on('click', click); // Attach click handler for interactivity

      // Add different shapes for nodes: rectangle for directories, circle for files
      nodeEnter.append(d => d.data.isDirectory ? document.createElementNS(d3.namespaces.svg, "rect") : document.createElementNS(d3.namespaces.svg, "circle"))
        .attr('class', 'node-shape') // Unified class for shapes
        .attr('r', d => d.data.isDirectory ? 0 : 1e-6) // Circle radius
        .attr('width', d => d.data.isDirectory ? 1e-6 : 0) // Rect width
        .attr('height', d => d.data.isDirectory ? 1e-6 : 0) // Rect height
        .attr('x', d => d.data.isDirectory ? -30 : 0) // Rect x-position (centered)
        .attr('y', d => d.data.isDirectory ? -10 : 0) // Rect y-position (centered)
        // Fill color based on whether it's a collapsed node (blue), a directory (purple), or a file (white)
        .style('fill', d => d._children ? '#60A5FA' : (d.data.isDirectory ? '#A78BFA' : '#fff'))
        .attr('stroke', '#3B82F6') // Blue border
        .attr('stroke-width', 1.5)
        .attr('rx', d => d.data.isDirectory ? 5 : 0) // Rounded corners for rectangles
        .attr('ry', d => d.data.isDirectory ? 5 : 0);

      // Add labels for the nodes
      nodeEnter.append('text')
        .attr('dy', '0.31em') // Vertical alignment
        // Position text relative to the shape: below for circles, centered for rectangles
        .attr('y', d => d.data.isDirectory ? 25 : -10) // Adjusted for vertical layout and shape
        .attr('text-anchor', 'middle') // Center text horizontally
        .text(d => d.data.name) // Display the 'name' property from your data
        .attr('font-size', '12px') // Increased font size for better readability
        .attr('fill', '#333')
        .style("filter", "url(#solid-background)"); // Apply filter for background

      // Define a filter for text background (to improve readability)
      const defs = svg.append("defs");
      defs.append("filter")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 1)
        .attr("height", 1)
        .attr("id", "solid-background")
        .append("feFlood")
        .attr("flood-color", "white")
        .attr("flood-opacity", 0.8)
        .attr("result", "background")
        .select(function() { return this.parentNode; }) // Select the filter element again
        .append("feBlend")
        .attr("in", "SourceGraphic")
        .attr("in2", "background");


      // UPDATE section: Merge entering nodes with existing nodes
      const nodeUpdate = nodeEnter.merge(node);

      // Transition nodes to their new position
      nodeUpdate.transition()
        .duration(750) // Transition duration
        .attr('transform', d => `translate(${d.x},${d.y})`); // Swapped x, y for vertical

      // Update the node attributes and style for shapes
      nodeUpdate.select('circle.node-shape') // Select by new class name
        .attr('r', 6) // Final circle radius
        .style('fill', d => d._children ? '#60A5FA' : (d.data.isDirectory ? '#A78BFA' : '#fff'))
        .attr('cursor', 'pointer');
      
      nodeUpdate.select('rect.node-shape') // Select by new class name
        .attr('width', 60) // Final rect width
        .attr('height', 20) // Final rect height
        .attr('x', -30) // Centered
        .attr('y', -10) // Centered
        .style('fill', d => d._children ? '#60A5FA' : (d.data.isDirectory ? '#A78BFA' : '#fff'))
        .attr('cursor', 'pointer');

      // Exit any old nodes (nodes no longer in the data)
      const nodeExit = node.exit().transition()
        .duration(750)
        .attr('transform', d => `translate(${source.x},${source.y})`) // Transition to parent's position
        .remove(); // Remove from DOM

      // On exit, reduce the node shapes size to 0
      nodeExit.select('.node-shape')
        .attr('r', 1e-6)
        .attr('width', 1e-6)
        .attr('height', 1e-6);

      // On exit, reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // ****************** Links section (Hierarchical connections) ******************

      // Select all existing hierarchical links
      const link = g.selectAll('path.link') // Select from 'g' element
        .data(links, d => d.id); // Data join based on link ID

      // Enter any new links at the parent's previous position
      const linkEnter = link.enter().insert('path', 'g') // Insert before node groups
        .attr('class', 'link')
        .attr('d', d => {
          const o = { x: source.x0, y: source.y0 };
          return verticalDiagonal(o, o); // Start as a point at the source
        })
        .attr('fill', 'none')
        .attr('stroke', '#999') // Slightly darker grey for hierarchical links
        .attr('stroke-width', 1.5);

      // UPDATE section: Merge entering links with existing links
      const linkUpdate = linkEnter.merge(link);

      // Transition links to their new position
      linkUpdate.transition()
        .duration(750)
        .attr('d', d => verticalDiagonal(d, d.parent)); // Draw path from node to its parent

      // Remove any exiting links
      link.exit().transition()
        .duration(750)
        .attr('d', d => {
          const o = { x: source.x, y: source.y };
          return verticalDiagonal(o, o); // Transition to a point at the source
        })
        .remove();

      // ****************** Cross-Links (Dependencies) ******************
      // This section draws additional links for original Madge dependencies
      // that are not part of the direct parent-child hierarchy.

      // Filter for nodes that represent files and have original Madge dependencies
      const fileNodesWithDependencies = nodes.filter(d => !d.data.isDirectory && d.data.originalDependencies && d.data.originalDependencies.length > 0);

      // Create data for cross-links: each dependency becomes a source-target pair
      const crossLinkData = fileNodesWithDependencies.flatMap(sourceNode =>
        sourceNode.data.originalDependencies
          .map(targetPath => {
            // Find the target node in the D3 hierarchy based on its full path
            const targetNode = nodes.find(n => n.data.path === targetPath);
            if (targetNode) {
              return { source: sourceNode, target: targetNode };
            }
            return null; // Return null if target node not found (e.g., external dependency)
          })
          .filter(Boolean) // Remove null entries
      );

      // Select all existing cross-links
      const crossLinks = g.selectAll('line.cross-link') // Select from 'g' element
        .data(crossLinkData, d => `${d.source.id}-${d.target.id}`); // Unique ID for each cross-link

      // Enter any new cross-links
      crossLinks.enter().append('line')
        .attr('class', 'cross-link')
        .attr('x1', d => d.source.x) // Swapped x1, y1 for vertical
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.source.x) // Start at source position for transition
        .attr('y2', d => d.source.y)
        .attr('stroke', '#EF4444') // Red color for dependency links
        .attr('stroke-width', 1.5) // Slightly thicker for emphasis
        .attr('stroke-dasharray', '5,5') // Dashed line to distinguish from hierarchical links
        .transition()
        .duration(750)
        .attr('x2', d => d.target.x) // Transition to target x
        .attr('y2', d => d.target.y); // Transition to target y

      // UPDATE section: Merge entering cross-links with existing ones
      crossLinks.transition()
        .duration(750)
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      // Remove any exiting cross-links
      crossLinks.exit().transition()
        .duration(750)
        .attr('x2', d => d.source.x) // Transition back to source position
        .attr('y2', d => d.source.y)
        .remove();

      // Store the old positions for transition.
      nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes for hierarchical links
      // Adjusted for vertical layout
      function verticalDiagonal(s, d) {
        return `M ${s.x} ${s.y}
                C ${s.x} ${(s.y + d.y) / 2},
                  ${d.x} ${(s.y + d.y) / 2},
                  ${d.x} ${d.y}`;
      }

      // Toggle children on click and update sidebar
      function click(event, d) {
        if (d.data.isDirectory) { // Only toggle children for directory nodes
          if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
          update(d); // Re-render the tree
        }
        // Always call onNodeClick for any node (file or directory) to update the sidebar
        onNodeClick(d.data);
      }
    }
  }, [data, onNodeClick]); // Re-run effect if data or onNodeClick changes

  // Handlers for zoom buttons
  const handleZoomIn = () => {
    if (zoomBehavior.current) {
      zoomBehavior.current.scaleBy(d3.select(svgRef.current), 1.2); // Zoom in by 20%
    }
  };

  const handleZoomOut = () => {
    if (zoomBehavior.current) {
      zoomBehavior.current.scaleBy(d3.select(svgRef.current), 0.8); // Zoom out by 20%
    }
  };

  const handleZoomReset = () => {
    if (zoomBehavior.current) {
      d3.select(svgRef.current).transition().duration(750).call(zoomBehavior.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-auto">
      <svg ref={svgRef} className="w-full h-full"></svg>
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2 bg-white p-2 rounded-lg shadow-lg z-20">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={handleZoomReset}
          className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 text-xs"
          title="Reset Zoom"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default GraphTree;
