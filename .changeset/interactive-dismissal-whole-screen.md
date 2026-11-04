---
'@hzblj/expo-zoom-transition': patch
---

iOS: dragging a zoomed screen down keeps its content still in the shrinking card. UIKit shows the whole screen while the finger drags and switches to the alignment rect when it lifts or grabs again, so a target smaller than the screen (a photo under a header, a centred photo in a gallery) made the content jump inside the card. An interactive dismissal now aligns the whole screen; opening and a dismissal by the back button still land on the target.
