const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

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
    
    const sessionId = uuidv4();
    
    // For now, return a mock token to test the chatbot
    // In production, this would create a proper Cognito user and return real tokens
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          sessionId,
          accessToken: 'mock-access-token-for-testing',
          idToken: 'mock-id-token-for-testing',
          expiresIn: 3600
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
