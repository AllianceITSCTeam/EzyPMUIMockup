$ErrorActionPreference = "Stop"

# Create docs folder
New-Item -ItemType Directory -Force -Path "docs" | Out-Null

# Copy subfolders
Copy-Item -Path "..\Brainstorm 01\docs\images" -Destination "docs\" -Recurse -Force
Copy-Item -Path "..\Brainstorm 01\docs\requirements" -Destination "docs\" -Recurse -Force
Copy-Item -Path "..\Brainstorm 01\docs\summary" -Destination "docs\" -Recurse -Force

# Copy prototype04 to table
Copy-Item -Path "..\Brainstorm 01\prototype04" -Destination "table" -Recurse -Force

# Git operations
git checkout -b dev
git add .
git commit -m "Initial commit: copy docs and table from prototype04"
git push -u origin dev

# Try to set default branch via gh CLI
try {
    gh repo edit AllianceITSCTeam/EzyPMUIMockup --default-branch dev
    Write-Host "Set default branch to dev successfully."
} catch {
    Write-Host "Failed to set default branch with gh CLI. You might have to set it manually."
    # We swallow this error so it doesn't block the next commands
}

# Create release branch
git checkout -b release-260326-09-19
git push -u origin release-260326-09-19

Write-Host "All tasks finished successfully!"
