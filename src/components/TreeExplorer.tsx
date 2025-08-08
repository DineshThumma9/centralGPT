

import React, { useState } from 'react';

interface TreeNode {
  name: string;
  path: string;
  type: 'blob' | 'tree';
  children?: TreeNode[];
}

interface TreeProps {
  treeData: TreeNode[];
}

const TreeNodeComponent: React.FC<{ node: TreeNode }> = ({ node }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    if (node.type === 'tree') {
      setExpanded(!expanded);
    }
  };

  return (
    <div style={{ paddingLeft: 16 }}>
      <div onClick={toggle} style={{ cursor: node.type === 'tree' ? 'pointer' : 'default' }}>
        {node.type === 'tree' ? (expanded ? '📂' : '📁') : '📄'} {node.name}
      </div>
      {expanded &&
        node.children?.map(child => <TreeNodeComponent key={child.path} node={child} />)}
    </div>
  );
};

const TreeExplorer: React.FC<TreeProps> = ({ treeData }) => {
  return (
    <div>
      {treeData.map(node => (
        <TreeNodeComponent key={node.path} node={node} />
      ))}
    </div>
  );
};

export default TreeExplorer;



