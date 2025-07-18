import React from 'react';
import { useNavigate } from 'react-router-dom';
import UpdatePathForm from '../components/form/UpdatePathForm';

const Home: React.FC = () => {
  // `useNavigate()`進行路由跳轉
  const navigate = useNavigate();

  const goToHostMsg = () => {
    navigate('/hostmessage'); // 跳轉至 /hostmessage
  };

  const goToCompressed = () => {
    navigate('/compressed'); // 跳轉至 /compressed
  };
  
  const goToQrcode = () => {
    navigate('/qrcode'); // 跳轉至 /qrcode
  };

  const goToTest = () => {
    navigate('/test'); // 跳轉至 /test
  };

  return (
    <div>
      <h1>Main Page</h1>
      <UpdatePathForm />
      <ul>
        <li>
          Host Message Parser/Replace <button onClick={goToHostMsg}>Go</button>
        </li>
        <li>
          Compressed <button onClick={goToCompressed}>Go</button>
        </li>
        <li>
          QRcode <button onClick={goToQrcode}>Go</button>
        </li>
        <li>
          Test <button onClick={goToTest}>Go</button>
        </li>
      </ul>
    </div>
  );
};

export default Home;
