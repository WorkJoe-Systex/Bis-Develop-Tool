import { useNavigate } from 'react-router-dom';

const useNavigateToHome = () => {
  // `useNavigate()`進行路由跳轉
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/'); // 跳轉到首頁
  };

  return { goToHomePage };
};

export default useNavigateToHome;
