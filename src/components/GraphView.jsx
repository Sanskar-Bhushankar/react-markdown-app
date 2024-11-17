import React, { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { sidebarTree } from '../data/sidebarTree';

const GraphView = () => {
  const graphRef = useRef();

  const createGraphData = () => {
    const nodes = [];
    const links = [];
    const processedNodes = new Set();

    const processNode = (item, parent = null) => {
      if (!processedNodes.has(item.path)) {
        processedNodes.add(item.path);
        nodes.push({
          id: item.path,
          name: item.name,
          val: item.type === 'directory' ? 2 : 1,
          color: item.type === 'directory' ? '#4A90E2' : '#90EE90'
        });

        if (parent) {
          links.push({
            source: parent.path,
            target: item.path
          });
        }

        if (item.children) {
          item.children.forEach(child => processNode(child, item));
        }
      }
    };

    sidebarTree.forEach(item => processNode(item));
    return { nodes, links };
  };

  return (
    <div className="fixed top-12 right-0 w-64 h-64 bg-[#1B1E2B] border-l border-b border-gray-700">
      <ForceGraph2D
        ref={graphRef}
        graphData={createGraphData()}
        nodeRelSize={4}
        nodeLabel="name"
        linkColor={() => '#2A2F3A'}
        nodeColor="color"
        backgroundColor="#1B1E2B"
        width={256}
        height={256}
        d3AlphaDecay={0.1}
        d3VelocityDecay={0.1}
        cooldownTicks={100}
        onEngineStop={() => {
          graphRef.current.zoomToFit(400, 40);
        }}
      />
    </div>
  );
};

export default GraphView; 