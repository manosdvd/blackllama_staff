import re
import json

def parse_markdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    sections = []
    
    current_h1 = ""
    current_h2 = ""
    current_h3 = ""
    current_h4 = ""
    
    current_title = ""
    current_level = 0
    current_header_level = 0
    current_content = []
    
    def save_section():
        if current_level > 0:
            content_str = "".join(current_content).strip()
            def clean(val):
                if not val:
                    return ""
                cleaned = re.sub(r'^\*\*|\*\*(:)?$', '', val).strip()
                cleaned = cleaned.replace('\\!', '!').replace('\\.', '.').replace('\\-', '-')
                return cleaned
            
            t = clean(current_title)
            if not t or t == "#":
                t = "Intro"
                
            sections.append({
                "h1": clean(current_h1),
                "h2": clean(current_h2),
                "h3": clean(current_h3),
                "h4": clean(current_h4),
                "title": t,
                "level": current_level,
                "content": content_str
            })
        current_content.clear()
        
    for line in lines:
        stripped = line.strip()
        header_match = re.match(r'^(#{1,6})\s+(.*)$', stripped)
        bold_match = re.match(r'^(\s*(?:[\*\-]|\d+\.)\s*)?\*\*([^*]+)\*\*(.*)$', stripped)
        
        if header_match:
            save_section()
            hashes = header_match.group(1)
            level = len(hashes)
            title = header_match.group(2).strip()
            title_clean = re.sub(r'^\*\*|\*\*(:)?$', '', title).strip()
            
            if level == 1:
                current_h1 = title_clean
                current_h2 = ""
                current_h3 = ""
                current_h4 = ""
            elif level == 2:
                current_h2 = title_clean
                current_h3 = ""
                current_h4 = ""
            elif level == 3:
                current_h3 = title_clean
                current_h4 = ""
            elif level == 4:
                current_h4 = title_clean
                
            current_title = title_clean
            current_level = level
            current_header_level = level
            
        elif bold_match:
            save_section()
            title = bold_match.group(2).strip()
            rest = bold_match.group(3).strip()
            title_clean = re.sub(r'(:|-)$', '', title).strip()
            
            # Nest under the current markdown header
            level = min(current_header_level + 1, 6)
            
            if rest:
                current_content.append(rest + '\n')
                
            current_title = title_clean
            current_level = level
            
        else:
            if current_level > 0:
                current_content.append(line)
                
    save_section()
    return sections

if __name__ == "__main__":
    sections = parse_markdown('staffHandbookCL.md')
    print(f"Parsed {len(sections)} sections from staffHandbookCL.md")
    
    output_path = 'src/data/rawHandbook.js'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("export const rawHandbook = ")
        json.dump(sections, f, indent=2, ensure_ascii=False)
        f.write(";\n")
    print(f"Successfully wrote data to {output_path}")
