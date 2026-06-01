from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

W,H=1200,630
# Cargar hero, fit cover, oscurecer
hero=Image.open('/Users/JPEREZ/Documents/grupo-plasencia-decks-public/prototype/hero-showroom.jpg').convert('RGB')
hw,hh=hero.size
ratio=max(W/hw,H/hh)
hero=hero.resize((int(hw*ratio),int(hh*ratio)),Image.LANCZOS)
hw,hh=hero.size
hero=hero.crop(((hw-W)//2,(hh-H)//2,(hw-W)//2+W,(hh-H)//2+H))
# Oscurecer + un poco de blur sutil
hero=ImageEnhance.Brightness(hero).enhance(0.42)
hero=hero.filter(ImageFilter.GaussianBlur(radius=1.5))

canvas=Image.new('RGB',(W,H),(15,26,46))
canvas.paste(hero,(0,0))

# Overlay gradient navy de izquierda
overlay=Image.new('RGBA',(W,H),(0,0,0,0))
od=ImageDraw.Draw(overlay)
for x in range(W):
    alpha=int(220*(1-x/W)**1.6)
    od.line([(x,0),(x,H)],fill=(15,26,46,alpha))
# Sombra inferior
for y in range(H//2,H):
    a=int(180*((y-H//2)/(H//2))**2.4)
    od.line([(0,y),(W,y)],fill=(15,26,46,a))
canvas.paste(overlay,(0,0),overlay)

draw=ImageDraw.Draw(canvas)

# Fonts (busca system fonts comunes mac)
def load(font_paths,size):
    for p in font_paths:
        try: return ImageFont.truetype(p,size)
        except: pass
    return ImageFont.load_default()

f_disp_xl=load(['/System/Library/Fonts/Supplemental/Futura.ttc','/System/Library/Fonts/HelveticaNeue.ttc','/System/Library/Fonts/Helvetica.ttc'],84)
f_disp_lg=load(['/System/Library/Fonts/HelveticaNeue.ttc','/System/Library/Fonts/Helvetica.ttc'],38)
f_disp_md=load(['/System/Library/Fonts/HelveticaNeue.ttc','/System/Library/Fonts/Helvetica.ttc'],22)
f_disp_sm=load(['/System/Library/Fonts/HelveticaNeue.ttc'],18)

GOLD=(236,201,75)
GOLD_D=(183,121,31)
WHITE=(255,255,255)
NAVY=(15,26,46)

# Logo Plasencia (text wordmark)
PAD=72
y=PAD
draw.text((PAD,y),'GRUPO PLASENCIA',font=f_disp_md,fill=GOLD)
draw.line([(PAD,y+34),(PAD+150,y+34)],fill=GOLD,width=2)
y+=58
draw.text((PAD,y),'M A R K E T P L A C E',font=f_disp_sm,fill=WHITE)

# Headline
y=240
draw.text((PAD,y),'Tu próximo auto,',font=f_disp_xl,fill=WHITE)
y+=98
# Gold gradient texto via stroke + fill
draw.text((PAD,y),'sin perseguir a nadie.',font=f_disp_xl,fill=GOLD)

# Stats inferior
y=H-110
stats=[('+2,050','autos'),('14','marcas'),('42','agencias'),('6','estados'),('75','años')]
sx=PAD
for n,l in stats:
    draw.text((sx,y),n,font=f_disp_lg,fill=WHITE)
    bbox=draw.textbbox((sx,y),n,font=f_disp_lg)
    w=bbox[2]-bbox[0]
    draw.text((sx,y+44),l.upper(),font=f_disp_sm,fill=GOLD)
    sx+=max(w,140)+30

# Borde gold inferior decorativo
draw.rectangle([(0,H-6),(W,H)],fill=GOLD)

# Spark Plasi en esquina derecha (decoración)
cx,cy,r=W-130,180,90
# Halo
for i in range(20,0,-1):
    a=int(8+i*2)
    draw.ellipse([(cx-r-i*4,cy-r-i*4),(cx+r+i*4,cy+r+i*4)],outline=(*GOLD,a) if False else None)
draw.ellipse([(cx-r,cy-r),(cx+r,cy+r)],fill=NAVY,outline=GOLD,width=3)
# Spark
pts=[(cx,cy-r+10),(cx+18,cy-12),(cx+r-10,cy),(cx+18,cy+12),(cx,cy+r-10),(cx-18,cy+12),(cx-r+10,cy),(cx-18,cy-12)]
draw.polygon(pts,fill=GOLD)
draw.ellipse([(cx-12,cy-12),(cx+12,cy+12)],fill=WHITE)

canvas.save('/Users/JPEREZ/Documents/grupo-plasencia-decks-public/prototype/og-cover.jpg','JPEG',quality=88,optimize=True)
print('og-cover.jpg generated:',os.path.getsize('/Users/JPEREZ/Documents/grupo-plasencia-decks-public/prototype/og-cover.jpg'),'bytes')
