import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from './routes/routes';

// function App() {
//   return <Home />;
// }

const App: React.FC = () => {
  // const isAuthenticated = false; // 假設的驗證邏輯

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/compressed" element={<Compressed />} /> */}
        {routes.map((route, index) => (
          <Route 
            key={index} 
            path={route.path} 
            element={route.element}
            // 權限驗證用
            // element={
            //   route.requiresAuth && !isAuthenticated ? <Navigate to="/" /> : route.element
            // }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
