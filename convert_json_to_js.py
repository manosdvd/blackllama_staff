import json

def flatten_json(node, level=1, flat_list=None):
    if flat_list is None:
        flat_list = []
        
    if isinstance(node, dict):
        for key, value in node.items():
            # Format the key for the title
            title = key.replace('_', ' ').title()
            
            if isinstance(value, (dict, list)):
                # It's a group, add it with no content, then recurse
                flat_list.append({
                    "title": title,
                    "content": "",
                    "level": level
                })
                flatten_json(value, level + 1, flat_list)
            else:
                # It's a leaf node with text content
                flat_list.append({
                    "title": title,
                    "content": str(value),
                    "level": level
                })
    elif isinstance(node, list):
        for item in node:
            if isinstance(item, (dict, list)):
                flatten_json(item, level, flat_list)
            else:
                # A string item in a list
                flat_list.append({
                    "title": str(item),
                    "content": "",
                    "level": level
                })
                
    return flat_list

if __name__ == "__main__":
    with open('Camp_Lawton_Staff_Handbook (1).json', 'r', encoding='utf-8') as f:
        tree = json.load(f)
        
    flat = flatten_json(tree)
    
    output_path = 'src/data/rawHandbook.js'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("export const rawHandbook = ")
        json.dump(flat, f, indent=2, ensure_ascii=False)
        f.write(";\n")
        
    print(f"Successfully flattened {len(flat)} items to {output_path}")
