import cv2
import numpy as np
import math

W, H = 1920, 1080
CENTER = (W//2, H//2)
RADIUS = 250

fps = 24
duration = 6  # seconds per phase

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('measures_sequence.mp4', fourcc, fps, (W, H))

def draw_circle(img):
    cv2.circle(img, CENTER, RADIUS, (255,255,255), 2)

def draw_triangle(img, offset=0):
    cx, cy = CENTER
    pts = []
    for i in range(3):
        angle = math.radians(90 + i*120)
        x = int(cx + RADIUS * math.cos(angle))
        y = int(cy + RADIUS * math.sin(angle))
        pts.append([x, y])
    pts = np.array(pts, np.int32)

    pts[0][0] += offset  # misalignment

    cv2.polylines(img, [pts], True, (255,255,255), 2)
    return pts

def draw_lines(img, pts, skew=0):
    for p in pts:
        x = int((p[0] + CENTER[0]) / 2 + skew)
        y = int((p[1] + CENTER[1]) / 2)
        cv2.line(img, tuple(p), CENTER, (255,255,255), 1)

# --- PHASE 1: MISALIGNMENT ---
for i in range(fps * duration):
    img = np.zeros((H, W, 3), dtype=np.uint8)

    draw_circle(img)
    pts = draw_triangle(img, offset=20)
    draw_lines(img, pts, skew=10)

    out.write(img)

# --- PHASE 2: DRIFT ---
for i in range(fps * duration):
    img = np.zeros((H, W, 3), dtype=np.uint8)

    drift = int(20 + i*0.5)

    draw_circle(img)
    pts = draw_triangle(img, offset=drift)
    draw_lines(img, pts, skew=drift/2)

    out.write(img)

# --- PHASE 3: FRACTURE ---
for i in range(fps * duration):
    img = np.zeros((H, W, 3), dtype=np.uint8)

    shift = int(i * 2)

    draw_circle(img)
    pts = draw_triangle(img, offset=shift)

    for p in pts:
        cv2.line(img, tuple(p), (CENTER[0]+shift, CENTER[1]), (255,255,255), 1)

    out.write(img)

# --- HARD CUT ---
for i in range(int(fps * 0.5)):
    img = np.zeros((H, W, 3), dtype=np.uint8)
    out.write(img)

# --- PHASE 4: RESOLUTION ---
for i in range(fps * duration):
    img = np.zeros((H, W, 3), dtype=np.uint8)

    draw_circle(img)
    pts = draw_triangle(img, offset=0)
    draw_lines(img, pts, skew=0)

    out.write(img)

# --- FINAL FRAME ---
for i in range(fps * 3):
    img = np.zeros((H, W, 3), dtype=np.uint8)

    cv2.putText(img, "MEASURES REGISTRY",
                (600, 540),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.2, (255,255,255), 2)

    out.write(img)

out.release()