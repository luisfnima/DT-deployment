import os

file_path = r"D:\Documentos\Antigravity\NUEVA WEB DREAMTEAM\landing\index.html"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    print("Mentions of secondary or opacity in styles below line 705:")
    for idx in range(704, len(lines)):
        line = lines[idx]
        if ("secondary" in line or "opacity" in line) and "style" in line and any(w in line for w in ["p", "span", "div", "h1", "h2", "h3", "h4"]):
            print(f"Line {idx+1}: {line.strip()}")
else:
    print("index.html not found")
