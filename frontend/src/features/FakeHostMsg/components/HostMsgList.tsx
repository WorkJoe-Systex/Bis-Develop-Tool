import React from 'react';
import { HostMsg } from '../types';

interface HostMsgListProps {
  type: 'local' | 'db';
  data: HostMsg[];
  onMove: (index: number) => void;
}

const HostMsgList: React.FC<HostMsgListProps> = ({ type, data, onMove }) => {
  const title = type === 'local' ? '🗃️ 本機電文' : '🗃️ 資料庫電文';
  const isLocal = type === 'local';

  return (
    <div style={{ width: '20%', border: '1px solid #ccc', padding: '12px', borderRadius: '8px', boxShadow: '2px 2px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>{title}</h2>
      <ul style={{ maxHeight: '80vh', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
        {data.map((msg, index) => (
          <li key={msg.id} style={{ background: '#f1f1f1', padding: '8px', borderRadius: '4px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            {isLocal ? (
              <>
                <span>{msg.hostmsg} - {msg.description}</span>
                <button onClick={() => onMove(index)}>➡</button>
              </>
            ) : (
              <>
                <button onClick={() => onMove(index)}>⬅</button>
                <span>{msg.hostmsg} - {msg.description}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HostMsgList;
