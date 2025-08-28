import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import routes from "./routes/routes";
import Layout from "./components/layout/Layout";

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
