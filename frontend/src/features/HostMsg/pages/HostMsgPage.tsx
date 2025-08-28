import React from 'react';
import HostMsgTable from '../components/HostMsgTable';
import ParserPage from './ParserPage';

const HostMsgPage: React.FC = () => {

  return (
    <div className="p-6 space-y-6">
      <section className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Host Message 列表</h2>
        <HostMsgTable />
      </section>

      <section className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">解析 Host Message</h2>
        <ParserPage />
      </section>
    </div>
  );
};

export default HostMsgPage;
