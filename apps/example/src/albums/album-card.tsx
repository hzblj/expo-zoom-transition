import {useZoomTransitionSourceId, ZOOM_TRANSITION_PARAM, ZoomTransition} from '@hzblj/expo-zoom-transition'
import {Box, Image, Pressable, RnText, radii} from '@hzblj/kara-ui'
import {router} from 'expo-router'

import type {Album} from '../content/albums'

/** An album in the list: its cover is the source the album's page grows out of. */
export const AlbumCard = ({album}: {album: Album}) => {
  // Keyed by the album: a cell the list recycles for another album registers under a new identifier.
  const zoomId = useZoomTransitionSourceId(album.id)

  const open = () => router.push({params: {id: album.id, [ZOOM_TRANSITION_PARAM]: zoomId}, pathname: '/albums/[id]'})

  return (
    <Pressable accessibilityHint="Opens the album" accessibilityLabel={album.title} gap="s12" onPress={open}>
      <ZoomTransition.Source android={{borderRadius: radii.large}} identifier={zoomId}>
        <Box bg="fill.tertiary" borderRadius="large" overflow="hidden">
          <Image
            aspectRatio={16 / 10}
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{uri: album.cover}}
            w="100%"
          />
        </Box>
      </ZoomTransition.Source>
      <Box gap="s2" px="s4">
        <RnText variant="headline">{album.title}</RnText>
        <RnText color="content.secondary" variant="subheadline">
          {`${album.place} · ${album.dates}`}
        </RnText>
      </Box>
    </Pressable>
  )
}
