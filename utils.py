from IPython.display import HTML, Javascript, display
import ipywidgets as wi
from PIL import Image
from io import BytesIO
from base64 import b64encode, b64decode
from uuid import uuid4
from pathlib import Path

def ID_canvas(ID=None, width=300, height=100):
    if not ID:
        ID = str(uuid4())[:8]
    canvas = wi.HTML(f"""
    <canvas
        id={ID}
        width={width}
        height={height}
        style=background:white;>
    </canvas>
    """)
    return ID, canvas

def ID_multicanvas(N=3, ID=None, width=512, height=512):
    if not ID:
        ID = str(uuid4())[:8]
    canvas = wi.HTML('\n'.join(
    f'<canvas id={ID}{i} width={width} height={height} style="position:absolute;"></canvas>'
    for i in range(N)) +
    f'<canvas width={width} height={height} style="background:white;"></canvas>')
    return ID, canvas

def encode(image):
    buffer = BytesIO()
    image.save(buffer, format="png")
    text = b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{text}"

def decode(text):
    return Image.open(BytesIO(b64decode(text.split(",")[-1])))

script = (Path(__file__).parent/'spylus.js').read_text()
