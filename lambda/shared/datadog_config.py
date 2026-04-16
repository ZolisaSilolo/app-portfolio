"""
Datadog configuration for Lambda functions
"""
from datadog_lambda.metric import lambda_metric
from datadog_lambda.wrapper import datadog_lambda_wrapper

def track_metric(metric_name: str, value: float = 1, tags: list = None):
    """
    Track custom metric in Datadog
    
    Args:
        metric_name: Metric name (e.g., 'portfolio.chat.requests')
        value: Metric value (default: 1)
        tags: List of tags (e.g., ['endpoint:chat', 'status:success'])
    """
    if tags is None:
        tags = []
    
    lambda_metric(
        metric_name,
        value,
        tags=tags
    )

def track_api_call(endpoint: str, status: str, duration_ms: float = None):
    """Track API call metrics"""
    tags = [f'endpoint:{endpoint}', f'status:{status}']
    
    # Count requests
    track_metric('portfolio.api.requests', 1, tags)
    
    # Track duration if provided
    if duration_ms:
        track_metric('portfolio.api.duration', duration_ms, tags)

def track_error(error_type: str, endpoint: str):
    """Track error metrics"""
    tags = [f'error_type:{error_type}', f'endpoint:{endpoint}']
    track_metric('portfolio.api.errors', 1, tags)
