import React, { useState } from 'react';
import HostMsgTable from '../components/HostMsgTable';
import ParserPage from './ParserPage';
import useNavigateToHome from '../../../hooks/useNavigateToHome';
import { parseTiTotaData } from '../services/parserService';

const HostMsgPage: React.FC = () => {
  const { goToHomePage } = useNavigateToHome();

  return (
    <div>
      <div id="Table">
        <HostMsgTable />
      </div>
      <div>
        <ParserPage />
      </div>
      <div>

      </div>
      <div>
        <p>
          <button onClick={goToHomePage}>Back</button>
        </p>
      </div>
    </div>
  );
};

export default HostMsgPage;
