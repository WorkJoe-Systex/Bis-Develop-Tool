import React from 'react';
import useNavigateToHome from '../hooks/useNavigateToHome';

const HostMsg: React.FC = () => {
  const { goToHomePage } = useNavigateToHome();

  return (
    <div>
      <h1>This is HostMsg</h1>
      <h1>HostMsg Page</h1>
      
      <p>This is the HostMsg functionality page.</p>
      <p><button onClick={goToHomePage}>Back</button></p>
    </div>
  );
};

export default HostMsg;
