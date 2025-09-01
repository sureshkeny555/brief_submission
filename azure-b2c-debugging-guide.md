# Azure AD B2C Custom Policy Authentication Error Debugging Guide

## Common "External Login Authentication Failed" Error Causes

### 1. Identity Provider Configuration

#### Check Application Registration
```bash
# Verify your app registration in Azure Portal
# Navigate to: Azure Portal > Azure AD B2C > App registrations
# Ensure these are correctly configured:
- Application (client) ID
- Directory (tenant) ID  
- Redirect URIs
- API permissions
- Authentication settings
```

#### Verify Custom Policy XML
```xml
<!-- Check your TrustFrameworkExtensions.xml -->
<TrustFrameworkPolicy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                      xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                      xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06" 
                      PolicySchemaVersion="0.3.0.0" 
                      TenantId="your-tenant.onmicrosoft.com" 
                      PolicyId="B2C_1A_TrustFrameworkExtensions" 
                      PublicPolicyUri="http://your-tenant.onmicrosoft.com/B2C_1A_TrustFrameworkExtensions">

  <BasePolicy>
    <TenantId>your-tenant.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkBase</PolicyId>
  </BasePolicy>

  <BuildingBlocks>
    <ClaimsSchema>
      <!-- Your custom claims -->
    </ClaimsSchema>
  </BuildingBlocks>

  <UserJourneys>
    <UserJourney Id="SignUpOrSignIn">
      <OrchestrationSteps>
        <!-- Verify each step -->
        <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
          <ClaimsProviderSelections>
            <ClaimsProviderSelection ValidationClaimsExchangeId="LocalAccountSigninEmailExchange" />
          </ClaimsProviderSelections>
          <ClaimsExchanges>
            <ClaimsExchange Id="LocalAccountSigninEmailExchange" TechnicalProfileReferenceId="login-NonInteractive" />
          </ClaimsExchanges>
        </OrchestrationStep>
      </OrchestrationSteps>
    </UserJourney>
  </UserJourneys>
</TrustFrameworkPolicy>
```

### 2. Network and Connectivity Issues

#### Check Network Connectivity
```bash
# Test connectivity to Azure AD B2C endpoints
curl -I https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/v2.0/.well-known/openid_configuration

# Check if your application can reach Azure AD B2C
curl -I https://login.microsoftonline.com/your-tenant.onmicrosoft.com/v2.0/.well-known/openid_configuration
```

#### Verify CORS Settings
```javascript
// In your application, ensure CORS is properly configured
const corsOptions = {
  origin: [
    'https://your-app-domain.com',
    'https://your-tenant.b2clogin.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### 3. Application Configuration Issues

#### Check Redirect URIs
```javascript
// Ensure your redirect URIs match exactly
const redirectUris = [
  'https://your-app-domain.com/auth/callback',
  'https://your-app-domain.com/silent-renew',
  'http://localhost:3000/auth/callback' // for development
];
```

#### Verify Client Configuration
```javascript
// MSAL.js configuration
const msalConfig = {
  auth: {
    clientId: 'your-client-id',
    authority: 'https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/B2C_1_signupsignin',
    knownAuthorities: ['your-tenant.b2clogin.com'],
    redirectUri: 'https://your-app-domain.com/auth/callback',
    postLogoutRedirectUri: 'https://your-app-domain.com/',
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};
```

### 4. Custom Policy Validation

#### Enable Application Insights Logging
```xml
<!-- Add to your custom policy -->
<TrustFrameworkPolicy>
  <BuildingBlocks>
    <ClaimsSchema>
      <!-- Your claims schema -->
    </ClaimsSchema>
  </BuildingBlocks>
  
  <UserJourneys>
    <UserJourney Id="SignUpOrSignIn">
      <OrchestrationSteps>
        <!-- Add logging step -->
        <OrchestrationStep Order="1" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="LogStep1" TechnicalProfileReferenceId="AppInsights-Common" />
          </ClaimsExchanges>
        </OrchestrationStep>
      </OrchestrationSteps>
    </UserJourney>
  </UserJourneys>
  
  <TechnicalProfiles>
    <TechnicalProfile Id="AppInsights-Common">
      <DisplayName>Application Insights</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ApplicationInsightsProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="InstrumentationKey">your-app-insights-key</Item>
        <Item Key="DeveloperMode">true</Item>
        <Item Key="DisableTelemetry ">false</Item>
      </Metadata>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="PolicyId" PartnerClaimType="{Policy:TrustFrameworkTenantId}" />
        <InputClaim ClaimTypeReferenceId="TenantId" PartnerClaimType="TenantId" />
        <InputClaim ClaimTypeReferenceId="CorrelationId" PartnerClaimType="{CorrelationId}" />
        <InputClaim ClaimTypeReferenceId="TimeStamp" PartnerClaimType="{TimeStamp}" />
        <InputClaim ClaimTypeReferenceId="IpAddress" PartnerClaimType="{IPAddress}" />
        <InputClaim ClaimTypeReferenceId="UserAgent" PartnerClaimType="{UserAgent}" />
      </InputClaims>
    </TechnicalProfile>
  </TechnicalProfiles>
</TrustFrameworkPolicy>
```

### 5. Error Handling and Debugging

#### Implement Proper Error Handling
```javascript
// MSAL.js error handling
const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.handleRedirectPromise()
  .then(response => {
    if (response) {
      // Handle successful authentication
      console.log('Authentication successful:', response);
    }
  })
  .catch(error => {
    console.error('Authentication error:', error);
    
    // Handle specific error types
    switch (error.errorCode) {
      case 'access_denied':
        console.error('User denied access');
        break;
      case 'invalid_grant':
        console.error('Invalid grant - token expired or invalid');
        break;
      case 'interaction_required':
        console.error('User interaction required');
        break;
      default:
        console.error('Unknown error:', error.errorMessage);
    }
  });
```

#### Check Application Insights Logs
```bash
# In Azure Portal, navigate to:
# Azure AD B2C > User flows > Your custom policy > Application Insights
# Look for errors in the logs
```

### 6. Common Fixes

#### Fix 1: Update Policy References
```xml
<!-- Ensure all policy references are correct -->
<BasePolicy>
  <TenantId>your-tenant.onmicrosoft.com</TenantId>
  <PolicyId>B2C_1A_TrustFrameworkBase</PolicyId>
</BasePolicy>
```

#### Fix 2: Verify Claims Transformations
```xml
<!-- Check your claims transformations -->
<ClaimsTransformation Id="CreateObjectID" TransformationMethod="CreateStringClaim">
  <InputParameters>
    <InputParameter Id="value" DataType="string" Value="Not used" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="objectId" TransformationClaimType="createdClaimType" />
  </OutputClaims>
</ClaimsTransformation>
```

#### Fix 3: Update Technical Profiles
```xml
<!-- Ensure technical profiles are correctly configured -->
<TechnicalProfile Id="login-NonInteractive">
  <DisplayName>Local Account SignIn</DisplayName>
  <Protocol Name="OpenIdConnect"/>
  <Metadata>
    <Item Key="UserMessageIfClaimsPrincipalDoesNotExist">We can't seem to find your account</Item>
    <Item Key="UserMessageIfInvalidPassword">Your password is incorrect</Item>
    <Item Key="UserMessageIfOldPasswordUsed">Looks like you used an old password</Item>
    <Item Key="DiscoverMetadataByTokenIssuer">true</Item>
    <Item Key="ValidTokenIssuerPrefixes">https://sts.windows.net/</Item>
    <Item Key="METADATA">https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid_configuration</Item>
    <Item Key="authorization_endpoint">https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize</Item>
    <Item Key="token_endpoint">https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="signInName" PartnerClaimType="username" Required="true" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="objectId" />
    <OutputClaim ClaimTypeReferenceId="signInName" />
    <OutputClaim ClaimTypeReferenceId="authenticationSource" />
  </OutputClaims>
</TechnicalProfile>
```

### 7. Testing and Validation

#### Test Your Custom Policy
```bash
# Use the Azure AD B2C policy tester
# Navigate to: Azure Portal > Azure AD B2C > User flows > Your custom policy > Run user flow

# Or use the direct URL:
https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/B2C_1_signupsignin/oauth2/v2.0/authorize?client_id=your-client-id&response_type=code&redirect_uri=https://your-app-domain.com/auth/callback&scope=openid&response_mode=query&state=12345&nonce=67890
```

#### Validate Token Response
```javascript
// Decode and validate the JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

// Usage
const token = 'your-jwt-token';
const decoded = parseJwt(token);
console.log('Token claims:', decoded);
```

## Quick Troubleshooting Checklist

- [ ] Verify tenant name in custom policy XML
- [ ] Check client ID and secret in application registration
- [ ] Ensure redirect URIs match exactly
- [ ] Validate custom policy XML syntax
- [ ] Check Application Insights logs for errors
- [ ] Verify network connectivity to Azure AD B2C
- [ ] Test with policy tester in Azure Portal
- [ ] Check CORS configuration
- [ ] Validate JWT token structure
- [ ] Ensure all required claims are configured

## Next Steps

1. **Enable Application Insights** for detailed logging
2. **Test with Azure AD B2C policy tester**
3. **Check Application Insights logs** for specific error messages
4. **Validate your custom policy XML** syntax
5. **Verify all configuration settings** in Azure Portal