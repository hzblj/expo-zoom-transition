import {useId} from 'react'

/**
 * An identifier for a `ZoomTransition.Source`, unique to this component instance and to `key`, the item it shows.
 * Keyed by the item, a recycled list cell registers under a new identifier when it shows another item, so a detail
 * opened from its previous item zooms back out plainly instead of into the wrong cell.
 */
export const useZoomTransitionSourceId = (key: string) => `${useId()}${key}`
