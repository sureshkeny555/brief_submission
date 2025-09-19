# Power Apps Portal Error Fix Guide

## Error: Exception occurred while obtaining WebSiteNode and WebFileNode

### Quick Fixes

1. **Restart Portal**
   ```powershell
   # In Power Apps Portal Admin Center
   # Go to Portal Actions > Restart
   ```

2. **Clear Portal Cache**
   ```
   https://[your-portal-url]/_services/about
   # Click "Clear Cache"
   ```

3. **Sync Configuration**
   ```
   # In Portal Management App
   # Go to Website > Your Website Record
   # Click "Sync Configuration"
   ```

### Detailed Solutions

#### 1. Verify Website Configuration

```sql
-- Check website record in Dataverse
SELECT 
    adx_websiteid,
    adx_name,
    statecode,
    adx_primarydomainname
FROM adx_website
WHERE adx_name = 'Your Portal Name'
```

#### 2. Check Web Files

```sql
-- Verify web files exist
SELECT 
    adx_webfileid,
    adx_name,
    adx_partialurl,
    statecode
FROM adx_webfile
WHERE adx_websiteid = 'your-website-id'
AND adx_name LIKE '%css%'
```

#### 3. Fix Authentication Settings

**For Azure AD B2C:**
```xml
<!-- In site settings -->
<add key="Authentication/OpenIdConnect/AzureADB2C/Authority" value="https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/B2C_1_SignUpSignIn/v2.0" />
<add key="Authentication/OpenIdConnect/AzureADB2C/ClientId" value="your-client-id" />
<add key="Authentication/OpenIdConnect/AzureADB2C/RedirectUri" value="https://yourportal.powerappsportals.com/signin-oidc" />
```

#### 4. Portal Site Settings to Verify

| Setting Name | Expected Value | Purpose |
|--------------|----------------|---------|
| Authentication/Registration/Enabled | true | Enable registration |
| Authentication/OpenIdConnect/Enabled | true | Enable external auth |
| HTTP/X-Frame-Options | SAMEORIGIN | Security setting |

#### 5. PowerShell Script for Diagnostics

```powershell
# Connect to Dataverse
Install-Module Microsoft.PowerApps.Administration.PowerShell
Add-PowerAppsAccount

# Get portal details
$portalId = "your-portal-id"
$portal = Get-AdminPowerAppPortal -PortalId $portalId

# Check portal status
Write-Host "Portal Status: $($portal.PortalStatus)"
Write-Host "Portal URL: $($portal.PortalUrl)"

# Restart portal if needed
if ($portal.PortalStatus -ne "Active") {
    Reset-AdminPowerAppPortal -PortalId $portalId
}
```

### Prevention Measures

1. **Regular Health Checks**
   - Monitor portal availability
   - Check error logs daily
   - Set up alerts for critical errors

2. **Backup Configuration**
   - Export portal configuration regularly
   - Document all customizations
   - Maintain version control

3. **Testing Protocol**
   - Test authentication flows after updates
   - Verify all web files after deployment
   - Check portal performance metrics

### Emergency Contacts

- **Microsoft Support**: Create a support ticket if issue persists
- **Portal Admin Center**: https://[region].admin.powerplatform.microsoft.com/
- **Documentation**: https://docs.microsoft.com/en-us/power-apps/maker/portals/