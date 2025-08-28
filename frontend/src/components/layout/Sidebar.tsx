import React from "react";
import useNavigateToHome from "../../hooks/useNavigateToHome";

const Sidebar: React.FC<{ collapsed: boolean; setCollapsed: (v: boolean) => void }> = ({
  collapsed,
  setCollapsed,
}) => {
  const { goToHomePage } = useNavigateToHome();
  return (
    <div className="flex flex-col h-full">
      {/* 收折按鈕 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 bg-gray-700 hover:bg-gray-600 text-sm"
      >
        {collapsed ? "➡️" : "⬅️"}
      </button>

      {/* Menu */}
      <nav className="flex-1 mt-4 space-y-2 px-2">
        <button onClick={goToHomePage} className="block hover:bg-gray-700 p-2 rounded">
          {collapsed ? "🏠" : "🏠 首頁"}
        </button>
        <a href="/hostmessage" className="block hover:bg-gray-700 p-2 rounded">
          {collapsed ? "🧾" : "🧾 電文解析"}
        </a>
        <a href="/fakehostmessage" className="block hover:bg-gray-700 p-2 rounded">
          {collapsed ? "📇" : "📇 假電文"}
        </a>
        <a href="/compressed" className="block hover:bg-gray-700 p-2 rounded">
          {collapsed ? "🗃️" : "🗃️ 打包程式"}
        </a>
        <a href="/qrcode" className="block hover:bg-gray-700 p-2 rounded">
          {collapsed ? "🔲" : "🔲 QRCode"}
        </a>
        <a href="/fortify" className="block hover:bg-gray-700 p-2 rounded">
          {collapsed ? "🔎" : "🔎 打包弱掃程式"}
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
