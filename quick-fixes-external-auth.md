# Azure AD B2C External Authentication - Quick Fixes

## Most Common Issues and Solutions

### 1. "We encountered an error connecting to the identity provider" (AADB2C90289)

**Quick Fix:**
```xml
<!-- Verify your client secret key reference -->
<CryptographicKeys>
  <Key Id="client_secret" StorageReferenceId="B2C_1A_GoogleSecret" />
</CryptographicKeys>
```

**Checklist:**
- [ ] Client secret hasn't expired at the provider
- [ ] Policy key name matches the StorageReferenceId
- [ ] Client ID is correct in the metadata

### 2. "The provided grant is invalid or malformed" (AADB2C90037)

**Quick Fix:**
```xml
<!-- Ensure redirect URI matches exactly -->
<Item Key="RedirectUri">https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/oauth2/authresp</Item>
```

**Checklist:**
- [ ] Redirect URI is registered with the external provider
- [ ] No trailing slashes or extra spaces
- [ ] Using b2clogin.com (not the old login.microsoftonline.com)

### 3. Missing Email or Profile Information

**Quick Fix:**
```xml
<!-- Add proper scope and claims endpoint -->
<Metadata>
  <Item Key="scope">openid profile email</Item>
  <Item Key="ClaimsEndpoint">https://graph.facebook.com/me?fields=id,first_name,last_name,name,email</Item>
</Metadata>
```

**Provider-Specific Scopes:**
- Google: `openid profile email`
- Facebook: `public_profile email`
- Microsoft: `openid profile email`
- LinkedIn: `r_emailaddress r_liteprofile`

### 4. User Sees Generic Error Instead of Returning to App

**Quick Fix:**
```xml
<!-- Change deployment mode -->
<RelyingParty>
  <TechnicalProfile Id="PolicyProfile">
    <Metadata>
      <Item Key="DeploymentMode">Production</Item> <!-- Not Development -->
    </Metadata>
  </TechnicalProfile>
</RelyingParty>
```

### 5. Authentication Works But User Not Created

**Quick Fix:**
```xml
<!-- Ensure these claims transformations exist -->
<OutputClaimsTransformations>
  <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
  <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
  <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
</OutputClaimsTransformations>
```

### 6. Time-based Authentication Failures

**Quick Fix:**
- Ensure server time is synchronized
- Check token lifetime settings
- Consider network latency in timeout configurations

### 7. SSL/TLS Issues

**Quick Fix:**
```xml
<!-- Ensure HTTPS endpoints -->
<Item Key="authorization_endpoint">https://accounts.google.com/o/oauth2/v2/auth</Item>
<Item Key="token_endpoint">https://oauth2.googleapis.com/token</Item>
```

## Emergency Debugging Commands

### 1. Test Policy Directly
```
https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/B2C_1A_signup_signin/oauth2/v2.0/authorize?client_id=YOUR_APP_ID&response_type=id_token&redirect_uri=https://jwt.ms&response_mode=fragment&scope=openid&nonce=12345
```

### 2. Application Insights Query for Errors
```kusto
exceptions
| where timestamp > ago(1h)
| where message !contains "claim type"
| project timestamp, message, outerMessage, details
| order by timestamp desc
| take 20
```

### 3. Find Specific Correlation ID
```kusto
traces
| where timestamp > ago(24h)
| where message contains "YOUR_CORRELATION_ID"
| order by timestamp asc
```

## Provider-Specific Quick Fixes

### Google
1. Enable Google+ API in Cloud Console
2. Add authorized JavaScript origins: `https://yourtenant.b2clogin.com`
3. OAuth consent screen must be configured

### Facebook
1. App must be in "Live" mode (not Development)
2. Add platform: Website with Site URL
3. Enable "Use Strict Mode for Redirect URIs"

### Microsoft
1. Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
2. Platform configuration: Web
3. Enable ID tokens in Authentication settings

### LinkedIn
1. Products: Sign In with LinkedIn
2. Auth tab → Authorized redirect URLs
3. Requires r_liteprofile and r_emailaddress permissions

## Final Checklist Before Testing

1. **Policy Keys Created:**
   - [ ] B2C_1A_TokenSigningKeyContainer
   - [ ] B2C_1A_TokenEncryptionKeyContainer
   - [ ] Provider-specific secrets (e.g., B2C_1A_GoogleSecret)

2. **Provider Configuration:**
   - [ ] Client ID and Secret match
   - [ ] Redirect URI registered
   - [ ] Required APIs/permissions enabled
   - [ ] App is in production/live mode

3. **Custom Policy:**
   - [ ] Base policy referenced correctly
   - [ ] Technical profiles have required metadata
   - [ ] Claims transformations referenced exist
   - [ ] User journey includes external provider

4. **Testing:**
   - [ ] Clear browser cache/cookies
   - [ ] Test in incognito/private mode
   - [ ] Try different browsers
   - [ ] Check Application Insights logs

## Still Having Issues?

1. Enable Developer Mode in your policy
2. Set Application Insights to capture all events
3. Use correlation ID to trace the full flow
4. Check the [Azure AD B2C samples](https://github.com/azure-ad-b2c/samples)
5. Post on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-ad-b2c) with correlation ID and error details