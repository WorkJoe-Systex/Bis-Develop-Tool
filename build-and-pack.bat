@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: === 初始化 log 與時間 ===
set "logFile=build-log.txt"
set "startTime=%time%"
echo ============================== > %logFile%
echo 🕒 開始時間: %date% %time% >> %logFile%
echo ============================== >> %logFile%
echo.

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

:: === 清除舊檔 ===
echo 🔄 清除舊的 build 目錄
echo 🔄 清除舊的 build 目錄 >> %logFile%
call npm run clean >> %logFile% 2>&1
call :animate

:: === 複製 node_modules（可選） ===
if "%doCopy%"=="true" (
    echo 📦 複製 node_modules → vendor_modules
    echo 📦 複製 node_modules → vendor_modules >> %logFile%
    xcopy /E /I /Y backend\node_modules backend\vendor_modules >> %logFile% 2>&1
    call :animate
)

:: === 打包 electron-builder ===
echo 🚀 開始打包 Electron 請稍候...
echo 🚀 開始打包 Electron 請稍候... >> %logFile%
call npm run dist >> %logFile% 2>&1
call :animate

:: === 還原 DB（覆蓋）===
echo 🔁 還原資料庫 data.db 請稍候...
echo 🔁 還原資料庫 data.db 請稍候... >> %logFile%
copy /Y "%LocalAppData%\Programs\bis-develop-tool\resources\backend\data\data.db" ^
 "%LocalAppData%\Programs\bis-develop-tool\resources\app.asar.unpacked\backend\data\data.db" >> %logFile% 2>&1
call :animate

:: === 計算總耗時 ===
set "endTime=%time%"
call :timeDiff "%startTime%" "%endTime%" durationSec

:: === 完成 ===
echo.
echo ✅ 打包流程完成！
echo ✅ 打包流程完成！ >> %logFile%
echo ⏱️ 總耗時: %durationSec% 秒 >> %logFile%
echo 📄 Log 輸出於: %logFile%
echo.
pause
exit /b

:: === 動畫 (3點動畫) ===
:animate
<nul set /p=.
ping -n 2 127.0.0.1 >nul
<nul set /p=.
ping -n 2 127.0.0.1 >nul
<nul set /p=.
ping -n 2 127.0.0.1 >nul
echo.
goto :eof

:: === 時間差計算 ===
:timeDiff
setlocal EnableDelayedExpansion
set "start=%~1"
set "end=%~2"

:: 拆解時間（HH:MM:SS）
for /f "tokens=1-3 delims=:.," %%a in ("%start%") do (
    set /a "startSec=%%a*3600 + %%b*60 + %%c"
)
for /f "tokens=1-3 delims=:.," %%a in ("%end%") do (
    set /a "endSec=%%a*3600 + %%b*60 + %%c"
)
:: 處理跨午夜情況
if !endSec! LSS !startSec! (
    set /a "endSec+=86400"
)
set /a durationSec=!endSec! - !startSec!
endlocal & set "%~3=%durationSec%"
goto :eof
