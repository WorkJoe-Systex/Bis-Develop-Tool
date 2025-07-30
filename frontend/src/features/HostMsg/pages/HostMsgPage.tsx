import React, { useState } from 'react';
import HostMsgTable from '../components/HostMsgTable';
import ParserPage from './ParserPage';
import useNavigateToHome from '../../../hooks/useNavigateToHome';
import { parseTiTotaData } from '../services/parserService';
import BackToHomeButton from '../../../components/ui/BackToHomeButton';

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
      <BackToHomeButton />
    </div>
  );
};

export default HostMsgPage;
