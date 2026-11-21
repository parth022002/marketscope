"""
MarketScope.io — Entity Recognition & Mapping Engine
Maps news stories to canonical instruments and companies in universal_instrument_master.
STRICT RULE: Avoids common-word ticker collisions (e.g., 'IT', 'ON', 'BE', 'NOW').
"""

import re
from typing import Any
from app.domain.canonical_news import NewsEntity
from app.engine.instrument_resolver import instrument_resolver
from app.engine.instrument_master import universal_instrument_master

# Common English words that match financial tickers on global/domestic exchanges
COMMON_WORD_TICKERS = {
    "IT", "ON", "BE", "AT", "BY", "NOW", "ALL", "FOR", "CAN", "OUT", "IN", "DO", "GO", "ME", "SO", "UP"
}

KNOWN_ENTITIES = [
    # Indian Large Caps
    ("RELIANCE", "Reliance Industries Limited", "NSE:RELIANCE", "company", ["Reliance", "RIL", "Mukesh Ambani", "Jio"]),
    ("TCS", "Tata Consultancy Services Limited", "NSE:TCS", "company", ["TCS", "Tata Consultancy Services"]),
    ("HDFCBANK", "HDFC Bank Limited", "NSE:HDFCBANK", "company", ["HDFC Bank", "HDFC"]),
    ("ICICIBANK", "ICICI Bank Limited", "NSE:ICICIBANK", "company", ["ICICI Bank"]),
    ("INFY", "Infosys Limited", "NSE:INFY", "company", ["Infosys", "Salil Parekh"]),
    ("BHARTIARTL", "Bharti Airtel Limited", "NSE:BHARTIARTL", "company", ["Bharti Airtel", "Airtel", "Sunil Mittal"]),
    ("TATAMOTORS", "Tata Motors Limited", "NSE:TATAMOTORS", "company", ["Tata Motors"]),
    ("LT", "Larsen & Toubro Limited", "NSE:LT", "company", ["Larsen & Toubro", "L&T"]),
    # Global Tech Majors
    ("AAPL", "Apple Inc.", "NASDAQ:AAPL", "company", ["Apple", "iPhone", "Tim Cook"]),
    ("NVDA", "NVIDIA Corporation", "NASDAQ:NVDA", "company", ["NVIDIA", "Jensen Huang", "Blackwell", "H100"]),
    ("MSFT", "Microsoft Corporation", "NASDAQ:MSFT", "company", ["Microsoft", "Satya Nadella", "Azure"]),
    # Major Macro Institutions & Indices
    ("RBI", "Reserve Bank of India", "RBI", "institution", ["Reserve Bank of India", "RBI", "MPC", "Shaktikanta Das"]),
    ("FED", "Federal Reserve System", "FED", "institution", ["Federal Reserve", "Fed", "FOMC", "Jerome Powell"]),
    ("SEBI", "Securities and Exchange Board of India", "SEBI", "institution", ["SEBI", "Madhabi Puri Buch"]),
    ("NIFTY 50", "Nifty 50 Index", "NSE:NIFTY50", "index", ["Nifty 50", "Nifty"]),
    ("SENSEX", "BSE SENSEX", "BSE:SENSEX", "index", ["Sensex", "BSE Sensex"]),
    ("BRENT", "Brent Crude Oil", "BRENT", "commodity", ["Brent Crude", "Brent", "OPEC"]),
    ("GOLD", "Gold Bullion", "GOLD MCX", "commodity", ["Gold", "Gold 24K", "Bullion"]),
    ("USD/INR", "US Dollar / Indian Rupee", "USD/INR", "currency", ["Rupee", "USD/INR", "Forex"]),
]


class NewsEntityResolver:
    @classmethod
    def resolve_entities(cls, headline_or_article: Any, summary: str = "") -> list[NewsEntity]:
        if isinstance(headline_or_article, str):
            headline = headline_or_article
        else:
            headline = getattr(headline_or_article, "headline", "")
            summary = getattr(headline_or_article, "summary", "")

        text = f"{headline} {summary}"
        matched_entities: list[NewsEntity] = []
        seen_symbols: set[str] = set()

        for sym, name, canon_sym, ent_type, keywords in KNOWN_ENTITIES:
            # Check keywords with word boundaries
            matched = False
            for kw in keywords:
                pattern = r"\b" + re.escape(kw) + r"\b"
                if re.search(pattern, text, re.IGNORECASE):
                    matched = True
                    break

            if matched and canon_sym not in seen_symbols:
                seen_symbols.add(canon_sym)
                matched_entities.append(
                    NewsEntity(
                        type=ent_type,
                        name=name,
                        symbol=canon_sym,
                        relevance_pct=95 if re.search(r"\b" + re.escape(sym) + r"\b", headline, re.IGNORECASE) else 80,
                    )
                )

        return matched_entities
