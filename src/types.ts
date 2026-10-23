import type {ReactElement, ReactNode} from 'react'
import type {ColorValue} from 'react-native'

/*
 * Every prop at the top level works on both platforms. What only one platform can do lives under `ios` or `android`,
 * typed apart, and is ignored on the other, so a call site reads which of its settings each platform honours.
 */

export type ZoomTransitionSourceAndroidOptions = {
  /** The corners the transform starts with, in dp: the source's own rounding (iOS reads the view's own). Default 0. */
  borderRadius?: number
}

export type ZoomTransitionSourceProps = {
  /** Android-only settings. */
  android?: ZoomTransitionSourceAndroidOptions
  /** A single view: the photo or card the zoom grows from. */
  children: ReactElement
  /** Unset renders `children` alone: no zoom from here. Use `useZoomTransitionSourceId` for one unique per item. */
  identifier?: string
}

export type ZoomTransitionTargetIosOptions = {
  /**
   * What the source lands on. `source` (default): a rect of the source's aspect ratio centred in the target, so
   * nothing is stretched. `target`: the whole target.
   */
  fit?: 'source' | 'target'
}

export type ZoomTransitionTargetAndroidOptions = {
  /** The corners the transform ends with, in dp: the target's own rounding. Default 0. */
  borderRadius?: number
  /**
   * What the source lands on. `target` (default): the whole target. `photo`: the photo inside it (where a `contain`
   * photo sits in a tall page), with the photo's cropped edges fading in on the way.
   */
  fit?: 'photo' | 'target'
  /** The Android target is a real layout box (iOS adds none): give it `flex` when its child fills the parent. */
  flex?: number
}

export type ZoomTransitionTargetProps = {
  /** Android-only settings. */
  android?: ZoomTransitionTargetAndroidOptions
  /** A single view: what the source lands on in the pushed screen. */
  children: ReactElement
  /** The source's identifier, handed over in the route params. Unset renders `children` alone. */
  identifier?: string
  /** iOS-only settings. */
  ios?: ZoomTransitionTargetIosOptions
}

/**
 * Which of UIKit's gestures may dismiss the screen back into its source. `any`: swipe down, edge swipe and pinch (a
 * swipe only once no scroll view under the finger can still scroll that way). `vertical`: a downward swipe only, for
 * content that pages sideways under its own gestures (a gallery). `none`: the back button only.
 */
export type ZoomTransitionDismissGesture = 'any' | 'none' | 'vertical'

/** A system material blurring the screen behind the zoomed one. */
export type ZoomTransitionBlur = 'regular' | 'thick' | 'thin' | 'ultraThin'

/** Material 3 `emphasized` is `0.2, 0, 0, 1`, `standard` `0.4, 0, 0.2, 1`, `decelerate` `0, 0, 0, 1`. */
export type ZoomTransitionEasing = 'decelerate' | 'emphasized' | 'linear' | 'standard'

/** How the two screens' contents fade into each other inside the container (`MaterialContainerTransform.FADE_MODE_*`). */
export type ZoomTransitionFade = 'cross' | 'in' | 'out' | 'through'

/** The path the container travels: `arc` is `MaterialArcMotion`. */
export type ZoomTransitionPath = 'arc' | 'linear'

export type ZoomTransitionEnablerIosOptions = {
  /** A system material blurring the screen behind the zoomed one. Default none. */
  blur?: ZoomTransitionBlur
  /** Default `any`. */
  dismissGesture?: ZoomTransitionDismissGesture
}

export type ZoomTransitionEnablerAndroidOptions = {
  /** In ms. Unset, Material's container transform takes its own 450 ms. iOS's zoom is UIKit's own spring. */
  duration?: number
  /** Default `emphasized`. */
  easing?: ZoomTransitionEasing
  /** Default `cross`. */
  fade?: ZoomTransitionFade
  /** Default `arc`. */
  path?: ZoomTransitionPath
}

export type ZoomTransitionEnablerProps = {
  /** Android-only settings: Material's container transform. */
  android?: ZoomTransitionEnablerAndroidOptions
  /** iOS-only settings: UIKit's zoom. */
  ios?: ZoomTransitionEnablerIosOptions
  /** Laid over the screen behind the zoomed one. Unset: UIKit's own dimming on iOS, none on Android. */
  scrim?: ColorValue
  /** The source's identifier, handed over in the route params. Unset renders nothing: the push stays the stack's own. */
  sourceIdentifier?: string
}

/**
 * A push that grows out of the view it was opened from (a photo into its detail) and shrinks back into it. iOS 18:
 * UIKit's zoom transition (`preferredTransition = .zoom`), interactive dismissal included; below iOS 18 the push stays
 * the regular slide. Android: Material's container transform from the source to the target, both ways.
 *
 * Three pieces, tied by one identifier: `Source` around the view on the screen you push from, `Enabler` and `Target`
 * on the pushed screen. Works with any Expo Router stack screen.
 */
export type ZoomTransitionComponent = {
  /**
   * Turns the push of the screen it is rendered in into the zoom, and carries the animation settings. Render it
   * unconditionally, before any loading state: on iOS it has to exist in the screen's first commit.
   */
  Enabler: (props: ZoomTransitionEnablerProps) => ReactNode
  /** Marks the view the zoom grows from. */
  Source: (props: ZoomTransitionSourceProps) => ReactNode
  /** Marks what the source lands on in the pushed screen. It may render later than the enabler, once data arrives. */
  Target: (props: ZoomTransitionTargetProps) => ReactNode
}
