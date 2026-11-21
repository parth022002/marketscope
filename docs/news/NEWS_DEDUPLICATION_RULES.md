# MarketScope.io — News Deduplication & Story Clustering Rules

## 1. The Duplicate Problem in Financial News

Major corporate and economic events (e.g. RBI rate announcements, quarterly earnings releases, sovereign debt auctions) trigger dozens of simultaneous syndicated wire dispatches and syndicated copies across publishers.

MarketScope.io executes automated deduplication and clustering to prevent repetitive feed clutter while **strictly preserving distinct publisher viewpoints, bylines, and independent reporting**.

---

## 2. Deduplication Stages

### Stage 1: Exact Duplicate Detection
- **Trigger**: Matching canonical URL, identical publisher article ID, or exact matching SHA-256 hash of headline + publisher + date.
- **Action**: Ingestion deduplicated silently. The existing record's `last_updated_at` is touched without spawning redundant database rows.

### Stage 2: Syndicated Copy Identification
- **Trigger**: Multiple regional portals redistributing identical wire copy from Reuters, Press Trust of India (PTI), or Bloomberg.
- **Detection**: Headline normalized token match $> 95\%$ and body text Jaccard similarity $> 90\%$ within a 6-hour window.
- **Action**: Identified as a syndicated clone. The primary authoritative originating agency wire is preserved as the lead; syndicated copies are appended to `syndicated_sources` rather than creating duplicate feed cards.

### Stage 3: Independent Story Clustering
- **Trigger**: Multiple publishers writing independent reporting on the same underlying financial event.
- **Detection Algorithm**:
  $$\text{ClusterScore} = 0.40 \times \text{EntityOverlap} + 0.35 \times \text{TitleCosineSim} + 0.25 \times \text{TimeProximity}$$
  - **Entity Overlap**: Shared companies, instruments, or institutions (e.g. `NSE:RELIANCE` and `NIFTY 50`).
  - **Title Cosine Similarity**: TF-IDF cosine similarity of normalized headline tokens $> 0.65$.
  - **Time Proximity**: Published within 8 hours of each other.
- **Action**: Clustered into a single unified `NewsStoryCluster`. The user sees one consolidated card with a badge indicating: *"Reported by 4 independent publishers + 1 official filing"*. Clicking the card expands all perspectives.
