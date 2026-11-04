# Cutouts

`inbox/` is for cutouts that haven't been tagged yet. Once a cutout belongs to a movement, move it into that movement's `library/families/<branch>/<movement>/cutouts/` folder.

How to tag:
1. Open the site with `?lab=1#/lab` (the cutout tagger).
2. Load the images, tap the emotion wheel to tag each one, and fill in a label and categories.
3. Copy the manifest entries into the cutout manifest (`window.PCP.assets` in `site/live/index.html`, or a new manifest file).
4. Copy the image files to `assets/cutouts/` next to the deployed `index.html`.

Tags are emotion words only. The wheel decides how close one emotion is to another.
