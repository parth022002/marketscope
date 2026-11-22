import os
import re
from collections import defaultdict

env_usages = defaultdict(list)

# Python scan in apps/api
for root, dirs, files in os.walk('apps/api'):
    if '.venv' in root or '__pycache__' in root or '.pytest_cache' in root:
        continue
    for f in files:
        if f.endswith('.py'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                for idx, line in enumerate(fp, 1):
                    for m in re.finditer(r'os\.(getenv|environ(?:\.get)?)\s*\(\s*[\'"]([A-Za-z0-9_]+)[\'"]', line):
                        var = m.group(2)
                        env_usages[var].append(f'{p}:{idx}')
                    for m in re.finditer(r'os\.environ\s*\[\s*[\'"]([A-Za-z0-9_]+)[\'"]\s*\]', line):
                        var = m.group(1)
                        env_usages[var].append(f'{p}:{idx}')

# JS/TS scan in apps/web
for root, dirs, files in os.walk('apps/web'):
    if 'node_modules' in root or '.next' in root:
        continue
    for f in files:
        if f.endswith(('.ts', '.tsx', '.js', '.mjs')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                for idx, line in enumerate(fp, 1):
                    for m in re.finditer(r'process\.env(?:\.([A-Za-z0-9_]+)|\[[\'"]([A-Za-z0-9_]+)[\'"]\])', line):
                        var = m.group(1) or m.group(2)
                        env_usages[var].append(f'{p}:{idx}')

print(f"Total distinct env vars referenced in code: {len(env_usages)}")
for k in sorted(env_usages.keys()):
    print(f"{k}: {len(env_usages[k])} occurrences | e.g. {env_usages[k][0]}")
