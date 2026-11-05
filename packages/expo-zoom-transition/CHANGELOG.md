# @hzblj/expo-zoom-transition

## 0.2.2

### Patch Changes

- [#8](https://github.com/hzblj/expo-zoom-transition/pull/8) [`1838fad`](https://github.com/hzblj/expo-zoom-transition/commit/1838fadb1ab94faa4f56c35dea1f7cbac9659b1b) Thanks [@hzblj](https://github.com/hzblj)! - - iOS: a dismissal dragged for longer than half a second keeps the content still in the shrinking card when the finger lifts, and a close right after a cancelled drag zooms back onto the target: the enabler treats the dismissal as interactive until its transition completes, not for a fixed 0.5 s after the drag began.
  - Android: the way back from a scrolled screen starts where the target is on screen, and a quick back from a fitted target (a gallery) no longer starts at the window's top-left corner: the target records its position when its window scrolls and when its enter starts, not only when it redraws.
  - Android 7 (API 24/25) no longer crashes on `scrimColor`: the colour goes through Expo's `ColorCompat` (expo-modules-core 57.0.4+).

## 0.2.1

### Patch Changes

- [#6](https://github.com/hzblj/expo-zoom-transition/pull/6) [`f6f51cb`](https://github.com/hzblj/expo-zoom-transition/commit/f6f51cb15a447b1b718eb0be45a48265bafb5c5b) Thanks [@hzblj](https://github.com/hzblj)! - iOS: dragging a zoomed screen down keeps its content still in the shrinking card. UIKit shows the whole screen while the finger drags and switches to the alignment rect when it lifts or grabs again, so a target smaller than the screen (a photo under a header, a centred photo in a gallery) made the content jump inside the card. An interactive dismissal now aligns the whole screen; opening and a dismissal by the back button still land on the target.

## 0.2.0

### Minor Changes

- [#4](https://github.com/hzblj/expo-zoom-transition/pull/4) [`8da951e`](https://github.com/hzblj/expo-zoom-transition/commit/8da951ecca7efcaf96af87a749ee15c8bdfd3cfd) Thanks [@hzblj](https://github.com/hzblj)! - A transient zoom source can be a copy of a whole context menu preview: `ZoomTransitionTransientSource` takes a `focusRect` (the photo inside it), so the target lands on that photo and the pushed screen grows out of the whole preview. The frozen `cover` is optional, and `onHandOver` runs with the copy when the push starts.

## 0.1.3

### Patch Changes

- [`ffc9d7f`](https://github.com/hzblj/expo-zoom-transition/commit/ffc9d7f55166097f58ab543ab0fe2e053b42ab30) Thanks [@hzblj](https://github.com/hzblj)! - The README shows the example app on iOS and Android.

## 0.1.2

### Patch Changes

- [`7465fdb`](https://github.com/hzblj/expo-zoom-transition/commit/7465fdbf5542620e1f7f902172625edc77c6e5a3) Thanks [@hzblj](https://github.com/hzblj)! - The LICENSE is the complete MIT license, with the limitation of liability it was missing.

## 0.1.1

### Patch Changes

- [`6bc2adf`](https://github.com/hzblj/expo-zoom-transition/commit/6bc2adfd6003cc1f59db145912afa95255c9590b) Thanks [@hzblj](https://github.com/hzblj)! - The README links to the other libraries, at libraries.janblazej.dev.
