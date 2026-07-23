import sys
import math

try:
    from PIL import Image, ImageDraw
except ImportError:
    import subprocess
    subprocess.run([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image, ImageDraw

def draw_motor_ia_icon(size):
    # Background #0f172a (dark blue theme)
    img = Image.new("RGBA", (size, size), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)

    # Draw rounded rectangle container / glowing circle
    margin = int(size * 0.08)
    corner_radius = int(size * 0.22)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=corner_radius,
        fill=(30, 41, 59, 255),
        outline=(59, 130, 246, 255),
        width=int(size * 0.02)
    )

    # Draw Robot / AI Sparkle icon (purple / blue theme)
    cx, cy = size // 2, size // 2
    r = int(size * 0.28)

    # Gradient circle in middle
    draw.ellipse(
        [cx - r, cy - r, cx + r, cy + r],
        fill=(134, 59, 255, 255),
        outline=(71, 191, 255, 255),
        width=int(size * 0.025)
    )

    # Bolt / M shape in center (gold / yellow)
    bolt_pts = [
        (cx - int(size * 0.05), cy - int(size * 0.18)),
        (cx + int(size * 0.12), cy - int(size * 0.18)),
        (cx + int(size * 0.02), cy - int(size * 0.02)),
        (cx + int(size * 0.14), cy - int(size * 0.02)),
        (cx - int(size * 0.10), cy + int(size * 0.20)),
        (cx - int(size * 0.02), cy + int(size * 0.04)),
        (cx - int(size * 0.14), cy + int(size * 0.04)),
    ]
    draw.polygon(bolt_pts, fill=(245, 158, 11, 255))

    return img

draw_motor_ia_icon(192).save("D:/motor-ia/public/icon-192.png")
draw_motor_ia_icon(512).save("D:/motor-ia/public/icon-512.png")
print("Icons 192x192 and 512x512 generated successfully!")
