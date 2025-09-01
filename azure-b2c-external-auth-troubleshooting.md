# Azure AD B2C External Login Authentication Failed - Troubleshooting Guide

## Overview
This guide provides comprehensive troubleshooting steps for resolving "external login authentication failed" errors in Azure AD B2C custom policies. These errors typically occur when integrating external identity providers (Google, Facebook, Microsoft, etc.) with your B2C tenant.

## Common Error Codes and Their Meanings

### AADB2C90037
**Error:** The provided grant is invalid or malformed.
**Cause:** Issues with authorization code or token exchange.

### AADB2C90088
**Error:** The provided grant has expired.
**Cause:** The authorization code has expired before token exchange.

### AADB2C90289
**Error:** We encountered an error connecting to the identity provider.
**Cause:** Configuration mismatch or connectivity issues.

### AADB2C90090
**Error:** The authentication failed because of a missing parameter.
**Cause:** Required parameters are missing in the authentication flow.

## Step-by-Step Troubleshooting

### 1. Enable Application Insights

First, enable Application Insights to capture detailed error information:

```xml
<TrustFrameworkPolicy>
  <UserJourneys>
    <UserJourney Id="SignUpOrSignIn">
      <OrchestrationSteps>
        <!-- Your orchestration steps -->
      </OrchestrationSteps>
      <JourneyInsights TelemetryEngine="ApplicationInsights" 
                       InstrumentationKey="YOUR_APP_INSIGHTS_KEY" 
                       DeveloperMode="true" 
                       ClientEnabled="true" 
                       ServerEnabled="true" 
                       TelemetryVersion="1.0.0" />
    </UserJourney>
  </UserJourneys>
</TrustFrameworkPolicy>
```

### 2. Verify External Identity Provider Configuration

#### Check Client ID and Secret
Ensure your technical profile has the correct client ID:

```xml
<TechnicalProfile Id="Google-OAuth2">
  <DisplayName>Google</DisplayName>
  <Protocol Name="OAuth2" />
  <Metadata>
    <Item Key="ProviderName">google</Item>
    <Item Key="authorization_endpoint">https://accounts.google.com/o/oauth2/v2/auth</Item>
    <Item Key="token_endpoint">https://oauth2.googleapis.com/token</Item>
    <Item Key="scope">openid profile email</Item>
    <Item Key="HttpBinding">POST</Item>
    <Item Key="client_id">YOUR_GOOGLE_CLIENT_ID</Item>
    <Item Key="UsePolicyInRedirectUri">false</Item>
  </Metadata>
  <CryptographicKeys>
    <Key Id="client_secret" StorageReferenceId="B2C_1A_GoogleSecret" />
  </CryptographicKeys>
  <!-- Rest of configuration -->
</TechnicalProfile>
```

#### Verify Policy Keys in Azure Portal
1. Navigate to Azure AD B2C → Identity Experience Framework → Policy keys
2. Ensure you have created policy keys for:
   - External provider secrets (e.g., `B2C_1A_GoogleSecret`)
   - Token signing key (`B2C_1A_TokenSigningKeyContainer`)
   - Token encryption key (`B2C_1A_TokenEncryptionKeyContainer`)

### 3. Validate Redirect URIs

Ensure redirect URIs match between B2C and external provider:

#### For Google:
- Format: `https://YOUR_TENANT.b2clogin.com/YOUR_TENANT.onmicrosoft.com/oauth2/authresp`
- Add to Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs

#### For Facebook:
- Format: `https://YOUR_TENANT.b2clogin.com/YOUR_TENANT.onmicrosoft.com/oauth2/authresp`
- Add to Facebook App → Facebook Login → Settings → Valid OAuth Redirect URIs

#### For Microsoft (Azure AD):
- Format: `https://YOUR_TENANT.b2clogin.com/YOUR_TENANT.onmicrosoft.com/oauth2/authresp`
- Add to Azure AD App Registration → Authentication → Redirect URIs

### 4. Debug with Application Insights

Query Application Insights for detailed error information:

```kusto
// Find all exceptions
exceptions
| where timestamp > ago(1h)
| where cloud_RoleName contains "B2C"
| project timestamp, message, details
| order by timestamp desc

// Find specific correlation ID
traces
| where timestamp > ago(1h)
| where message contains "YOUR_CORRELATION_ID"
| order by timestamp asc

// Find authentication failures
customEvents
| where timestamp > ago(1h)
| where name == "AuthenticationFailed"
| project timestamp, customDimensions
```

### 5. Common Configuration Fixes

#### Fix Missing Output Claims
If you see errors about missing output claims:

```xml
<TechnicalProfile Id="Facebook-OAUTH">
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="id" />
    <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
    <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
    <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="facebook.com" />
    <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
  </OutputClaims>
  <OutputClaimsTransformations>
    <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
    <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
    <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
  </OutputClaimsTransformations>
</TechnicalProfile>
```

#### Fix Scope Issues
Ensure you're requesting the correct scopes:

```xml
<!-- Google example -->
<Item Key="scope">openid profile email</Item>

<!-- Facebook example -->
<Item Key="scope">public_profile email</Item>

<!-- Microsoft example -->
<Item Key="scope">openid profile email</Item>
```

### 6. Test Authentication Flow

#### Use B2C's Built-in Testing
1. Go to Azure AD B2C → User flows (or Custom policies)
2. Select your policy
3. Click "Run user flow"
4. Select application and reply URL
5. Click "Run user flow" and test the external provider

#### Enable Development Mode for Better Error Messages
```xml
<TrustFrameworkPolicy>
  <BasePolicy>
    <TenantId>YOUR_TENANT.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkBase</PolicyId>
  </BasePolicy>
  <BuildingBlocks>
    <!-- Your building blocks -->
  </BuildingBlocks>
  <ClaimsProviders>
    <!-- Your claims providers -->
  </ClaimsProviders>
  <UserJourneys>
    <!-- Your user journeys -->
  </UserJourneys>
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="OpenIdConnect" />
      <Metadata>
        <Item Key="DeploymentMode">Development</Item> <!-- Change to Production when ready -->
      </Metadata>
      <!-- Rest of configuration -->
    </TechnicalProfile>
  </RelyingParty>
</TrustFrameworkPolicy>
```

### 7. Implement Custom Error Handling

Add a custom error technical profile for better error messages:

```xml
<TechnicalProfile Id="OAuth2ErrorHandler">
  <DisplayName>OAuth2 Error Handler</DisplayName>
  <Protocol Name="None" />
  <Metadata>
    <Item Key="ErrorCodeParamName">error</Item>
    <Item Key="ErrorMessageParamName">error_description</Item>
    <Item Key="ErrorCodeRegex">^(.+)$</Item>
    <Item Key="ErrorMessageRegex">^(.+)$</Item>
  </Metadata>
  <CryptographicKeys>
    <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" />
  </CryptographicKeys>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="errorCode" />
    <OutputClaim ClaimTypeReferenceId="errorMessage" />
  </OutputClaims>
</TechnicalProfile>
```

## Troubleshooting Checklist

- [ ] **Client ID** - Verify it matches the external provider's app registration
- [ ] **Client Secret** - Ensure it's correctly stored in B2C policy keys
- [ ] **Redirect URIs** - Confirm they match between B2C and external provider
- [ ] **Scopes** - Check that requested scopes are supported by the provider
- [ ] **Token Endpoints** - Verify URLs are correct and accessible
- [ ] **Policy Keys** - Ensure all required keys exist (signing, encryption, secrets)
- [ ] **Claims Mapping** - Verify output claims match what the provider returns
- [ ] **Application Insights** - Enable and check for detailed error messages
- [ ] **Network Connectivity** - Ensure B2C can reach the external provider
- [ ] **Time Sync** - Verify server time is synchronized (for token validation)

## Additional Resources

- [Azure AD B2C Custom Policy Documentation](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)
- [Application Insights for B2C](https://docs.microsoft.com/azure/active-directory-b2c/troubleshoot-with-application-insights)
- [OAuth 2.0 Protocol Reference](https://docs.microsoft.com/azure/active-directory-b2c/oauth2-technical-profile)

## Need More Help?

If you're still experiencing issues:
1. Check the [Azure AD B2C Stack Overflow tag](https://stackoverflow.com/questions/tagged/azure-ad-b2c)
2. Post in the [Microsoft Q&A forum](https://docs.microsoft.com/answers/topics/azure-ad-b2c.html)
3. Open a support ticket with Microsoft Azure Support