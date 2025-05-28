import CompressedPage from '../features/compressed/pages/CompressedPage';
import HostMsgPage from '../features/hostMsg/pages/HostMsgPage';
import TestPage from '../features/test/pages/TestPage';
import Home from '../pages/Home';
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
  { path: '/hostmessage', element: <HostMsgPage /> },
  { path: '/compressed', element: <CompressedPage /> },
  { path: '/test', element: <TestPage /> },
];

export default routes;
