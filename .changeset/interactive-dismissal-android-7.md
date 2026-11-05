---
"@hzblj/expo-zoom-transition": patch
---

- iOS: a dismissal dragged for longer than half a second keeps the content still in the shrinking card when the finger lifts, and a close right after a cancelled drag zooms back onto the target: the enabler treats the dismissal as interactive until its transition completes, not for a fixed 0.5 s after the drag began.
- Android: the way back from a scrolled screen starts where the target is on screen, and a quick back from a fitted target (a gallery) no longer starts at the window's top-left corner: the target records its position when its window scrolls and when its enter starts, not only when it redraws.
- Android 7 (API 24/25) no longer crashes on `scrimColor`: the colour goes through Expo's `ColorCompat` (expo-modules-core 57.0.4+).
