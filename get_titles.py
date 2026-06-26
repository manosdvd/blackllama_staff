import json

with open('parsed_handbook.json', 'r') as f:
    data = json.load(f)

for idx, item in enumerate(data):
    h3 = item.get('h3') or item.get('h2') or item.get('h1')
    print(f"[{idx}] {h3}")

