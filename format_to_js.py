import json
import re

with open('parsed_handbook.json') as f:
    data = json.load(f)

def clean_title(title):
    if not title:
        return ""
    title = re.sub(r'\*\*', '', title)
    title = title.replace(r'\!', '!')
    return title.strip()

for s in data['sections']:
    s['h1'] = clean_title(s.get('h1'))
    s['h2'] = clean_title(s.get('h2'))
    s['h3'] = clean_title(s.get('h3'))
    
js_content = "export const rawHandbook = " + json.dumps(data['sections'], indent=2) + ";\n"

with open('src/data/rawHandbook.js', 'w') as f:
    f.write(js_content)

print("Created src/data/rawHandbook.js")
