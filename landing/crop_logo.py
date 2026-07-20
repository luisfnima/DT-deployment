import os
import shutil
from PIL import Image

original_path = r"D:\Documentos\Antigravity\NUEVA WEB DREAMTEAM\landing\LOGO NUEVO LANDING.png"
file_path = r"D:\Documentos\Antigravity\NUEVA WEB DREAMTEAM\landing\images\logoImg_nuevo.png"

# Volver a copiar el original limpio para procesarlo desde cero
shutil.copy2(original_path, file_path)

if os.path.exists(file_path):
    try:
        img = Image.open(file_path).convert("RGBA")
        print(f"Original Size: {img.size}")
        
        w, h = img.size
        pixels = img.load()
        
        # 1. Hacer transparentes los colores del recuadro de fondo gris claro (umbral >= 210)
        # y limpiar los píxeles semitransparentes del borde
        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                
                # Usamos un umbral de 210 para capturar el recuadro gris claro de fondo
                if r >= 210 and g >= 210 and b >= 210:
                    pixels[x, y] = (r, g, b, 0)
                # Si es casi transparente, lo limpiamos
                elif a <= 15:
                    pixels[x, y] = (r, g, b, 0)
        
        # 2. Encontrar la caja delimitadora real tras la limpieza del recuadro
        bbox = img.getbbox()
        if bbox:
            print(f"Cleaned Bounding Box (Left, Top, Right, Bottom): {bbox}")
            # Recortar la imagen
            cropped_img = img.crop(bbox)
            print(f"New Cropped Size: {cropped_img.size}")
            
            # Guardar la imagen recortada
            cropped_img.save(file_path, "PNG")
            print("Successfully processed, cropped and saved logoImg_nuevo.png!")
        else:
            print("No non-transparent pixels found after cleaning.")
    except Exception as e:
        print(f"Error processing image: {e}")
else:
    print("logoImg_nuevo.png not found")
