# Deployment Architecture Specification
**Platform:** MarketScope.io  
**Cloud Infrastructure:** Render PaaS + Neon Serverless PostgreSQL 16  

## 1. Production Deployment Topology

```mermaid
graph TD
    subgraph Cloudflare_DNS ["Cloudflare Edge & DNS"]
        DNS["marketscope.io (SSL / TLS 1.3)"]
    end

    subgraph Render_Platform ["Render Cloud Platform (Frankfurt / Oregon)"]
        WebInstance["marketscope-web (Next.js 15 Node.js Runtime)"]
        APIInstance["marketscope-api (FastAPI Python 3.12 Web Service)"]
        HealthProbe["Automated Health Checks (/health, /health/live, /health/ready)"]
    end

    subgraph Serverless_Data ["Managed Serverless Storage"]
        NeonDB[(Neon PostgreSQL 16 Serverless)]
        RedisCache[(Managed Redis Cache)]
    end

    Cloudflare_DNS --> WebInstance
    WebInstance --> APIInstance
    HealthProbe --> APIInstance
    APIInstance --> NeonDB
    APIInstance --> RedisCache
```

## 2. Health Monitoring & Recovery Runbooks
- **Liveness Endpoint (`/health/live`)**: Confirms process responsiveness.
- **Readiness Endpoint (`/health/ready`)**: Validates database connection with latency measurement (`SELECT 1`). Returns `status: ready` or `status: degraded`.
- **Zero-Downtime Rollbacks**: Stateless container images allow instant 1-click rollback on Render upon deployment failure.
