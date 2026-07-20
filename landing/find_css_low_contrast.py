import os

file_path = r"D:\Documentos\Antigravity\NUEVA WEB DREAMTEAM\landing\css\styles.css"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    print("Opacity rules in styles.css:")
    for idx, line in enumerate(lines):
        if "opacity" in line and not any(w in line for w in ["hover", "active", "transform", "transition", "filter"]):
            print(f"Line {idx+1}: {line.strip()}")
            # Imprimir contexto
            for offset in range(-2, 3):
                if 0 <= idx + offset < len(lines):
                    print(f"  [{idx+offset+1}]: {lines[idx+offset].strip()}")
            print("-" * 40)
else:
    print("styles.css not found")
