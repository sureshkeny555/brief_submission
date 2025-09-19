# Power Apps Portal Health Check Script
# This script helps diagnose and fix WebSiteNode/WebFileNode errors

param(
    [Parameter(Mandatory=$true)]
    [string]$PortalUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$TenantId,
    
    [Parameter(Mandatory=$false)]
    [string]$PortalId
)

# Function to check portal availability
function Test-PortalAvailability {
    param([string]$Url)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Portal is accessible" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "✗ Portal is not accessible: $_" -ForegroundColor Red
        return $false
    }
}

# Function to check authentication endpoint
function Test-AuthenticationEndpoint {
    param([string]$BaseUrl)
    
    $authUrl = "$BaseUrl/Account/Login/ExternalAuthenticationFailed"
    try {
        $response = Invoke-WebRequest -Uri $authUrl -UseBasicParsing -TimeoutSec 30
        Write-Host "✓ Authentication endpoint is responding" -ForegroundColor Green
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "⚠ Authentication endpoint returned 404 - This might be normal" -ForegroundColor Yellow
        }
        else {
            Write-Host "✗ Authentication endpoint error: $_" -ForegroundColor Red
        }
    }
}

# Function to clear portal cache
function Clear-PortalCache {
    param([string]$BaseUrl)
    
    $cacheUrl = "$BaseUrl/_services/about"
    Write-Host "Please navigate to: $cacheUrl and click 'Clear Cache'" -ForegroundColor Cyan
    Write-Host "Press Enter when completed..."
    Read-Host
}

# Function to get portal diagnostics
function Get-PortalDiagnostics {
    param([string]$BaseUrl)
    
    Write-Host "`n=== Portal Diagnostics ===" -ForegroundColor Cyan
    
    # Check various endpoints
    $endpoints = @(
        "/_resources/css/bootstrap.min.css",
        "/_resources/js/jquery.min.js",
        "/Account/Login",
        "/_services/about"
    )
    
    foreach ($endpoint in $endpoints) {
        $url = "$BaseUrl$endpoint"
        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
            Write-Host "✓ $endpoint - Status: $($response.StatusCode)" -ForegroundColor Green
        }
        catch {
            Write-Host "✗ $endpoint - Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Main execution
Write-Host "Power Apps Portal Health Check" -ForegroundColor Yellow
Write-Host "==============================" -ForegroundColor Yellow

# Test portal availability
Write-Host "`nChecking portal availability..."
$isAvailable = Test-PortalAvailability -Url $PortalUrl

if ($isAvailable) {
    # Run diagnostics
    Get-PortalDiagnostics -BaseUrl $PortalUrl
    
    # Test authentication
    Write-Host "`nChecking authentication endpoint..."
    Test-AuthenticationEndpoint -BaseUrl $PortalUrl
    
    # Suggest cache clearing
    Write-Host "`n=== Recommended Actions ===" -ForegroundColor Yellow
    Write-Host "1. Clear portal cache" -ForegroundColor White
    Clear-PortalCache -BaseUrl $PortalUrl
    
    Write-Host "`n2. If using PowerShell with admin access:" -ForegroundColor White
    Write-Host "   Install-Module Microsoft.PowerApps.Administration.PowerShell" -ForegroundColor Gray
    Write-Host "   Add-PowerAppsAccount" -ForegroundColor Gray
    Write-Host "   Reset-AdminPowerAppPortal -PortalId 'your-portal-id'" -ForegroundColor Gray
    
    Write-Host "`n3. Check Dataverse for website record:" -ForegroundColor White
    Write-Host "   - Ensure website record is active" -ForegroundColor Gray
    Write-Host "   - Verify primary domain matches portal URL" -ForegroundColor Gray
    Write-Host "   - Check all related web files are published" -ForegroundColor Gray
}
else {
    Write-Host "`n✗ Portal is not accessible. Please check:" -ForegroundColor Red
    Write-Host "  - Portal is not stopped in admin center" -ForegroundColor White
    Write-Host "  - DNS settings are correct" -ForegroundColor White
    Write-Host "  - Portal provisioning is complete" -ForegroundColor White
}

Write-Host "`n=== Additional Steps ===" -ForegroundColor Yellow
Write-Host "1. Check Application Insights for detailed error logs" -ForegroundColor White
Write-Host "2. Verify all site settings in Portal Management app" -ForegroundColor White
Write-Host "3. Ensure all web files have proper permissions" -ForegroundColor White
Write-Host "4. Check external authentication provider configuration" -ForegroundColor White

Write-Host "`nScript completed." -ForegroundColor Green