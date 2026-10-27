---
'@hzblj/expo-zoom-transition': minor
---

A transient zoom source can be a copy of a whole context menu preview: `ZoomTransitionTransientSource` takes a `focusRect` (the photo inside it), so the target lands on that photo and the pushed screen grows out of the whole preview. The frozen `cover` is optional, and `onHandOver` runs with the copy when the push starts.
