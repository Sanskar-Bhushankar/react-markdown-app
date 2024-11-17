import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { sidebarTree } from '../data/sidebarTree';
import { useNavigate } from 'react-router-dom';

const GraphView = () => {
  const navigate = useNavigate();

  const createGraphData = () => {
    const nodes = [];
    const links = [];

    const getAllFiles = (items) => {
      let files = [];
      items.forEach(item => {
        if (item.type === 'file') {
          files.push(item);
        }
        if (item.children) {
          files = [...files, ...getAllFiles(item.children)];
        }
      });
      return files;
    };

    const files = getAllFiles(sidebarTree);

    files.forEach(file => {
      nodes.push({
        id: file.path,
        name: file.name.replace('.md', ''),
        path: file.path.replace(/\\/g, '/'), // Normalize path separators
        val: 0.5,
        color: '#90EE90'
      });
    });

    // Create links for clustering
    files.forEach((file1, i) => {
      files.slice(i + 1).forEach(file2 => {
        if (file1.path.split('/')[0] === file2.path.split('/')[0]) {
          links.push({
            source: file1.path,
            target: file2.path,
            value: 0.1
          });
        }
      });
    });

    return { nodes, links };
  };

  const handleNodeClick = (node) => {
    if (node) {
      // Format the path correctly and keep .md extension
      const formattedPath = node.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      navigate(`/docs/${formattedPath}`); // Add /docs/ prefix, keep .md
    }
  };

  return (
    <div className="fixed top-0 right-0 w-64 h-64 bg-[#1B1E2B] border-l border-b border-gray-700">
      <ForceGraph2D
        graphData={createGraphData()}
        nodeRelSize={2}
        nodeLabel={node => node.name} // Show name without .md in hover
        linkColor={() => 'rgba(42, 47, 58, 0.2)'}
        nodeColor="color"
        backgroundColor="#1B1E2B"
        width={256}
        height={256}
        linkWidth={0.1}
        enableZoom={true}
        enableNodeDrag={true}
        minZoom={0.5}
        maxZoom={4}
        onNodeClick={handleNodeClick}
        onNodeHover={(node) => {
          document.body.style.cursor = node ? 'pointer' : 'default';
        }}
        cooldownTime={2000}
        d3AlphaMin={0.1}
        centerAt={[128, 128]}
        forceEngine="d3"
        dagMode={null}
        d3Force={(d3) => {
          d3.force('charge')
            .strength(-3)
            .distanceMax(30);
          d3.force('link')
            .distance(10)
            .strength(0.5);
          d3.force('center')
            .strength(0.5);
          d3.force('collision')
            .radius(3)
            .strength(0.5);
        }}
      />
    </div>
  );
};

export default GraphView; 