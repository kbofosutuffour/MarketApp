from PIL import Image, ImageDraw

width, height = 2212, 2212
# color = "#00000000"
image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)

# left = width // 4
# top = height // 4
# right = 3 * (width//4)
# bottom = 3 * (height//4)
x, y = 0, 0
width_rect, height_rect = width, height
draw.rounded_rectangle([(x, y), (x + width_rect, y + height_rect)], radius=800, fill="#115740")

overlay = Image.open("myproject\static\media\wm_cypher_gold.png")
overlay_position = (250, 250)
image.paste(overlay, overlay_position, overlay)

image.save("wm_logo_green.png", "PNG")

image.close()
overlay.close()