import os
from PIL import Image

file_path = r"D:\Documentos\Antigravity\NUEVA WEB DREAMTEAM\landing\images\logoImg_nuevo.png"

if os.path.exists(file_path):
    img = Image.open(file_path).convert("RGBA")
    w, h = img.size
    print(f"Size: {w}x{h}")
    
    # Analizar una fila horizontal en el medio
    y = h // 2
    row_colors = []
    for x in range(0, w, 10):  # Muestrear cada 10 píxeles
        r, g, b, a = img.getpixel((x, y))
        row_colors.append((x, (r, g, b, a)))
        
    print(f"Colors along row y={y}:")
    for x, rgba in row_colors:
        if rgba[3] > 0:  # Mostrar sólo sólidos
            print(f"  x={x}: RGBA{rgba}")
else:
    print("logoImg_nuevo.png not found")
