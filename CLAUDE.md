# @hzblj/expo-zoom-transition

A push that grows out of the view it was opened from, for Expo Router stacks: UIKit's zoom (iOS 18) and Material's
container transform (Android). An Expo module (`ExpoZoomTransition`: `ios/`, `android/`) and its JS (`src/` →
`build/`). Built for `@hzblj/kara-ui` (`../kara-ui`), whose router wraps it with design tokens and whose context menu
hands a tapped preview's photo over as a transient source. Nothing here may know about kara: props take plain values
(dp, ms, `ColorValue`).

**Three pieces, one identifier.** `Source` on the screen you push from, `Enabler` and `Target` on the pushed screen;
the identifier travels in the route params (`ZOOM_TRANSITION_PARAM`, read back with `useZoomTransitionParam`). The
native views look each other up through `ZoomTransitionRegistry`, so neither screen references the other.

**Shared props at the top, platform props under `ios` / `android`.** Every top-level prop works on both platforms; what
only one can do is typed apart and ignored on the other. Keep it that way when adding a setting. Defaults differ where
the platforms do: the target's `fit` is `source` on iOS (no stretching) and `target` on Android (the transform
cross-fades, so it never stretches).

**Platform files with a fallback.** `ZoomTransition.ios.tsx` / `.android.tsx` for Metro, `ZoomTransition.tsx` for
everything else (and for the types): it renders children alone. All three are typed `ZoomTransitionComponent`.

## iOS

**Adapted from expo-router, keep the notice.** The split and the aspect-ratio alignment come from expo-router's
`Link.AppleZoom` (MIT, `THIRD_PARTY_NOTICES.md`). Ours sets the transition on whatever `UIViewController` owns the
enabler, so it works with any react-native-screens stack.

**Three `display: contents` views.** `ZoomTransitionSourceView` and `ZoomTransitionTargetView` register their single
child (`mountChildComponentView`); `ZoomTransitionEnablerView` sets its controller's `preferredTransition` from
`didMoveToSuperview` in a `dispatch_async`, which react-native-screens' push (queued after the mount transaction) runs
after, so the enabler must be in the pushed screen's first commit. `disableForceFlatten` (read by
`ExpoViewShadowNode`) keeps them as native views without a layout box. Below iOS 18 nothing is set. Changing
`dimmingColor` or `dimmingBlur` re-runs the setup, because UIKit copies the options.

**The interactive dismissal goes through `ZoomTransitionDismissGate`**, like Photos: down only when no scroll view under
the finger can still scroll up, right only when no horizontal one can still scroll back, never up or left. It only
answers; it never restarts a recognizer.

**The transient source is public API.** `ZoomTransitionRegistry.shared`, `sourceIdentifier(within:)`,
`setTransientSource` / `finishTransientSource` and `ZoomTransitionTransientSource(view:cover:)` are what another module
(kara's `ContextMenuView`, `import ExpoZoomTransition`) uses to zoom from a view that is not the registered source: a
copy of a tapped preview's photo laid over the window, under a frozen snapshot. The enabler hands the copy to UIKit and
fades the snapshot over 0.3 s; the copy goes when the push completes. Changing those signatures breaks kara's pod.

## Android

**Material's container transform, not Compose shared elements**: every screen is its own fragment. The target hides
itself on attach and transforms from the registered source on its first pre-draw with a size; options come from the
pushed screen's `ZoomTransitionEnablerView` through the registry (it draws nothing). The pop is native and starts
before JavaScript hears of it, so the enabler calls `reverseZoomTransition` from `beforeRemove`: the target is drawn
into a bitmap by hand (Fabric views are never `isLaidOut`, `drawToBitmap` throws) and replayed as a ghost into the
source once that is attached again. Both ends of a fitted transform are `ZoomTransitionFrameView`s in
`android:id/content`: the transform throws for an end outside it. The source and target override `onLayout` with a
no-op: `ExpoView` is a `LinearLayout` and the visibility toggle re-laid the children out at 0,0. Never hide an end
yourself before Material does, or the photo blinks for a frame.

**Known app-side issues, not fixable here** (README, Platform behavior): react-native-screens#4711 swallows a tap for
~0.5 s after a zoom pop on iOS 18+, and `expo-dev-menu`'s three-finger recogniser breaks the interactive dismissal in a
dev client (expo/expo#43338). kara's example carries Yarn patches for both.

Code style follows `@hzblj/biome-config` (`yarn lint`). Docs copy (README, JSDoc, changesets) has no em dashes.
