---
'@hzblj/expo-zoom-transition': minor
---

`ZoomTransition.Target` takes `ios.pagesHorizontally` for a target that pages sideways under its own gesture, such as a gesture-handler carousel of photos. A rightward swipe over it now pages instead of starting the interactive dismissal, which only knew to wait for scroll views.
