import React from 'react';
import useNavigateToHome from '../hooks/useNavigateToHome';

const Compressed: React.FC = () => {
  const { goToHomePage } = useNavigateToHome();

  return (
    <div>
      <h1>This is Compressed</h1>
      <h1>Compressed Page</h1>
      
      <p>This is the Compressed functionality page.</p>
      <p><button onClick={goToHomePage}>Back</button></p>
    </div>
  );
};

export default Compressed;
