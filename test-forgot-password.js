import { Amplify } from 'aws-amplify';
import { resetPassword } from 'aws-amplify/auth';

const amplifyConfig = {
  "aws_project_region": "us-east-1",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "us-east-1_t3MIm0E5r",
  "aws_user_pools_web_client_id": "6ogs5m1vq8sme0o7tf7ndj06qj",
  "oauth": {},
  "aws_cognito_username_attributes": ["email"],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": ["email"],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": ["SMS"],
  "aws_cognito_password_protection_settings": {
    "passwordPolicyMinLength": 8,
    "passwordPolicyCharacters": []
  }
};

Amplify.configure(amplifyConfig);

async function testForgotPassword() {
  try {
    console.log('Testing forgot password...');
    const result = await resetPassword({ username: 'test@example.com' });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
  }
}

testForgotPassword();
