import os
import subprocess
from PIL import Image

logo_svg_path = os.path.abspath('public/logo.svg')
temp_html_path = os.path.abspath('temp_icon.html')
temp_screenshot_path = os.path.abspath('temp_icon.png')

html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body, html {{ width: 512px; height: 512px; overflow: hidden; background: #0F172A; }}
  svg {{ width: 512px; height: 512px; display: block; }}
</style>
</head>
<body>
  {open(logo_svg_path, 'r', encoding='utf-8').read()}
</body>
</html>
"""

with open(temp_html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

cmd = [
    chrome_path,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=512,512',
    '--hide-scrollbars',
    f'--screenshot={temp_screenshot_path}',
    temp_html_path
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome return code:", res.returncode)

if os.path.exists(temp_screenshot_path):
    img = Image.open(temp_screenshot_path)
    img_512 = img.resize((512, 512), Image.LANCZOS)
    img_512.save('public/pwa-512x512.png', 'PNG')
    img_512.save('public/logo.png', 'PNG')

    img_192 = img.resize((192, 192), Image.LANCZOS)
    img_192.save('public/pwa-192x192.png', 'PNG')

    img_180 = img.resize((180, 180), Image.LANCZOS)
    img_180.save('public/apple-touch-icon.png', 'PNG')
    img_180.save('public/apple-touch-icon-precomposed.png', 'PNG')

    print("Successfully generated all PWA & iOS Apple Touch icons!")
else:
    print("Screenshot failed, stderr:", res.stderr)

if os.path.exists(temp_html_path):
    os.remove(temp_html_path)
if os.path.exists(temp_screenshot_path):
    os.remove(temp_screenshot_path)
