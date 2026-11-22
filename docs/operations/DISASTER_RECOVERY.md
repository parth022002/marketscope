# MarketScope.io — Business Continuity & Disaster Recovery (BCDR) Plan

## 1. RPO & RTO Objectives

| Service Tier | Recovery Point Objective (RPO) | Recovery Time Objective (RTO) | Strategy |
| :--- | :--- | :--- | :--- |
| **PostgreSQL Database** | < 15 minutes | < 30 minutes | Automated WAL archiving + Daily base snapshots |
| **Redis Cache** | Volatile (0 minutes) | < 5 minutes | Ephemeral rebuild from primary database & upstream market APIs |
| **Backend API (Render)** | Zero data loss | < 10 minutes | Multi-region container re-deployment via Git tag |
| **Frontend Web (Vercel)** | Zero data loss | < 5 minutes | Edge CDN instant rollback to previous successful deployment |

---

## 2. Backup Schedules & Verification
- **Daily Automated Snapshots**: Taken at 02:00 UTC and replicated across geographically distinct cloud storage buckets.
- **Weekly Restoration Drill**: Staging environment restored from backup snapshots every Sunday to verify backup integrity.
- **Failover Procedures**: Documented runbooks for DNS failover (Cloudflare) to secondary standby API instances.
