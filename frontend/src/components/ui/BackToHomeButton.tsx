import React from 'react';
import useNavigateToHome from '../../hooks/useNavigateToHome';

const BackToHomeButton: React.FC = () => {
  const { goToHomePage } = useNavigateToHome();

  return (
    <div className="text-right mt-4">
      <button
        onClick={goToHomePage}
        className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded hover:bg-gray-600"
      >
        回首頁
      </button>
    </div>
  );
};

export default BackToHomeButton;
