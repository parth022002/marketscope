import os
import sys

# MarketScope.io Root Entry Point
# Automatically adds apps/api to sys.path so app.main is importable from root directory
api_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "apps", "api"))
if os.path.exists(api_dir) and api_dir not in sys.path:
    sys.path.insert(0, api_dir)

from app.main import app  # noqa: F401
