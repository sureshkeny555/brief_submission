# Azure AD B2C Integration Guide for React Application

## Overview

This guide will help you integrate Azure AD B2C with your existing React application, replacing the current custom authentication system.

## Prerequisites

1. Azure AD B2C tenant
2. Application registration in Azure AD B2C
3. Custom policies configured
4. Node.js and npm installed

## Step 1: Install Required Dependencies

```bash
npm install @azure/msal-browser @azure/msal-react
```

## Step 2: Configure Azure AD B2C Settings

Create a configuration file for Azure AD B2C settings:

```javascript
// src/config/azure-b2c-config.js
export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_B2C_CLIENT_ID,
    authority: `https://${process.env.REACT_APP_AZURE_B2C_TENANT}.b2clogin.com/${process.env.REACT_APP_AZURE_B2C_TENANT}.onmicrosoft.com/${process.env.REACT_APP_AZURE_B2C_POLICY}`,
    knownAuthorities: [`${process.env.REACT_APP_AZURE_B2C_TENANT}.b2clogin.com`],
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    postLogoutRedirectUri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0:
            console.error(message);
            return;
          case 1:
            console.warn(message);
            return;
          case 2:
            console.info(message);
            return;
          case 3:
            console.debug(message);
            return;
          default:
            console.log(message);
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
```

## Step 3: Create Environment Variables

Create a `.env` file in your project root:

```env
# .env
REACT_APP_AZURE_B2C_CLIENT_ID=your-client-id
REACT_APP_AZURE_B2C_TENANT=your-tenant-name
REACT_APP_AZURE_B2C_POLICY=B2C_1_signupsignin
REACT_APP_REDIRECT_URI=http://localhost:3000/auth/callback
REACT_APP_POST_LOGOUT_REDIRECT_URI=http://localhost:3000/
```

## Step 4: Update App.jsx with MSAL Provider

```jsx
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './config/azure-b2c-config';
import Login from './Components/Login/Login';
import Layout from './routes/Layout';
import ReceiverLayout from './routes/ReceiverLayout';
import SignUp from './Components/SignUp/SignUp';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';

// Initialize MSAL
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/layout/*" element={<Layout />} />
          <Route path="/receiverlayout/*" element={<ReceiverLayout />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </Router>
    </MsalProvider>
  );
}

export default App;
```

## Step 5: Create Authentication Hook

```javascript
// src/hooks/useAuth.js
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/azure-b2c-config';

export const useAuth = () => {
  const { instance, accounts } = useMsal();

  const login = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    instance.logoutPopup();
  };

  const getAccessToken = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      console.error('Token acquisition error:', error);
      throw error;
    }
  };

  const isAuthenticated = accounts.length > 0;

  return {
    login,
    logout,
    getAccessToken,
    isAuthenticated,
    user: accounts[0] || null,
  };
};
```

## Step 6: Update Login Component

```jsx
// src/Components/Login/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import s from './Login.module.scss';
import loginPoster from '../assets/images/loginck.jpg';
import logo from '../assets/images/login_logo.png';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import cx from 'classnames';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role or claims
      const role = user.idTokenClaims?.extension_Role || 'User';
      const redirectPath = getRedirectPath(role);
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const getRedirectPath = (role) => {
    switch (role) {
      case 'Creator':
        return '/layout/createbrief';
      case 'Admin':
      case 'Super Admin':
        return '/receiverlayout/dashboard';
      case 'Project Coordinator':
        return '/receiverlayout/todaydeadline';
      default:
        return '/receiverlayout/todaydeadline';
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      setModalContent({
        title: 'Login Failed',
        message: error.message || 'An error occurred during login',
        type: 'failure',
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={cx(s.main)}>
      <div className={cx(s.imgSection)}>
        <img src={loginPoster} height="1080" alt="Login Poster" />
      </div>
      <div className={cx(s.loginPart)}>
        <div className={cx(s.formlog)}>
          <div className={cx(s.logo)}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={cx(s.divisions, 'text-center')}>
            <p className={s.loginTxt}>Welcome Back</p>
            <p className={s.txt}>Please sign in with your Azure AD B2C account</p>
          </div>
          
          <div className={cx(s.divisions)}>
            <Button
              label={isLoading ? 'Signing in...' : 'Sign in with Azure AD B2C'}
              onClick={handleLogin}
              disabled={isLoading}
              style={{
                width: '400px',
                backgroundColor: 'blue',
                color: 'white',
                fontWeight: '600',
                fontSize: '18px',
              }}
            />
          </div>
        </div>
      </div>
      
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </div>
  );
}

export default Login;
```

## Step 7: Create Auth Callback Component

```jsx
// src/Components/AuthCallback/AuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

function AuthCallback() {
  const navigate = useNavigate();
  const { instance } = useMsal();

  useEffect(() => {
    const handleRedirectPromise = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        if (response) {
          // Successful authentication
          const role = response.idTokenClaims?.extension_Role || 'User';
          const redirectPath = getRedirectPath(role);
          navigate(redirectPath);
        } else {
          // No response, redirect to login
          navigate('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/');
      }
    };

    handleRedirectPromise();
  }, [instance, navigate]);

  const getRedirectPath = (role) => {
    switch (role) {
      case 'Creator':
        return '/layout/createbrief';
      case 'Admin':
      case 'Super Admin':
        return '/receiverlayout/dashboard';
      case 'Project Coordinator':
        return '/receiverlayout/todaydeadline';
      default:
        return '/receiverlayout/todaydeadline';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Processing authentication...</div>
    </div>
  );
}

export default AuthCallback;
```

## Step 8: Update API Client for Azure AD B2C

```javascript
// src/utils/client.js
import axios from 'axios';
import config from '../config/index';
import { useAuth } from '../hooks/useAuth';

const { apiBaseUrl } = config || {};

const client = async (
  url,
  {
    body,
    method,
    contentType = 'application/json',
    includeAuthorization = true,
    isFileUpload = false,
    ...customConfig
  } = {}
) => {
  let headers = {};

  // Get access token from Azure AD B2C if authorization is required
  if (includeAuthorization) {
    try {
      const { getAccessToken } = useAuth();
      const accessToken = await getAccessToken();
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Failed to get access token:', error);
      // Handle token acquisition failure
      throw new Error('Authentication required');
    }
  }

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = contentType;
  }

  const requestConfig = {
    url,
    method,
    baseURL: apiBaseUrl,
    headers,
    data: method === 'GET' ? null : body,
  };

  try {
    const response = await axios(requestConfig);
    const data = await response.data;

    const { status, ...restData } = data || {};
    if (response.status === 200) {
      if (data?.message === 'success' || data?.status === 'success') {
        return {
          status: true,
          data: restData,
        };
      }
    }
    return {
      status: false,
      data: restData,
      message: data?.status,
    };
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Handle 401 - redirect to login
      window.location.href = '/';
      return {
        status: false,
        data: err?.response?.data || err.data || null,
        message: 'Session expired or unauthorized access. Please log in again.',
      };
    }

    return {
      status: false,
      data: err?.response?.data || err.data || null,
      message: err?.message,
      error: err,
    };
  }
};

// ... rest of the client methods remain the same
```

## Step 9: Update Layout Components

```jsx
// src/routes/Layout.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../Components/Header/Header';
import Sidebar from '../Components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const isLoginPage = location.pathname === '/';

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      navigate('/');
    }
  }, [isAuthenticated, isLoginPage, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="layout">
      <Header onLogout={handleLogout} user={user} />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
```

## Step 10: Configure Azure AD B2C Custom Policies

### TrustFrameworkBase.xml
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<TrustFrameworkPolicy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                      xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                      xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06" 
                      PolicySchemaVersion="0.3.0.0" 
                      TenantId="your-tenant.onmicrosoft.com" 
                      PolicyId="B2C_1A_TrustFrameworkBase" 
                      PublicPolicyUri="http://your-tenant.onmicrosoft.com/B2C_1A_TrustFrameworkBase">

  <BuildingBlocks>
    <ClaimsSchema>
      <ClaimType Id="objectId">
        <DisplayName>Unique identifier</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="signInName">
        <DisplayName>Sign in name</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="authenticationSource">
        <DisplayName>Authentication source</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="identityProvider">
        <DisplayName>Identity provider</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="extension_Role">
        <DisplayName>User Role</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
    </ClaimsSchema>
  </BuildingBlocks>

  <ClaimsProviders>
    <ClaimsProvider>
      <DisplayName>Local Account SignIn</DisplayName>
      <TechnicalProfiles>
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
      </TechnicalProfiles>
    </ClaimsProvider>
  </ClaimsProviders>
</TrustFrameworkPolicy>
```

## Step 11: Testing and Validation

### Test the Integration
1. Start your React application
2. Navigate to the login page
3. Click "Sign in with Azure AD B2C"
4. Complete the authentication flow
5. Verify redirection based on user role

### Common Issues and Solutions

1. **CORS Errors**: Ensure your Azure AD B2C application registration includes the correct redirect URIs
2. **Token Validation**: Verify your backend API validates Azure AD B2C tokens
3. **Role Mapping**: Ensure user roles are properly mapped in your custom policies
4. **Network Issues**: Check if your application can reach Azure AD B2C endpoints

## Step 12: Backend API Integration

If you have a backend API, you'll need to validate Azure AD B2C tokens:

```javascript
// Backend token validation example (Node.js)
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/discovery/v2.0/keys`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function validateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      audience: 'your-client-id',
      issuer: `https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/v2.0/`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}
```

This comprehensive guide should help you successfully integrate Azure AD B2C with your React application and resolve the "external login authentication failed" errors.