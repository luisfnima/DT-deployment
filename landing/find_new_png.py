import os
import time

base_path = r"D:\Documentos\Antigravity\NUEVA WEB DREAMTEAM\landing"

png_files = []
for root, dirs, files in os.walk(base_path):
    for file in files:
        if file.endswith(".png"):
            full_path = os.path.join(root, file)
            mtime = os.path.getmtime(full_path)
            png_files.append((full_path, mtime))

png_files.sort(key=lambda x: x[1], reverse=True)

print("Files sorted by modification date (newest first):")
for path, mtime in png_files[:10]:
    rel = os.path.relpath(path, base_path)
    print(f"  {rel} - Size: {os.path.getsize(path)} bytes - Modified: {time.ctime(mtime)}")
