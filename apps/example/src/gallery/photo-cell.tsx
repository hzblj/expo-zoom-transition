import {useZoomTransitionSourceId, ZOOM_TRANSITION_PARAM, ZoomTransition} from '@hzblj/expo-zoom-transition'
import {Box, Image, Pressable, radii} from '@hzblj/kara-ui'
import {router} from 'expo-router'

import type {Photo} from '../content/photos'
import type {ZoomSettings} from './settings'

type PhotoCellProps = {
  photo: Photo
  settings: ZoomSettings
}

/** A square thumbnail of the grid: the source the photo grows out of, and shrinks back into. */
export const PhotoCell = ({photo, settings}: PhotoCellProps) => {
  const zoomId = useZoomTransitionSourceId(photo.id)

  const open = () =>
    router.push({
      params: {...settings, id: photo.id, [ZOOM_TRANSITION_PARAM]: zoomId},
      pathname: '/photo/[id]',
    })

  return (
    <Pressable accessibilityHint="Opens the photo" accessibilityLabel={photo.title} borderRadius="small" onPress={open}>
      <ZoomTransition.Source android={{borderRadius: radii.small}} identifier={zoomId}>
        <Box aspectRatio={1} bg="fill.tertiary" borderRadius="small" overflow="hidden">
          <Image cachePolicy="memory-disk" contentFit="cover" h="100%" source={{uri: photo.uri}} w="100%" />
        </Box>
      </ZoomTransition.Source>
    </Pressable>
  )
}
