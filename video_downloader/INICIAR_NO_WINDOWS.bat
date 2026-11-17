@echo off
cd /d "%~dp0"
where py >nul 2>nul
if errorlevel 1 (
  echo Python nao foi encontrado. Instale Python 3.10 ou superior.
  pause
  exit /b 1
)
py -m pip install -r requirements.txt
if errorlevel 1 (
  echo Falha ao instalar as dependencias.
  pause
  exit /b 1
)
echo.
echo Abra no navegador: http://127.0.0.1:5000
echo Para encerrar, feche esta janela.
py app.py
pause
