import CompressedPage from '../features/Compressed/pages/CompressedPage';
import QrcodePage from '../features/Qrcode/pages/QrcodePage';
import HostMsgPage from '../features/HostMsg/pages/HostMsgPage';
import FakeHostMsgPage from '../features/FakeHostMsg/pages/FileSyncView';
import FortifyPage from '../features/Fortify/pages/FortifyPage';
import TestPage from '../features/Test/pages/TestPage';
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
  { path: '/fakehostmessage', element: <FakeHostMsgPage /> },
  { path: '/compressed', element: <CompressedPage /> },
  { path: '/qrcode', element: <QrcodePage /> },
  { path: '/fortify', element: <FortifyPage /> },
  { path: '/test', element: <TestPage /> },
];

export default routes;
