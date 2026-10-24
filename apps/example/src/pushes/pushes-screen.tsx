import {useZoomTransitionSourceId, ZOOM_TRANSITION_PARAM, ZoomTransition} from '@hzblj/expo-zoom-transition'
import {Box, Button, Image, Island, Pressable, RnIcon, RnText, radii} from '@hzblj/kara-ui'
import {Link, router} from 'expo-router'
import {Fragment, type ReactNode} from 'react'
import {StyleSheet} from 'react-native'

import {type Album, albumById} from '../content/albums'
import {CodeBlock, Lead, Page, Section} from '../ui'

const FEATURED = albumById('coast-road')
const LINKED = [albumById('north-atlantic'), albumById('old-cars')]
const ROUND = [
  {album: albumById('fjords'), label: 'Fjords'},
  {album: albumById('granite'), label: 'Sierra'},
  {album: albumById('old-towns'), label: 'Towns'},
  {album: albumById('city-weekend'), label: 'City'},
]
const PLAIN = albumById('slow-mornings')

const THUMBNAIL = 56
const BUBBLE = 72

const BUTTON_CODE = `<Button
  label="Open the album"
  onPress={() =>
    router.push({
      params: {
        id: album.id,
        [ZOOM_TRANSITION_PARAM]: zoomId,
      },
      pathname: '/pushes/[id]',
    })
  }
/>`

const LINK_CODE = `<Link
  asChild
  href={{
    params: {
      id: album.id,
      [ZOOM_TRANSITION_PARAM]: zoomId,
    },
    pathname: '/pushes/[id]',
  }}
>
  <AlbumRow album={album} />
</Link>`

const ROUND_CODE = `<ZoomTransition.Source
  android={{borderRadius: ${BUBBLE / 2}}}
  identifier={zoomId}
>
  <Avatar size={${BUBBLE}} />
</ZoomTransition.Source>`

const PLAIN_CODE = `router.push({
  params: {id: album.id},
  pathname: '/pushes/[id]',
})`

const Thumbnail = ({album}: {album: Album}) => (
  <Box bg="fill.tertiary" borderRadius="small" h={THUMBNAIL} overflow="hidden" w={THUMBNAIL}>
    <Image cachePolicy="memory-disk" contentFit="cover" h="100%" source={{uri: album.cover}} w="100%" />
  </Box>
)

/** A list row's content: the thumbnail, the album's name and where it was. */
const RowContent = ({album, thumbnail}: {album: Album; thumbnail: ReactNode}) => (
  <>
    {thumbnail}
    <Box flex={1} gap="s2">
      <RnText variant="subheadlineMedium">{album.title}</RnText>
      <RnText color="content.secondary" variant="footnote">
        {`${album.place} · ${album.dates}`}
      </RnText>
    </Box>
    <RnIcon color="content.tertiary" name="chevron-right" size="s20" />
  </>
)

const RowDivider = () => (
  <Box px="s16">
    <Box bg="border.tertiary" h={StyleSheet.hairlineWidth} />
  </Box>
)

/** The push comes from a button under the card, not from the photo: the photo is still the source. */
const FeaturedCard = () => {
  const zoomId = useZoomTransitionSourceId(FEATURED.id)

  const open = () => router.push({params: {id: FEATURED.id, [ZOOM_TRANSITION_PARAM]: zoomId}, pathname: '/pushes/[id]'})

  return (
    <Box bg="surface.primary" borderRadius="large" gap="s16" p="s12">
      <ZoomTransition.Source android={{borderRadius: radii.medium}} identifier={zoomId}>
        <Box bg="fill.tertiary" borderRadius="medium" overflow="hidden">
          <Image
            accessibilityLabel={FEATURED.title}
            aspectRatio={4 / 3}
            cachePolicy="memory-disk"
            contentFit="cover"
            source={{uri: FEATURED.cover}}
            w="100%"
          />
        </Box>
      </ZoomTransition.Source>
      <Box gap="s4" px="s4">
        <RnText variant="headline">{FEATURED.title}</RnText>
        <RnText color="content.secondary" numberOfLines={2} variant="subheadline">
          {FEATURED.story[0] ?? ''}
        </RnText>
      </Box>
      <Island>
        <Button label="Open the album" onPress={open} />
      </Island>
    </Box>
  )
}

/** Expo Router's own `Link`: the identifier rides in its `href` like any other param. */
const LinkRow = ({album}: {album: Album}) => {
  const zoomId = useZoomTransitionSourceId(album.id)

  return (
    <Link asChild href={{params: {id: album.id, [ZOOM_TRANSITION_PARAM]: zoomId}, pathname: '/pushes/[id]'}}>
      {/* The layout sits a level down: `asChild` hands the pressable a `style` of its own, which wins over `sx`. */}
      <Pressable accessibilityLabel={album.title}>
        <Box align="center" gap="s12" px="s16" py="s12" row>
          <RowContent
            album={album}
            thumbnail={
              <ZoomTransition.Source android={{borderRadius: radii.small}} identifier={zoomId}>
                <Thumbnail album={album} />
              </ZoomTransition.Source>
            }
          />
        </Box>
      </Pressable>
    </Link>
  )
}

/** A round source: iOS reads its corners, Android takes them from `android.borderRadius`. */
const Bubble = ({album, label}: {album: Album; label: string}) => {
  const zoomId = useZoomTransitionSourceId(album.id)

  const open = () => router.push({params: {id: album.id, [ZOOM_TRANSITION_PARAM]: zoomId}, pathname: '/pushes/[id]'})

  return (
    <Pressable accessibilityLabel={album.title} align="center" borderRadius="large" flex={1} gap="s8" onPress={open}>
      <ZoomTransition.Source android={{borderRadius: BUBBLE / 2}} identifier={zoomId}>
        <Box bg="fill.tertiary" borderRadius="full" h={BUBBLE} overflow="hidden" w={BUBBLE}>
          <Image cachePolicy="memory-disk" contentFit="cover" h="100%" source={{uri: album.cover}} w="100%" />
        </Box>
      </ZoomTransition.Source>
      <RnText align="center" numberOfLines={1} variant="footnoteMedium">
        {label}
      </RnText>
    </Pressable>
  )
}

/** The same page pushed four ways, and once without the identifier, for comparison. */
export const PushesScreen = () => (
  <Page>
    <Lead>
      The zoom is not tied to a Link, or to a tap on the photo itself. Any push of a stack screen that carries the
      identifier in its params grows out of the source.
    </Lead>
    <Section
      caption="The button pushes with router.push; the photo above it is still the view the page grows out of."
      title="From a button"
    >
      <FeaturedCard />
      <CodeBlock code={BUTTON_CODE} />
    </Section>
    <Section caption="A Link’s href carries the identifier like any other param." title="From a Link">
      <Box bg="surface.primary" borderRadius="large" overflow="hidden">
        {LINKED.map((album, index) => (
          <Fragment key={album.id}>
            {index > 0 ? <RowDivider /> : null}
            <LinkRow album={album} />
          </Fragment>
        ))}
      </Box>
      <CodeBlock code={LINK_CODE} />
    </Section>
    <Section
      caption="iOS reads the corners of the source view itself. Android starts the transform from android.borderRadius, in dp: half the size is a circle."
      title="Any shape"
    >
      <Box bg="surface.primary" borderRadius="large" px="s8" py="s16" row>
        {ROUND.map(({album, label}) => (
          <Bubble album={album} key={album.id} label={label} />
        ))}
      </Box>
      <CodeBlock code={ROUND_CODE} />
    </Section>
    <Section
      caption="No identifier, no zoom: the enabler renders nothing and the push stays the stack’s own slide. A Source or a Target without one renders its child alone."
      title="Without the zoom"
    >
      <Box bg="surface.primary" borderRadius="large" overflow="hidden">
        <Pressable
          accessibilityLabel={PLAIN.title}
          align="center"
          gap="s12"
          onPress={() => router.push({params: {id: PLAIN.id}, pathname: '/pushes/[id]'})}
          px="s16"
          py="s12"
          row
        >
          <RowContent album={PLAIN} thumbnail={<Thumbnail album={PLAIN} />} />
        </Pressable>
      </Box>
      <CodeBlock code={PLAIN_CODE} />
    </Section>
  </Page>
)
