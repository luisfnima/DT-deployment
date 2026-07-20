import os

file_path = r"D:\Documentos\Antigravity\NUEVA WEB DREAMTEAM\landing\index.html"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    print("JSX text blocks with opacity below line 705:")
    for idx in range(704, len(lines)):
        line = lines[idx]
        if "opacity:" in line and "color:" in line and any(w in line for w in ["secondary", "rgba"]):
            print(f"Line {idx+1}: {line.strip()}")
            # Imprimir contexto
            for offset in range(-2, 3):
                if 0 <= idx + offset < len(lines):
                    print(f"  [{idx+offset+1}]: {lines[idx+offset].strip()}")
            print("-" * 40)
else:
    print("index.html not found")
