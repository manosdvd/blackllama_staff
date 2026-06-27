import re

with open('staffHandbookCL.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

bold_list_items = []
for i, line in enumerate(lines):
    # Match bullet points, numbered lists, OR plain lines that start with **Text**
    match = re.match(r'^(\s*(?:[\*\-]|\d+\.)\s*)?\*\*([^*]+)\*\*(.*)$', line.strip())
    if match:
        bold_list_items.append((i, match.group(2).strip(), match.group(3).strip()))

print(f"Found {len(bold_list_items)} items with bold starting text.")
for i, title, content in bold_list_items[-15:]:
    print(f"[{i}] {title} -> {content[:50]}")
