import Compressed from './pages/Compressed';
import HostMsg from './pages/HostMsg';
import Home from './pages/Home';
import Test from './pages/Test';
import React from 'react';

interface Route {
  path: string;
  element: React.ReactNode;
  title?: string; // 頁面標題
  requiresAuth?: boolean; // 是否需要驗證
}

// 存放所有的路由配置
const routes: Route[] = [
  { path: '/', element: <Home /> },
  { path: '/hostmessage', element: <HostMsg /> },
  { path: '/compressed', element: <Compressed /> },
  { path: '/test', element: <Test /> },
];

export default routes;
