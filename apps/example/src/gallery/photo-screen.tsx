import {useZoomTransitionParam, ZoomTransition} from '@hzblj/expo-zoom-transition'
import {Box, GlassView, Image, Pressable, RnIcon, RnText, useAppTheme} from '@hzblj/kara-ui'
import {router, useLocalSearchParams} from 'expo-router'
import {Platform} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {findPhoto} from '../content/photos'
import {enablerProps, parseSettings, type ZoomSettings} from './settings'

const IOS = Platform.OS === 'ios'

/** Room for the close button above the photo on iOS, where the modal has no native bar. */
const CHROME = 56

/** iOS draws its own close over the page: the modal has no native bar there (see the root layout). */
const CloseButton = () => {
  const {top} = useSafeAreaInsets()

  return (
    <Box left={16} position="absolute" top={top + 8}>
      <Pressable accessibilityLabel="Close" borderRadius="full" haptic onPress={() => router.back()}>
        <GlassView interactive p="s12">
          <Box pointerEvents="none">
            <RnIcon name="close" size="s20" />
          </Box>
        </GlassView>
      </Pressable>
    </Box>
  )
}

/**
 * The full-screen photo a cell zooms into, a modal over the tabs. The enabler renders first and unconditionally; the
 * target is the whole photo area with the photo contained in it: iOS lands the cell on a square in its middle (`fit:
 * 'source'`, the cell's own aspect ratio), Android on the photo itself (`fit: 'photo'`). A drag down, an edge swipe or
 * a pinch is UIKit's interactive dismissal; the close button and the system back do the same.
 */
export const PhotoScreen = () => {
  const {id, ...params} = useLocalSearchParams<Partial<Record<keyof ZoomSettings, string>> & {id: string}>()
  const zoomId = useZoomTransitionParam()
  const theme = useAppTheme()
  const {bottom, top} = useSafeAreaInsets()
  const photo = findPhoto(id)

  return (
    <>
      <ZoomTransition.Enabler sourceIdentifier={zoomId} {...enablerProps(parseSettings(params), theme)} />
      <Box bg="surface.base" flex={1}>
        {IOS ? <Box h={top + CHROME} /> : null}
        {photo ? (
          <>
            <ZoomTransition.Target android={{fit: 'photo', flex: 1}} identifier={zoomId}>
              <Box flex={1}>
                <Image
                  accessibilityLabel={photo.title}
                  cachePolicy="memory-disk"
                  contentFit="contain"
                  flex={1}
                  source={{uri: photo.uri}}
                  transition={null}
                />
              </Box>
            </ZoomTransition.Target>
            <Box gap="s4" py="s16" px="s20">
              <RnText variant="headingXs">{photo.title}</RnText>
              <RnText color="content.secondary" variant="subheadline">
                {photo.caption}
              </RnText>
              <RnText color="content.tertiary" variant="footnote">
                {`Photo by ${photo.author} on Unsplash`}
              </RnText>
            </Box>
            <Box h={bottom} />
          </>
        ) : (
          <Box center flex={1}>
            <RnText color="content.secondary" variant="body">
              This photo is not in the gallery.
            </RnText>
          </Box>
        )}
      </Box>
      {IOS ? <CloseButton /> : null}
    </>
  )
}
