@echo off

start /min cmd /c "cd apiProcessos && node app.js"

start /min http://127.0.0.1:5173/

cd processos
start /min npm run dev
