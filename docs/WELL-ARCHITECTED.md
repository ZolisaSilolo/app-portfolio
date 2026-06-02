# Well-Architected Framework Review — Portfolio Platform

**Workload:** `app-portfolio` (React SPA + serverless API) · **Account:** 972991848658 · **Region:** us-east-1
**Review date:** 2026-06-02 · **Posture:** cost-optimized personal portfolio (free-tier first)

## Architecture

```
Browser → CloudFront (app.zolisasilolo.co.za, ACM TLS1.2+) → Amplify Hosting (React SPA, SSR-prerendered)
                                                              │
React app ──HTTPS──> API Gateway (REST, prod, throttled, access logs, X-Ray)
                          ├─ Lambda chatbot  (Python 3.12) → Secrets Manager (NVIDIA key) → NVIDIA NIM
                          ├─ Lambda portfolio (Python 3.12)
                          ├─ Lambda auth      → Cognito User Pool (guest)
                          └─ Lambda session   → DynamoDB (Sessions, Analytics)
CI/CD: GitHub Actions (OIDC) → SAM (backend) + Amplify (frontend)
```

## Pillar summary

| Pillar | Status | Highlights / Gaps |
|--------|--------|-------------------|
| Operational Excellence | Good | IaC (SAM), OIDC CI/CD, CloudWatch logs + API access logs + X-Ray, log retention set. Gap: no alarms/dashboards. |
| Security | Good | OIDC (no static keys), scoped IAM, Secrets Manager, TLS everywhere, security headers, encryption at rest. Gaps: CORS `*`, client-side admin gate, no WAF. |
| Reliability | Fair | Managed multi-AZ services, DynamoDB PITR+TTL, on-demand scaling. **Risk: account concurrency limit = 10**, single region. |
| Performance | Good | CloudFront CDN, prerendered HTML, right-sized Lambda, HTTP/2+3. Capped by concurrency=10. |
| Cost Optimization | Strong | Free-tier first; only ~$0.90/mo recurring (Secrets Manager + Route 53). |
| Sustainability | Strong | Serverless scale-to-zero, managed high-utilization services, CDN offload. |

## Findings & actions

### Operational Excellence
- ✅ Infrastructure as code (SAM `template.yaml`); single-command/CI deploys.
- ✅ CI/CD via GitHub Actions with **OIDC** federation (no long-lived AWS keys).
- ✅ Observability: per-function CloudWatch log groups (7/14-day retention), API Gateway access logging, X-Ray tracing enabled.
- 🔶 **Recommended:** CloudWatch alarms (Lambda errors/throttles, API 5XX, DynamoDB throttles) + a dashboard; structured JSON logging in Lambdas.

### Security
- ✅ GitHub OIDC → scoped deploy role (service-scoped policy); no static credentials.
- ✅ Per-function least-privilege via SAM policy templates (`DynamoDBCrudPolicy`, secret read scoped to `portfolio-nvidia-api-key*`).
- ✅ Secrets in **Secrets Manager** (NVIDIA key never in code/repo).
- ✅ TLS 1.2+ end-to-end (CloudFront `TLSv1.2_2021`, API Gateway HTTPS); security response headers (`X-Content-Type-Options`, `X-Frame-Options`, HSTS, `X-XSS-Protection`).
- ✅ Encryption at rest: DynamoDB SSE (both tables), default Lambda/CloudWatch encryption.
- 🔶 **CORS** `AllowOrigin: '*'` — tighten to `https://app.zolisasilolo.co.za` (and apex once linked).
- 🔶 **Admin gate**: `VITE_ADMIN_PASSWORD` is embedded in the client bundle — low-security gating only; move admin actions behind Cognito-authorized API authorization for anything sensitive.
- ⏭️ **Accepted (cost):** no AWS WAF, no KMS customer-managed keys (AWS-managed/owned encryption used), no VPC (Lambdas need public egress to NVIDIA; VPC+NAT not free-tier).

### Reliability
- ✅ Fully managed, multi-AZ services (Lambda, API Gateway, DynamoDB, S3/CloudFront).
- ✅ DynamoDB **PITR** + TTL on both tables; `PAY_PER_REQUEST` auto-scales.
- ⚠️ **Account Lambda concurrency limit = 10** — will throttle under modest load. **Action: request a Service Quotas increase before real traffic.**
- ⏭️ **Accepted:** single region (no multi-region DR); no Lambda DLQ (APIs are synchronous, DLQ N/A).

### Performance Efficiency
- ✅ CloudFront edge caching (PriceClass_All incl. African edges), HTTP/2+3, compression.
- ✅ SSR prerendering → fast first paint + SEO; right-sized Lambda memory (128–512 MB).
- 🔶 Chatbot latency bound by external NVIDIA inference; concurrency=10 caps throughput (see Reliability).

### Cost Optimization
- ✅ Free-tier first: removed API Gateway cache cluster (~$14/mo), `PAY_PER_REQUEST` DynamoDB, on-demand Lambda, CloudFront free tier, CloudWatch log retention caps, no NAT/VPC/WAF/CMK.
- ✅ Estimated recurring cost ≈ **$0.90/month** (Secrets Manager $0.40 + Route 53 hosted zone $0.50); usage-based services effectively $0 at portfolio traffic.
- 🔶 Optional: delete the unused apex+www ACM cert if not pursuing the apex.

### Sustainability
- ✅ Serverless scale-to-zero (no idle compute); managed services with high pooled utilization; CDN reduces origin compute/transfer.

## Accepted risks (intentional free-tier tradeoffs)
| Item | checkov | Rationale |
|------|---------|-----------|
| No KMS CMK (DynamoDB/logs/env) | CKV_AWS_119/158/173 | AWS-managed encryption sufficient; CMK adds ~$1/mo each |
| API Gateway cache disabled | CKV_AWS_120 | ~$14/mo saved; low traffic |
| No VPC for Lambda | CKV_AWS_117 | Public egress to NVIDIA; VPC+NAT not free-tier |
| No DLQ | CKV_AWS_116 | Synchronous API invocations |
| No per-function reserved concurrency | CKV_AWS_115 | Account limit is 10 — reserving is not possible until raised |

## Top 3 next actions
1. **Raise the Lambda concurrency quota** (Service Quotas) — current limit 10 is the main reliability constraint.
2. **Tighten CORS** to the production domain and add CloudWatch alarms.
3. **Harden the admin path** (Cognito-authorized) if it gains privileged capabilities.
