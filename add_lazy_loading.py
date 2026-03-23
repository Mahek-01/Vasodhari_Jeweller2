import re
import os

def add_lazy_loading(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find img tags that do NOT have loading attribute
    # Improved regex to handle newlines
    img_pattern = re.compile(r'(<img\b(?![^>]*\bloading=)[^>]*?)(/?>)', re.IGNORECASE | re.DOTALL)
    
    # Replace by inserting loading="lazy" before the closing bracket
    new_content = img_pattern.sub(r'\1 loading="lazy"\2', content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes needed for {filepath}")

if __name__ == "__main__":
    add_lazy_loading(r'd:\jewelllary_shop2\index.html')
