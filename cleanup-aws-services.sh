#!/bin/bash

# Cleanup unnecessary AWS services to minimize costs
set -e

echo "🧹 Cleaning up unnecessary AWS services..."

# Delete CodeCommit repository (if exists)
aws codecommit delete-repository --repository-name portfolio-react-repo 2>/dev/null || echo "CodeCommit repo not found"

# Delete CodeArtifact (if exists)
aws codeartifact delete-repository --domain portfolio-react-domain --repository portfolio-react-npm-repo 2>/dev/null || echo "CodeArtifact repo not found"
aws codeartifact delete-domain --domain portfolio-react-domain 2>/dev/null || echo "CodeArtifact domain not found"

# Delete CodePipeline (if exists)
aws codepipeline delete-pipeline --name portfolio-react-pipeline 2>/dev/null || echo "CodePipeline not found"

# Keep: CodeBuild, S3 bucket, IAM role (minimal cost)

echo "✅ Cleanup complete! Keeping only:"
echo "  - CodeBuild project (for automated builds)"
echo "  - S3 bucket (for artifacts)"
echo "  - IAM role (for permissions)"
echo ""
echo "💰 Estimated monthly cost: $2-3"
