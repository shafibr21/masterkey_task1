import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './App.css';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Partition = ({ partition, onSplit, onRemove }) => {
  const { id, color, children, width, height } = partition;

  return (
    <ResizableBox
      width={width}
      height={height}
      minConstraints={[100, 100]}
      resizeHandles={['s', 'e']}
    >
      <div className="partition" style={{ backgroundColor: color, width: '100%', height: '100%' }}>
        {!children && (
          <div className="controls">
            <button onClick={() => onSplit(id, 'H')}>H</button>
            <button onClick={() => onSplit(id, 'V')}>V</button>
            <button onClick={() => onRemove(id)}>-</button>
          </div>
        )}
        {children && (
          <div className={`split ${children.direction}`}>
            {children.parts.map((child) => (
              <Partition key={child.id} partition={child} onSplit={onSplit} onRemove={onRemove} />
            ))}
          </div>
        )}
      </div>
    </ResizableBox>
  );
};

const App = () => {
  const [partitions, setPartitions] = useState([{ id: 0, color: getRandomColor(), width: 400, height: 400 }]);

  const handleSplit = (id, direction) => {
    setPartitions((prevPartitions) => {
      const splitPartition = (partition) => {
        if (partition.id === id) {
          const newColor = getRandomColor();
          const newPartition = { id: partitions.length, color: newColor, width: partition.width / 2, height: partition.height / 2 };
          return {
            ...partition,
            children: {
              direction,
              parts: [
                { ...partition, id: partition.id * 2 + 1, width: direction === 'H' ? partition.width : partition.width / 2, height: direction === 'H' ? partition.height / 2 : partition.height },
                { ...newPartition, id: partition.id * 2 + 2, width: direction === 'H' ? partition.width : partition.width / 2, height: direction === 'H' ? partition.height / 2 : partition.height }
              ]
            }
          };
        }
        if (partition.children) {
          return {
            ...partition,
            children: {
              ...partition.children,
              parts: partition.children.parts.map(splitPartition)
            }
          };
        }
        return partition;
      };

      return prevPartitions.map(splitPartition);
    });
  };

  const handleRemove = (id) => {
    setPartitions((prevPartitions) => {
      const removePartition = (partition) => {
        if (partition.id === id) {
          return null;
        }
        if (partition.children) {
          const newParts = partition.children.parts.map(removePartition).filter(part => part !== null);
          if (newParts.length === 0) {
            return null;
          }
          return {
            ...partition,
            children: {
              ...partition.children,
              parts: newParts
            }
          };
        }
        return partition;
      };

      return prevPartitions.map(removePartition).filter(part => part !== null);
    });
  };

  return (
    <div className="App">
      {partitions.map((partition) => (
        <Partition key={partition.id} partition={partition} onSplit={handleSplit} onRemove={handleRemove} />
      ))}
    </div>
  );
};

export default App;
