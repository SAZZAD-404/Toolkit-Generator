@echo off
echo ========================================
echo   GitHub Push Script
echo   Repository: Toolkit-Generators
echo ========================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    echo After installation, restart this script.
    echo.
    pause
    exit /b 1
)

echo Git found! Proceeding...
echo.

REM Check if git is initialized
if not exist .git (
    echo [1/5] Initializing Git repository...
    git init
    echo.
) else (
    echo [1/5] Git repository already initialized
    echo.
)

REM Add all files
echo [2/5] Adding files to Git...
git add .
echo.

REM Commit
echo [3/5] Committing files...
git commit -m "Initial commit: Toolkit Generator"
echo.

REM Add remote
echo [4/5] Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/SAZZAD-404/Toolkit-Generator.git
echo.

REM Set main branch and push
echo [5/5] Pushing to GitHub...
git branch -M main
git push -u origin main
echo.

echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Your code has been pushed to:
echo https://github.com/SAZZAD-404/Toolkit-Generator
echo.
echo Visit the URL to see your repository!
echo.
pause
