@echo off
setlocal
set NODE_PATH=%~dp0vendor_modules
set SERVER_JS=%~dp0..\app.asar.unpacked\backend\dist\server.js
"%~dp0node.exe" "%SERVER_JS%"