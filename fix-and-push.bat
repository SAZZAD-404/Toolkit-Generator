@echo off
echo ========================================
echo   Fix and Push to GitHub
echo   Repository: Toolkit-Generator
echo ========================================
echo.

echo [1/4] Pulling remote changes...
git pull origin main --allow-unrelated-histories --no-edit
echo.

echo [2/4] Adding all files...
git add .
echo.

echo [3/4] Committing merged changes...
git commit -m "Merge and update: Complete Web Toolkit Generators project"
echo.

echo [4/4] Pushing to GitHub...
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
