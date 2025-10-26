const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
};

function validateFingerprint(fingerprint) {
  if (!fingerprint || typeof fingerprint !== 'string') {
    return false;
  }
  // Basic validation - should be base64-like string
  return /^[A-Za-z0-9+/=]{8,32}$/.test(fingerprint);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { fingerprint } = body;
    
    // Validate input
    if (!validateFingerprint(fingerprint)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid fingerprint format'
        })
      };
    }
    
    const guestId = fingerprint;
    const sessionId = uuidv4();
    
    // Create temporary guest user in Cognito
    const username = `guest_${guestId}`;
    const tempPassword = uuidv4() + '!A1'; // Ensure password complexity
    
    try {
      await cognito.adminCreateUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: username,
        TemporaryPassword: tempPassword,
        MessageAction: 'SUPPRESS'
      }).promise();
      
      await cognito.adminSetUserPassword({
        UserPoolId: process.env.USER_POOL_ID,
        Username: username,
        Password: tempPassword,
        Permanent: true
      }).promise();
    } catch (error) {
      if (error.code !== 'UsernameExistsException') {
        console.error('Cognito user creation failed:', error);
        throw error;
      }
    }

    // Authenticate and get tokens
    const authResult = await cognito.adminInitiateAuth({
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.USER_POOL_CLIENT_ID,
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: tempPassword
      }
    }).promise();

    // Create session record with rate limiting
    const ttl = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours
    await dynamodb.put({
      TableName: process.env.SESSIONS_TABLE,
      Item: {
        userId: guestId,
        sessionId,
        requestCount: 0,
        lastRequest: 0,
        ttl,
        createdAt: new Date().toISOString()
      }
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          sessionId,
          accessToken: authResult.AuthenticationResult.AccessToken,
          idToken: authResult.AuthenticationResult.IdToken,
          expiresIn: authResult.AuthenticationResult.ExpiresIn
        }
      })
    };

  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Authentication failed'
      })
    };
  }
};
