"""
Sentry configuration for Lambda functions
"""
import os
import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

def init_sentry():
    """Initialize Sentry for Lambda error tracking"""
    sentry_dsn = os.environ.get('SENTRY_DSN')
    
    if not sentry_dsn:
        print("SENTRY_DSN not configured - error tracking disabled")
        return
    
    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=os.environ.get('ENVIRONMENT', 'prod'),
        integrations=[
            AwsLambdaIntegration(timeout_warning=True)
        ],
        traces_sample_rate=1.0,
        
        # Add context
        before_send=lambda event, hint: filter_sensitive_data(event, hint),
    )

def filter_sensitive_data(event, hint):
    """Remove sensitive data from Sentry events"""
    # Remove API keys from environment
    if 'extra' in event and 'sys.argv' in event['extra']:
        del event['extra']['sys.argv']
    
    # Filter request data
    if 'request' in event:
        if 'headers' in event['request']:
            # Remove authorization headers
            event['request']['headers'] = {
                k: v for k, v in event['request']['headers'].items()
                if k.lower() not in ['authorization', 'x-api-key']
            }
    
    return event
