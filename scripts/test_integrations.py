import os
import sys
import json
import httpx
from datetime import datetime

# Load env variables from root .env or apps/api/.env
from dotenv import load_dotenv
load_dotenv('.env')

def mask(val: str | None) -> str:
    if not val:
        return "[NOT SET]"
    if len(val) <= 8:
        return "***"
    return f"{val[:4]}...{val[-4:]}"

results = {}

# 1. Neon PostgreSQL Database Connectivity
db_url = os.getenv("DATABASE_URL")
results["database"] = {
    "provider": "Neon PostgreSQL Serverless",
    "configured": bool(db_url),
    "masked_target": mask(db_url),
    "reachable": False,
    "status": "NOT_TESTED",
    "details": ""
}
if db_url:
    try:
        import psycopg
        # Try direct connection with 5s timeout
        # Remove +psycopg prefix if present for raw psycopg
        raw_url = db_url.replace("postgresql+psycopg://", "postgresql://")
        with psycopg.connect(raw_url, connect_timeout=5) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT version();")
                row = cur.fetchone()
                results["database"]["reachable"] = True
                results["database"]["status"] = "CONNECTED"
                results["database"]["details"] = f"PostgreSQL online: {row[0][:40]}..."
    except Exception as e:
        results["database"]["status"] = "CONNECTION_FAILED"
        results["database"]["details"] = str(e)[:120]

# 2. Redis Connectivity
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
results["redis"] = {
    "provider": "Redis / Upstash",
    "configured": bool(redis_url),
    "masked_target": mask(redis_url),
    "reachable": False,
    "status": "NOT_TESTED",
    "details": ""
}
try:
    import redis
    r = redis.from_url(redis_url, socket_timeout=2)
    r.ping()
    results["redis"]["reachable"] = True
    results["redis"]["status"] = "CONNECTED"
    results["redis"]["details"] = "Redis PING successful"
except Exception as e:
    results["redis"]["status"] = "LOCAL_OFFLINE"
    results["redis"]["details"] = f"Redis unreachable: {str(e)[:80]} (Memory fallback active)"

# 3. Clerk API Authentication
clerk_key = os.getenv("CLERK_SECRET_KEY")
results["clerk"] = {
    "provider": "Clerk Identity",
    "configured": bool(clerk_key),
    "masked_key": mask(clerk_key),
    "status": "NOT_TESTED",
    "details": ""
}
if clerk_key:
    try:
        resp = httpx.get(
            "https://api.clerk.com/v1/instance",
            headers={"Authorization": f"Bearer {clerk_key}"},
            timeout=5.0
        )
        if resp.status_code == 200:
            data = resp.json()
            results["clerk"]["status"] = "AUTHENTICATED"
            results["clerk"]["details"] = f"Instance ID: {data.get('id', 'N/A')}, Environment: {data.get('environment_type', 'test')}"
        else:
            results["clerk"]["status"] = f"HTTP_{resp.status_code}"
            results["clerk"]["details"] = resp.text[:120]
    except Exception as e:
        results["clerk"]["status"] = "ERROR"
        results["clerk"]["details"] = str(e)[:120]

# 4. TwelveData API Key Test
td_key = os.getenv("TWELVEDATA_API_KEY")
results["twelvedata"] = {
    "provider": "Twelve Data",
    "configured": bool(td_key),
    "masked_key": mask(td_key),
    "status": "NOT_TESTED",
    "details": ""
}
if td_key:
    try:
        resp = httpx.get(
            f"https://api.twelvedata.com/api_usage?apikey={td_key}",
            timeout=5.0
        )
        if resp.status_code == 200:
            data = resp.json()
            if data.get("status") == "error":
                results["twelvedata"]["status"] = "INVALID_KEY"
                results["twelvedata"]["details"] = data.get("message", "API key invalid")
            else:
                results["twelvedata"]["status"] = "VALID_AND_AUTHENTICATED"
                results["twelvedata"]["details"] = f"Usage: {data.get('current_usage', 0)}/{data.get('plan_limit', 'unknown')}"
        else:
            results["twelvedata"]["status"] = f"HTTP_{resp.status_code}"
            results["twelvedata"]["details"] = resp.text[:120]
    except Exception as e:
        results["twelvedata"]["status"] = "ERROR"
        results["twelvedata"]["details"] = str(e)[:120]

# 5. Financial Modeling Prep (FMP) API Key Test
fmp_key = os.getenv("FMP_API_KEY")
results["fmp"] = {
    "provider": "Financial Modeling Prep (FMP)",
    "configured": bool(fmp_key),
    "masked_key": mask(fmp_key),
    "status": "NOT_TESTED",
    "details": ""
}
if fmp_key:
    try:
        resp = httpx.get(
            f"https://financialmodelingprep.com/api/v3/profile/AAPL?apikey={fmp_key}",
            timeout=5.0
        )
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list) and len(data) > 0 and "symbol" in data[0]:
                results["fmp"]["status"] = "VALID_AND_AUTHENTICATED"
                results["fmp"]["details"] = f"Successfully fetched AAPL profile: {data[0].get('companyName')}"
            elif isinstance(data, dict) and "Error Message" in data:
                results["fmp"]["status"] = "INVALID_KEY_OR_RESTRICTED"
                results["fmp"]["details"] = data["Error Message"][:120]
            else:
                results["fmp"]["status"] = "UNEXPECTED_SCHEMA"
                results["fmp"]["details"] = str(data)[:120]
        else:
            results["fmp"]["status"] = f"HTTP_{resp.status_code}"
            results["fmp"]["details"] = resp.text[:120]
    except Exception as e:
        results["fmp"]["status"] = "ERROR"
        results["fmp"]["details"] = str(e)[:120]

# 6. Groq API Key Test
groq_key = os.getenv("GROQ_API_KEY")
results["groq"] = {
    "provider": "Groq Cloud (LLaMA-3.3 70B)",
    "configured": bool(groq_key),
    "masked_key": mask(groq_key),
    "status": "NOT_TESTED",
    "details": ""
}
if groq_key:
    try:
        resp = httpx.get(
            "https://api.groq.com/openai/v1/models",
            headers={"Authorization": f"Bearer {groq_key}"},
            timeout=5.0
        )
        if resp.status_code == 200:
            data = resp.json()
            models = [m.get("id") for m in data.get("data", [])]
            results["groq"]["status"] = "VALID_AND_AUTHENTICATED"
            results["groq"]["details"] = f"Models available ({len(models)}): {', '.join(models[:3])}..."
        else:
            results["groq"]["status"] = f"HTTP_{resp.status_code}"
            results["groq"]["details"] = resp.text[:120]
    except Exception as e:
        results["groq"]["status"] = "ERROR"
        results["groq"]["details"] = str(e)[:120]

# 7. OpenRouter API Key Test
openrouter_key = os.getenv("OPENROUTER_API_KEY")
results["openrouter"] = {
    "provider": "OpenRouter AI",
    "configured": bool(openrouter_key),
    "masked_key": mask(openrouter_key),
    "status": "NOT_TESTED",
    "details": ""
}
if openrouter_key:
    try:
        resp = httpx.get(
            "https://openrouter.ai/api/v1/auth/key",
            headers={"Authorization": f"Bearer {openrouter_key}"},
            timeout=5.0
        )
        if resp.status_code == 200:
            data = resp.json()
            results["openrouter"]["status"] = "VALID_AND_AUTHENTICATED"
            results["openrouter"]["details"] = f"OpenRouter Key verified: label={data.get('data', {}).get('label', 'default')}"
        else:
            results["openrouter"]["status"] = f"HTTP_{resp.status_code}"
            results["openrouter"]["details"] = resp.text[:120]
    except Exception as e:
        results["openrouter"]["status"] = "ERROR"
        results["openrouter"]["details"] = str(e)[:120]

# 8. Gemini API Key Test
gemini_key = os.getenv("GEMINI_API_KEY")
results["gemini"] = {
    "provider": "Google Gemini",
    "configured": bool(gemini_key),
    "masked_key": mask(gemini_key),
    "status": "NOT_TESTED",
    "details": ""
}
if gemini_key:
    try:
        resp = httpx.get(
            f"https://generativelanguage.googleapis.com/v1beta/models?key={gemini_key}",
            timeout=5.0
        )
        if resp.status_code == 200:
            data = resp.json()
            results["gemini"]["status"] = "VALID_AND_AUTHENTICATED"
            results["gemini"]["details"] = "Gemini models endpoint returned 200 OK"
        else:
            results["gemini"]["status"] = f"HTTP_{resp.status_code}"
            results["gemini"]["details"] = resp.text[:120]
    except Exception as e:
        results["gemini"]["status"] = "ERROR"
        results["gemini"]["details"] = str(e)[:120]

print(json.dumps(results, indent=2))
