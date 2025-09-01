// Azure AD B2C Troubleshooting Script
// Run this in your browser console to diagnose authentication issues

class AzureB2CTroubleshooter {
  constructor() {
    this.issues = [];
    this.solutions = [];
  }

  // Check if MSAL is properly loaded
  checkMSALAvailability() {
    console.log('🔍 Checking MSAL availability...');
    
    if (typeof window !== 'undefined' && window.MsalBrowser) {
      console.log('✅ MSAL Browser is available');
      return true;
    } else if (typeof window !== 'undefined' && window.msal) {
      console.log('✅ MSAL is available');
      return true;
    } else {
      console.error('❌ MSAL is not available');
      this.issues.push('MSAL library not loaded');
      this.solutions.push('Install @azure/msal-browser and @azure/msal-react');
      return false;
    }
  }

  // Check environment variables
  checkEnvironmentVariables() {
    console.log('🔍 Checking environment variables...');
    
    const requiredVars = [
      'REACT_APP_AZURE_B2C_CLIENT_ID',
      'REACT_APP_AZURE_B2C_TENANT',
      'REACT_APP_AZURE_B2C_POLICY',
      'REACT_APP_REDIRECT_URI'
    ];

    const missing = [];
    
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });

    if (missing.length === 0) {
      console.log('✅ All required environment variables are set');
      return true;
    } else {
      console.error('❌ Missing environment variables:', missing);
      this.issues.push(`Missing environment variables: ${missing.join(', ')}`);
      this.solutions.push('Set all required environment variables in .env file');
      return false;
    }
  }

  // Check network connectivity to Azure AD B2C
  async checkNetworkConnectivity(tenant) {
    console.log('🔍 Checking network connectivity to Azure AD B2C...');
    
    try {
      const response = await fetch(`https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/v2.0/.well-known/openid_configuration`);
      
      if (response.ok) {
        console.log('✅ Network connectivity to Azure AD B2C is working');
        return true;
      } else {
        console.error('❌ Network connectivity failed:', response.status);
        this.issues.push(`Network connectivity failed: ${response.status}`);
        this.solutions.push('Check your internet connection and firewall settings');
        return false;
      }
    } catch (error) {
      console.error('❌ Network connectivity error:', error.message);
      this.issues.push(`Network connectivity error: ${error.message}`);
      this.solutions.push('Check your internet connection and firewall settings');
      return false;
    }
  }

  // Check local storage for tokens
  checkLocalStorage() {
    console.log('🔍 Checking local storage...');
    
    const token = localStorage.getItem('msal.token');
    const account = localStorage.getItem('msal.account');
    
    if (token && account) {
      console.log('✅ MSAL tokens found in local storage');
      return true;
    } else {
      console.log('ℹ️ No MSAL tokens found in local storage (this is normal for new users)');
      return true;
    }
  }

  // Check for common configuration errors
  checkConfiguration() {
    console.log('🔍 Checking configuration...');
    
    const issues = [];
    
    // Check if running on HTTPS (required for production)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push('Application should run on HTTPS in production');
    }
    
    // Check for popup blockers
    if (window.opener === null && window.name !== '') {
      issues.push('Popup blockers might interfere with authentication');
    }
    
    if (issues.length === 0) {
      console.log('✅ Configuration looks good');
      return true;
    } else {
      console.warn('⚠️ Configuration issues found:', issues);
      this.issues.push(...issues);
      this.solutions.push('Ensure HTTPS in production and disable popup blockers');
      return false;
    }
  }

  // Test authentication flow
  async testAuthenticationFlow(msalInstance) {
    console.log('🔍 Testing authentication flow...');
    
    if (!msalInstance) {
      console.error('❌ MSAL instance not provided');
      return false;
    }

    try {
      // Check if user is already signed in
      const accounts = msalInstance.getAllAccounts();
      
      if (accounts.length > 0) {
        console.log('✅ User is already signed in');
        return true;
      } else {
        console.log('ℹ️ No user signed in (this is normal)');
        return true;
      }
    } catch (error) {
      console.error('❌ Authentication flow test failed:', error);
      this.issues.push(`Authentication flow error: ${error.message}`);
      this.solutions.push('Check MSAL configuration and custom policies');
      return false;
    }
  }

  // Check custom policy configuration
  async checkCustomPolicy(tenant, policy) {
    console.log('🔍 Checking custom policy configuration...');
    
    try {
      const response = await fetch(`https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/v2.0/.well-known/openid_configuration?p=${policy}`);
      
      if (response.ok) {
        const config = await response.json();
        console.log('✅ Custom policy configuration is accessible');
        console.log('📋 Available endpoints:', Object.keys(config));
        return true;
      } else {
        console.error('❌ Custom policy configuration failed:', response.status);
        this.issues.push(`Custom policy configuration failed: ${response.status}`);
        this.solutions.push('Verify custom policy name and tenant configuration');
        return false;
      }
    } catch (error) {
      console.error('❌ Custom policy check error:', error.message);
      this.issues.push(`Custom policy check error: ${error.message}`);
      this.solutions.push('Verify custom policy name and tenant configuration');
      return false;
    }
  }

  // Generate troubleshooting report
  generateReport() {
    console.log('\n📋 TROUBLESHOOTING REPORT');
    console.log('========================');
    
    if (this.issues.length === 0) {
      console.log('✅ No issues detected! Your Azure AD B2C setup looks good.');
    } else {
      console.log(`❌ Found ${this.issues.length} issue(s):`);
      
      this.issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. Issue: ${issue}`);
        console.log(`   Solution: ${this.solutions[index]}`);
      });
    }
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('1. Check Azure Portal > Azure AD B2C > User flows');
    console.log('2. Verify application registration settings');
    console.log('3. Check Application Insights logs for detailed errors');
    console.log('4. Test with Azure AD B2C policy tester');
    console.log('5. Review custom policy XML for syntax errors');
  }

  // Run all checks
  async runAllChecks(tenant, policy) {
    console.log('🚀 Starting Azure AD B2C Troubleshooting...\n');
    
    this.checkMSALAvailability();
    this.checkEnvironmentVariables();
    await this.checkNetworkConnectivity(tenant);
    this.checkLocalStorage();
    this.checkConfiguration();
    
    if (tenant && policy) {
      await this.checkCustomPolicy(tenant, policy);
    }
    
    this.generateReport();
  }
}

// Usage instructions
console.log(`
🔧 Azure AD B2C Troubleshooting Script
=====================================

To use this script:

1. Open your browser's developer console
2. Copy and paste this entire script
3. Run the following command:

// For basic checks:
const troubleshooter = new AzureB2CTroubleshooter();
troubleshooter.runAllChecks();

// For checks with tenant and policy:
const troubleshooter = new AzureB2CTroubleshooter();
troubleshooter.runAllChecks('your-tenant-name', 'B2C_1_signupsignin');

This will help identify common Azure AD B2C authentication issues.
`);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AzureB2CTroubleshooter;
}