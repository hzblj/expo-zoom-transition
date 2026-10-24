import {useZoomTransitionParam, ZoomTransition} from '@hzblj/expo-zoom-transition'
import {Box, Image, RnScrollView, RnText, Skeleton} from '@hzblj/kara-ui'
import {useLocalSearchParams} from 'expo-router'
import {useEffect, useState} from 'react'

import {type Album, albumAuthors, findAlbum} from '../content/albums'
import {Grid, Section} from '../ui'

/** How long an album's story takes to "arrive" the first time it opens. */
const LOADING_MS = 600

/** Albums whose story has arrived once: a second visit shows it at once, the way a cached response would. */
const loaded = new Set<string>()

const useStoryLoaded = (id: string | undefined) => {
  const [ready, setReady] = useState(() => !id || loaded.has(id))

  useEffect(() => {
    if (ready || !id) {
      return
    }

    const timer = setTimeout(() => {
      loaded.add(id)
      setReady(true)
    }, LOADING_MS)

    return () => clearTimeout(timer)
  }, [id, ready])

  return ready
}

const listOf = (names: string[]) =>
  names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`

/** Lines where the paragraphs will be, while the story loads. */
const StorySkeleton = () => (
  <Box gap="s24">
    {[0, 1, 2].map(paragraph => (
      <Box gap="s10" key={paragraph}>
        <Skeleton h={14} />
        <Skeleton h={14} />
        <Skeleton h={14} />
        <Skeleton h={14} w={paragraph === 1 ? '45%' : '70%'} />
      </Box>
    ))}
  </Box>
)

const Story = ({album}: {album: Album}) => (
  <Box entering="fade" gap="s32">
    <Box gap="s16">
      {album.story.map(paragraph => (
        <RnText key={paragraph} variant="body">
          {paragraph}
        </RnText>
      ))}
    </Box>
    <Section title="Photos">
      <Grid
        columns={2}
        gap="s8"
        items={album.photos}
        keyOf={photo => photo.id}
        render={photo => (
          <Box aspectRatio={1} bg="fill.tertiary" borderRadius="medium" overflow="hidden">
            <Image cachePolicy="memory-disk" contentFit="cover" h="100%" source={{uri: photo.uri}} w="100%" />
          </Box>
        )}
      />
    </Section>
    <RnText color="content.tertiary" variant="footnote">
      {`Photos by ${listOf(albumAuthors(album))} on Unsplash.`}
    </RnText>
  </Box>
)

/**
 * An album's page, pushed onto the tab's own stack under a native header. The enabler renders first and
 * unconditionally, before the story has loaded; the cover is the target and renders with it, from the card's cached
 * URL and with no fade, so it is there for the zoom. The page scrolls: on iOS a drag down scrolls it back to the top
 * first, and only from the top shrinks it back into its card.
 */
export const AlbumScreen = () => {
  const {id} = useLocalSearchParams<{id: string}>()
  const zoomId = useZoomTransitionParam()
  const album = findAlbum(id)
  const ready = useStoryLoaded(album?.id)

  return (
    <>
      <ZoomTransition.Enabler sourceIdentifier={zoomId} />
      <RnScrollView bg="surface.base" content={{pb: 's80'}} contentInsetAdjustmentBehavior="automatic" flex={1}>
        {album ? (
          <>
            <ZoomTransition.Target identifier={zoomId}>
              <Image
                accessibilityLabel={album.title}
                aspectRatio={16 / 10}
                cachePolicy="memory-disk"
                contentFit="cover"
                source={{uri: album.cover}}
                transition={null}
                w="100%"
              />
            </ZoomTransition.Target>
            <Box gap="s24" pt="s20" px="s20">
              <Box gap="s4">
                <RnText accessibilityRole="header" variant="headingS">
                  {album.title}
                </RnText>
                <RnText color="content.secondary" variant="subheadline">
                  {`${album.place} · ${album.dates}`}
                </RnText>
              </Box>
              {ready ? <Story album={album} /> : <StorySkeleton />}
            </Box>
          </>
        ) : (
          <Box p="s20">
            <RnText color="content.secondary" variant="body">
              This album does not exist.
            </RnText>
          </Box>
        )}
      </RnScrollView>
    </>
  )
}
