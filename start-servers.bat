@echo off
echo Starting backend and frontend servers...

start "Backend" cmd /k "cd backend && npm start"
start "Frontend" cmd /k "cd frontend && npm start"

echo Started backend and frontend servers in new windows.
