@echo off
chcp 65001 >nul
title BIS 開發工具 - 打包流程
setlocal enabledelayedexpansion

:: === 是否複製 node_modules ===
:askCopy
set /p "COPY_NODE=是否需要複製 node_modules？(y/n): "
if /i "%COPY_NODE%"=="y" (
    set "doCopy=true"
) else if /i "%COPY_NODE%"=="n" (
    set "doCopy=false"
) else (
    echo ❗ 輸入錯誤，請輸入 y 或 n。
    goto askCopy
)

echo 🔄 清除舊的 build 目錄...
call npm run clean || echo ❌ clean 失敗了

:: === 複製 node_modules（可選） ===
if "%doCopy%"=="true" (
    echo 📦 複製 node_modules → vendor_modules
    echo 📦 複製 node_modules → vendor_modules
    xcopy /E /I /Y backend\node_modules backend\vendor_modules >nul
)

echo 🚀 開始打包 Electron...
call npm run dist || echo ❌ 打包失敗

echo 🔁 還原資料庫 data.db...
copy /Y "%LocalAppData%\Programs\bis-develop-tool\resources\backend\data\data.db" "%LocalAppData%\Programs\bis-develop-tool\resources\app.asar.unpacked\backend\data\data.db"

echo ✅ 打包成功完成！

echo.
pause
