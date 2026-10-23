import {useLocalSearchParams} from 'expo-router'

/**
 * The route param that carries a source's identifier to the screen it pushes, which `withZoomTransition` looks for.
 * Push with `params: {[ZOOM_TRANSITION_PARAM]: sourceId}` and read it back with `useZoomTransitionParam`.
 */
export const ZOOM_TRANSITION_PARAM = 'zoomTransitionSourceId'

/** The source identifier this screen was pushed with, for its `ZoomTransition.Enabler` and `Target`. */
export const useZoomTransitionParam = (): string | undefined => {
  const value = useLocalSearchParams()[ZOOM_TRANSITION_PARAM]

  return (Array.isArray(value) ? value[0] : value) || undefined
}
