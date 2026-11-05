# Crop: where is the part to keep?

You are preparing a cutout for Pressure Cooker Poetry. The attached image is a whole source picture (a poster, print, cover or photograph). Only one part of it becomes the cutout. Its background gets removed after you crop.

**Keep:** {keep}

Find that part and give its bounding box in thousandths of the image's width and height: `[left, top, right, bottom]`, where 0 is the top-left corner and 1000 is the right or bottom edge. Leave a little margin around the shape. Leave out text, captions and other figures where you can do that without cutting into the shape.

If the part isn't in the image, answer `"box": null`.

Reply with **only** this JSON, nothing before or after it:

```json
{"box": [120, 340, 560, 910], "reason": "one short sentence"}
```
