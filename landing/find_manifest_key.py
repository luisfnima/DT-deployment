import os

base_path = r"D:\Documentos\Antigravity\NUEVA WEB DREAMTEAM\landing"
target_key = "f5263b95-a646-495e-934c-b2e5ca2f0a56"

for root, dirs, files in os.walk(base_path):
    for file in files:
        if file.endswith((".js", ".jsx", ".html", ".json")) and file != "assets_manifest.json":
            full_path = os.path.join(root, file)
            try:
                with open(full_path, "r", encoding="utf-8") as f:
                    content = f.read()
                if target_key in content:
                    print(f"Found key in: {os.path.relpath(full_path, base_path)}")
            except Exception as e:
                pass
