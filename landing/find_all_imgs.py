import os
import re

file_path = r"D:\Documentos\Antigravity\NUEVA WEB DREAMTEAM\landing\index.html"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    imgs = re.findall(r"<img[^>]*>", content)
    print("Found img tags in index.html:")
    for idx, img in enumerate(imgs):
        print(f"  {idx+1}: {img}")
else:
    print("index.html not found")
