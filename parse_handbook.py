import re
import json

def parse_markdown(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
        
    data = {"sections": []}
    current_h1 = None
    current_h2 = None
    current_h3 = None
    
    current_text = []
    
    def save_section():
        if current_h3 and current_text:
            text = "\n".join(current_text).strip()
            if text:
                data["sections"].append({
                    "h1": current_h1,
                    "h2": current_h2,
                    "h3": current_h3,
                    "content": text
                })
        current_text.clear()

    for line in lines:
        line_s = line.strip()
        if line_s.startswith("# ") or line_s.startswith("## ") or line_s.startswith("### "):
            save_section()
            
            if line_s.startswith("# "):
                current_h1 = line_s[2:].strip()
                current_h2 = None
                current_h3 = None
            elif line_s.startswith("## "):
                current_h2 = line_s[3:].strip()
                current_h3 = None
            elif line_s.startswith("### "):
                current_h3 = line_s[4:].strip()
                
        else:
            if current_h3:
                current_text.append(line.rstrip('\n'))

    save_section()
    return data

data = parse_markdown('staffHandbook.md')
with open('parsed_handbook.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Parsed successfully. Number of H3 sections:", len(data["sections"]))
