import React from "react";
import {
  BrowserRouter,
  HashRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import routes from "./routes/routes";
import Layout from "./components/layout/Layout";

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

const AppContent: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <AnimatePresence mode="wait">
      {isHome ? (
        <Routes location={location} key={location.pathname}>
          {routes
            .filter((route) => route.path === "/")
            .map((route, idx) => (
              <Route key={idx} path={route.path} element={route.element} />
            ))}
        </Routes>
      ) : (
        <Layout>
          <Routes location={location} key={location.pathname}>
            {routes
              .filter((route) => route.path !== "/")
              .map((route, idx) => (
                <Route key={idx} path={route.path} element={route.element} />
              ))}
          </Routes>
        </Layout>
      )}
    </AnimatePresence>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
