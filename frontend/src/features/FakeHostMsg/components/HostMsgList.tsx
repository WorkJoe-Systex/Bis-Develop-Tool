import React from 'react';
import type { HostMsg } from '../types';

interface HostMsgListProps {
  type: 'local' | 'db';
  data: HostMsg[];
  onMove: (index: number) => void;
}

const HostMsgList: React.FC<HostMsgListProps> = ({ type, data, onMove }) => {
  const isLocal = type === 'local';

  return (
    <>
      {data.map((msg, index) => (
        <div
          key={msg.id}
          className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center text-sm hover:bg-gray-200"
        >
          {isLocal ? (
            <>
              <span>{msg.hostmsg} - {msg.description}</span>
              <button
                onClick={() => onMove(index)}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ➡
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onMove(index)}
                className="mr-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ⬅
              </button>
              <span className="flex-1">{msg.hostmsg} - {msg.description}</span>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default HostMsgList;
