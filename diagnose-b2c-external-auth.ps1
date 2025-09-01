# Azure AD B2C External Authentication Diagnostics Script
# This script helps diagnose common configuration issues with external identity providers

param(
    [Parameter(Mandatory=$true)]
    [string]$TenantName,
    
    [Parameter(Mandatory=$true)]
    [string]$PolicyId,
    
    [Parameter(Mandatory=$false)]
    [string]$CorrelationId
)

# Function to display colored output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Yellow "=========================================="
Write-ColorOutput Yellow "Azure AD B2C External Auth Diagnostics"
Write-ColorOutput Yellow "=========================================="
Write-Output ""

# Check if Az module is installed
if (-not (Get-Module -ListAvailable -Name Az)) {
    Write-ColorOutput Red "Azure PowerShell module not found. Please install it using:"
    Write-ColorOutput Cyan "Install-Module -Name Az -AllowClobber -Scope CurrentUser"
    exit 1
}

# Connect to Azure
Write-Output "Connecting to Azure..."
try {
    Connect-AzAccount -ErrorAction Stop | Out-Null
    Write-ColorOutput Green "✓ Connected to Azure"
} catch {
    Write-ColorOutput Red "✗ Failed to connect to Azure: $_"
    exit 1
}

# Get B2C tenant
$b2cTenant = "$TenantName.onmicrosoft.com"
Write-Output ""
Write-Output "Checking B2C Tenant: $b2cTenant"

# Set the context to B2C tenant
try {
    Set-AzContext -TenantId $b2cTenant -ErrorAction Stop | Out-Null
    Write-ColorOutput Green "✓ B2C tenant found and accessible"
} catch {
    Write-ColorOutput Red "✗ Failed to access B2C tenant: $_"
    exit 1
}

Write-Output ""
Write-ColorOutput Cyan "Checking Policy Configuration..."
Write-Output "Policy ID: $PolicyId"

# Function to check policy keys
function Check-PolicyKeys {
    Write-Output ""
    Write-ColorOutput Cyan "Checking Policy Keys..."
    
    $requiredKeys = @(
        "B2C_1A_TokenSigningKeyContainer",
        "B2C_1A_TokenEncryptionKeyContainer"
    )
    
    $providerKeys = @(
        "B2C_1A_GoogleSecret",
        "B2C_1A_FacebookSecret",
        "B2C_1A_MSASecret",
        "B2C_1A_LinkedInSecret",
        "B2C_1A_TwitterSecret"
    )
    
    # Check required keys
    foreach ($key in $requiredKeys) {
        Write-Output "  Checking $key..."
        # Note: We can't directly query policy keys via PowerShell, so we provide guidance
        Write-ColorOutput Yellow "  → Please verify this key exists in Identity Experience Framework → Policy Keys"
    }
    
    # Check provider-specific keys
    Write-Output ""
    Write-Output "  Provider-specific keys (check those you're using):"
    foreach ($key in $providerKeys) {
        Write-ColorOutput Yellow "  → $key (if using ${key.Split('_')[2].Replace('Secret','')})"
    }
}

# Function to check Application Insights
function Check-ApplicationInsights {
    Write-Output ""
    Write-ColorOutput Cyan "Checking Application Insights Configuration..."
    
    if ($CorrelationId) {
        Write-Output "Searching for correlation ID: $CorrelationId"
        Write-ColorOutput Yellow "→ Run this KQL query in Application Insights:"
        Write-Output ""
        Write-ColorOutput White @"
traces
| where timestamp > ago(24h)
| where message contains "$CorrelationId" or customDimensions contains "$CorrelationId"
| order by timestamp asc
"@
        Write-Output ""
        Write-ColorOutput White @"
exceptions
| where timestamp > ago(24h)
| where message contains "$CorrelationId" or customDimensions contains "$CorrelationId"
| order by timestamp desc
"@
    }
}

# Function to check common redirect URI patterns
function Check-RedirectURIs {
    Write-Output ""
    Write-ColorOutput Cyan "Common Redirect URI Patterns..."
    
    $redirectUri = "https://$TenantName.b2clogin.com/$TenantName.onmicrosoft.com/oauth2/authresp"
    
    Write-Output "Standard redirect URI for external providers:"
    Write-ColorOutput Green $redirectUri
    
    Write-Output ""
    Write-Output "Alternative formats (if using custom domain):"
    Write-ColorOutput Yellow "https://<your-domain>/$TenantName.onmicrosoft.com/oauth2/authresp"
    
    Write-Output ""
    Write-ColorOutput Yellow "→ Ensure this exact URI is registered with each external identity provider"
}

# Function to check common errors
function Check-CommonErrors {
    Write-Output ""
    Write-ColorOutput Cyan "Common Error Patterns and Solutions..."
    
    $errors = @{
        "AADB2C90037" = @{
            Description = "The provided grant is invalid or malformed"
            Solutions = @(
                "Verify client_id matches exactly with external provider",
                "Check that redirect URI is correctly registered",
                "Ensure authorization code hasn't expired"
            )
        }
        "AADB2C90088" = @{
            Description = "The provided grant has expired"
            Solutions = @(
                "User took too long to complete authentication",
                "Check time synchronization between servers",
                "Reduce authentication flow complexity"
            )
        }
        "AADB2C90289" = @{
            Description = "Error connecting to identity provider"
            Solutions = @(
                "Verify client secret is correct and not expired",
                "Check network connectivity to provider endpoints",
                "Ensure provider endpoints URLs are correct",
                "Verify SSL/TLS requirements are met"
            )
        }
        "AADB2C90090" = @{
            Description = "Missing required parameter"
            Solutions = @(
                "Check scope configuration matches provider requirements",
                "Verify all required claims are mapped",
                "Ensure response_type is correctly set"
            )
        }
    }
    
    foreach ($errorCode in $errors.Keys) {
        Write-Output ""
        Write-ColorOutput Yellow "Error: $errorCode"
        Write-Output "Description: $($errors[$errorCode].Description)"
        Write-Output "Solutions:"
        foreach ($solution in $errors[$errorCode].Solutions) {
            Write-Output "  • $solution"
        }
    }
}

# Function to generate test URLs
function Generate-TestURLs {
    Write-Output ""
    Write-ColorOutput Cyan "Test URLs..."
    
    $baseUrl = "https://$TenantName.b2clogin.com/$TenantName.onmicrosoft.com"
    $testUrl = "$baseUrl/$PolicyId/oauth2/v2.0/authorize?client_id=<YOUR_APP_ID>&response_type=id_token&redirect_uri=https://jwt.ms&response_mode=fragment&scope=openid&nonce=12345"
    
    Write-Output "Test your policy with jwt.ms:"
    Write-ColorOutput Green $testUrl
    Write-Output ""
    Write-ColorOutput Yellow "→ Replace <YOUR_APP_ID> with your application ID"
}

# Function to check provider-specific configurations
function Check-ProviderConfigs {
    Write-Output ""
    Write-ColorOutput Cyan "Provider-Specific Configuration Checklist..."
    
    Write-Output ""
    Write-ColorOutput Yellow "Google:"
    Write-Output "  • Enable Google+ API in Google Cloud Console"
    Write-Output "  • Add redirect URI: $redirectUri"
    Write-Output "  • Authorized JavaScript origins: https://$TenantName.b2clogin.com"
    
    Write-Output ""
    Write-ColorOutput Yellow "Facebook:"
    Write-Output "  • Add redirect URI in Facebook Login → Settings"
    Write-Output "  • Enable 'Client OAuth Login' and 'Web OAuth Login'"
    Write-Output "  • Add to Valid OAuth Redirect URIs: $redirectUri"
    
    Write-Output ""
    Write-ColorOutput Yellow "Microsoft:"
    Write-Output "  • Register as 'Web' platform in Azure AD"
    Write-Output "  • Add redirect URI: $redirectUri"
    Write-Output "  • Enable 'ID tokens' in Authentication settings"
}

# Run all checks
Check-PolicyKeys
Check-ApplicationInsights
Check-RedirectURIs
Check-CommonErrors
Generate-TestURLs
Check-ProviderConfigs

Write-Output ""
Write-ColorOutput Green "=========================================="
Write-ColorOutput Green "Diagnostics Complete"
Write-ColorOutput Green "=========================================="
Write-Output ""
Write-Output "Next steps:"
Write-Output "1. Review any warnings or errors above"
Write-Output "2. Check Application Insights for detailed error logs"
Write-Output "3. Test with the provided test URL"
Write-Output "4. If issues persist, enable Developer Mode in your policy"
Write-Output ""