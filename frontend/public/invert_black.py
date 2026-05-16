from PIL import Image
import colorsys

def convert_black_to_white(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()

    new_data = []
    for r, g, b, a in data:
        if a == 0:
            new_data.append((r, g, b, a))
            continue
            
        h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
        # If it's very low saturation (grey/black/white) and not pure white
        if s < 0.2 and v < 0.8:
            # It's part of the black text or its anti-aliasing
            # We want to invert the lightness
            new_r = 255 - r
            new_g = 255 - g
            new_b = 255 - b
            new_data.append((new_r, new_g, new_b, a))
        else:
            new_data.append((r, g, b, a))

    img.putdata(new_data)
    img.save(output_path)

if __name__ == "__main__":
    convert_black_to_white("logo.png", "logo-white.png")
