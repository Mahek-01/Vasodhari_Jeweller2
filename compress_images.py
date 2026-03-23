"""
Aggressive PNG compression: converts large PNGs to JPEG (if no real transparency),
and re-compresses existing JPEGs that are still too large.
Updates any HTML references if extension changes.
"""
import os
from PIL import Image

PHOTO_DIR = r"d:\jewelllary_shop2\photo"
QUALITY = 72
MAX_WIDTH = 1200

def has_real_transparency(img):
    """Check if PNG actually uses transparency."""
    if img.mode == "RGBA":
        r, g, b, a = img.split()
        if a.getextrema()[0] < 255:  # some pixels are not fully opaque
            return True
    return False

def compress_png(filepath, filename):
    img = Image.open(filepath)
    original_size = os.path.getsize(filepath)

    # Resize first
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / float(img.width)
        new_height = int(float(img.height) * ratio)
        img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)

    if has_real_transparency(img):
        # Keep as PNG but optimize
        img.save(filepath, format="PNG", optimize=True)
        new_size = os.path.getsize(filepath)
        print(f"  ✓ [PNG-kept] {filename}: {original_size//1024} KB → {new_size//1024} KB")
        return None  # no rename
    else:
        # Convert to JPEG for massive savings
        if img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")
        new_filepath = filepath.rsplit('.', 1)[0] + '.jpg'
        img.save(new_filepath, format="JPEG", quality=QUALITY, optimize=True, progressive=True)
        os.remove(filepath)  # remove original PNG
        new_size = os.path.getsize(new_filepath)
        print(f"  ✓ [PNG→JPG] {filename}: {original_size//1024} KB → {new_size//1024} KB  |  new file: {os.path.basename(new_filepath)}")
        return (filename, os.path.basename(new_filepath))  # (old, new)

def compress_jpg(filepath, filename):
    original_size = os.path.getsize(filepath)
    img = Image.open(filepath)
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / float(img.width)
        new_height = int(float(img.height) * ratio)
        img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(filepath, format="JPEG", quality=QUALITY, optimize=True, progressive=True)
    new_size = os.path.getsize(filepath)
    print(f"  ✓ [JPG]     {filename}: {original_size//1024} KB → {new_size//1024} KB")

def update_html_references(html_dir, renames):
    """Update img src references in HTML files for renamed files."""
    if not renames:
        return
    for fname in os.listdir(html_dir):
        if not fname.lower().endswith('.html'):
            continue
        fpath = os.path.join(html_dir, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        changed = False
        for old_name, new_name in renames:
            if old_name in content:
                content = content.replace(old_name, new_name)
                changed = True
                print(f"  📝 Updated reference {old_name} → {new_name} in {fname}")
        if changed:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)

if __name__ == "__main__":
    print(f"\nCompressing images in: {PHOTO_DIR}\n{'='*55}")
    renames = []
    for filename in os.listdir(PHOTO_DIR):
        filepath = os.path.join(PHOTO_DIR, filename)
        ext = filename.lower().split('.')[-1]
        if ext == 'png':
            result = compress_png(filepath, filename)
            if result:
                renames.append(result)
        elif ext in ('jpg', 'jpeg'):
            compress_jpg(filepath, filename)
        elif ext == 'webp':
            img = Image.open(filepath)
            img.save(filepath, format="WEBP", quality=QUALITY, method=6)
            print(f"  ✓ [WEBP]    {filename}")

    print(f"\nUpdating HTML references for {len(renames)} renamed file(s)...")
    update_html_references(r"d:\jewelllary_shop2", renames)
    print("\n✅ All done!")
