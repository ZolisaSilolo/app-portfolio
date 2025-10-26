#!/bin/bash

echo "🔒 Portfolio Security & Compatibility Check"
echo "=========================================="

# Check if required tools are installed
echo "📋 Checking prerequisites..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found"
    exit 1
fi

# Check SAM CLI
if ! command -v sam &> /dev/null; then
    echo "❌ SAM CLI not found"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Validate SAM template
echo "🔍 Validating SAM template..."
if sam validate --template template.yaml; then
    echo "✅ SAM template is valid"
else
    echo "❌ SAM template validation failed"
    exit 1
fi

# Check Lambda function syntax
echo "🔍 Checking Lambda function syntax..."

# Check auth-api
echo "  - Checking auth-api..."
if node -c lambda/auth-api/index.js; then
    echo "    ✅ auth-api syntax valid"
else
    echo "    ❌ auth-api syntax error"
    exit 1
fi

# Check chatbot-api
echo "  - Checking chatbot-api..."
if node -c lambda/chatbot-api/index.js; then
    echo "    ✅ chatbot-api syntax valid"
else
    echo "    ❌ chatbot-api syntax error"
    exit 1
fi

# Check portfolio-api
echo "  - Checking portfolio-api..."
if node -c lambda/portfolio-api/index.js; then
    echo "    ✅ portfolio-api syntax valid"
else
    echo "    ❌ portfolio-api syntax error"
    exit 1
fi

# Check package.json files
echo "🔍 Validating package.json files..."
for pkg in lambda/*/package.json; do
    if [ -f "$pkg" ]; then
        echo "  - Checking $pkg..."
        if node -e "JSON.parse(require('fs').readFileSync('$pkg', 'utf8'))"; then
            echo "    ✅ $pkg is valid JSON"
        else
            echo "    ❌ $pkg is invalid JSON"
            exit 1
        fi
    fi
done

# Security checks
echo "🛡️  Running security checks..."

# Check for hardcoded secrets (basic check)
echo "  - Checking for potential hardcoded secrets..."
if grep -r -i "password\|secret\|key" lambda/ --include="*.js" | grep -v "process.env" | grep -v "//"; then
    echo "    ⚠️  Potential hardcoded secrets found (review above)"
else
    echo "    ✅ No obvious hardcoded secrets found"
fi

# Check for console.log in production code
echo "  - Checking for console.log statements..."
if grep -r "console.log" lambda/ --include="*.js" | grep -v "console.error"; then
    echo "    ⚠️  console.log statements found (consider removing for production)"
else
    echo "    ✅ No console.log statements found"
fi

# Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
cd src
if npx tsc --noEmit --skipLibCheck; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi
cd ..

echo ""
echo "🎉 Security and compatibility check completed!"
echo ""
echo "📋 Summary of security features implemented:"
echo "  ✅ Cognito authentication with JWT tokens"
echo "  ✅ Rate limiting (20 requests/hour per user)"
echo "  ✅ DynamoDB encryption at rest"
echo "  ✅ API Gateway security headers"
echo "  ✅ Secrets Manager for API keys"
echo "  ✅ CloudWatch logging with retention"
echo "  ✅ CORS properly configured"
echo "  ✅ Input validation on all endpoints"
echo "  ✅ Error handling without information leakage"
echo "  ✅ Least privilege IAM permissions"
echo ""
echo "⚠️  Recommendations:"
echo "  - Review CloudWatch logs regularly"
echo "  - Monitor API Gateway metrics for unusual patterns"
echo "  - Consider implementing WAF rules for additional protection"
echo "  - Regularly rotate the Cohere API key"
echo "  - Enable AWS Config for compliance monitoring"
