import type {ZoomTransitionComponent, ZoomTransitionSourceProps, ZoomTransitionTargetProps} from './types'

/**
 * Where neither UIKit's zoom nor Material's container transform exists (web): the source and target render their
 * child alone and the push stays the navigator's own. Metro picks `ZoomTransition.ios.tsx` and
 * `ZoomTransition.android.tsx` on the platforms.
 */
export const ZoomTransition: ZoomTransitionComponent = {
  Enabler: () => null,
  Source: ({children}: ZoomTransitionSourceProps) => children,
  Target: ({children}: ZoomTransitionTargetProps) => children,
}
