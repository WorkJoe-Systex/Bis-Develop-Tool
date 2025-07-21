# Bis Develop Tool

## 環境需求
- Node.js v18+
- npm

## 安裝
```bash
cd .\frontend
npm install

cd .\backend
npm install

## 前端啟動
npm run

## 後端啟動
npm run dev

## Electron Log location
C:\Users\2200403\AppData\Local\Temp\bis-electron-main.log

## Electron install location
C:\Users\2200403\AppData\Local\Programs\bis-develop-tool

## VScode 後端Debug設定（launch.json）：
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
    
        {
            "name": "Attach by Process ID",
            "processId": "${command:PickProcess}",
            "request": "attach",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        },
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}"
        }
    ]
}