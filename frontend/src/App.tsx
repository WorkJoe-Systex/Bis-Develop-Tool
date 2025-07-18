import React from 'react';
import { BrowserRouter,
  HashRouter,
  Route,
  Routes } from 'react-router-dom';
import routes from './routes/routes';

declare global {
  interface Window {
    process?: {
      type?: string;
    };
  }
}

// 判斷是否為 Electron 環境
const isElectron = Boolean(
  window && window.process && window.process.type
);

const Router = isElectron ? HashRouter : BrowserRouter;

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
