if (Test-Path "frontend\.git") { Remove-Item -Path "frontend\.git" -Recurse -Force }
if (Test-Path "mobile\.git") { Remove-Item -Path "mobile\.git" -Recurse -Force }
if (Test-Path "frontend\.gitignore") { Remove-Item -Path "frontend\.gitignore" -Force }
if (Test-Path "mobile\.gitignore") { Remove-Item -Path "mobile\.gitignore" -Force }
if (Test-Path "frontend\README.md") { Remove-Item -Path "frontend\README.md" -Force }
if (Test-Path "backend\README.md") { Remove-Item -Path "backend\README.md" -Force }
if (Test-Path "mobile\README.md") { Remove-Item -Path "mobile\README.md" -Force }
git rm --cached frontend
git rm --cached mobile
