import re
import json

def parse_markdown_to_tree(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # We will just split by any heading
    sections = []
    current_section = {"level": 0, "title": "Root", "lines": [], "children": []}
    stack = [current_section]

    for line in lines:
        match = re.match(r'^(#{1,6})\s+(.*)$', line)
        if match:
            level = len(match.group(1))
            title = match.group(2).replace('**', '').replace('\\', '').strip().rstrip(':')
            
            new_section = {"level": level, "title": title, "lines": [], "children": []}
            
            # Pop stack until we find a parent with level < current level
            while stack and stack[-1]["level"] >= level:
                stack.pop()
                
            if stack:
                stack[-1]["children"].append(new_section)
                
            stack.append(new_section)
            sections.append(new_section)
        else:
            if stack:
                stack[-1]["lines"].append(line)

    return current_section

tree = parse_markdown_to_tree('staffHandbookCL.md')

standalone_exact = {
    'phones', 'photography and social media', 'video games and other recreation',
    'drugs, alcohol, pornography', 'fraternization', 'severe weather preparedness',
    'lightning safety', 'heat & thermal stress mitigation', 'safeguarding youth',
    'mandatory reporting', 'missing person / code blue', 'bear & wildlife safety',
    'fire safety', 'armed intruder / active shooter', 'fatality protocol',
    'packing list', 'required paperwork', 'code of conduct', 'camp address',
    'catalina council/camp lawton leadership'
}

skip_titles = {
    'camp lawton staff handbook', 'part 1', 'part 2',
    'part 3 campfire master class and songbook', 'part 4 onboarding'
}

articles = []

def process_node(node, parent_article=None):
    title = node['title'].lower()
    level = node['level']
    
    is_standalone = False
    if level <= 2:
        is_standalone = True
    if title in standalone_exact:
        is_standalone = True
        
    if title in skip_titles or re.match(r'^part\s+\d+$', title):
        is_standalone = False

    # If it's the root, it's not an article
    if level == 0:
        is_standalone = False

    current_article = None
    if is_standalone:
        current_article = {
            "title": node['title'],
            "content": "".join(node['lines'])
        }
        articles.append(current_article)
        
        # If this was extracted from a parent, add a link in the parent
        if parent_article:
            parent_article["content"] += f"\n\n[[{node['title']}]]\n\n"
    else:
        # Not standalone, so append its heading and lines to the parent article
        if parent_article and level > 0:
            parent_article["content"] += f"\n{'#' * level} {node['title']}\n"
            parent_article["content"] += "".join(node['lines'])
            
    # Process children
    for child in node['children']:
        process_node(child, current_article if is_standalone else parent_article)

process_node(tree)

print(f"Generated {len(articles)} articles.")
for a in articles:
    print(a['title'])
