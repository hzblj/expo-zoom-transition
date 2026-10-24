import {Box, RnFlatList} from '@hzblj/kara-ui'

import {ALBUMS} from '../content/albums'
import {CodeBlock, Lead, Section} from '../ui'
import {AlbumCard} from './album-card'

const CODE = `const zoomId =
  useZoomTransitionSourceId(album.id)

<ZoomTransition.Source
  android={{borderRadius: 16}}
  identifier={zoomId}
>
  <Cover album={album} />
</ZoomTransition.Source>`

const Header = () => (
  <Box pb="s24">
    <Lead>
      Every album opens onto a page of its own, pushed onto this tab’s stack under its header. Scroll into one, then
      drag it down: it scrolls back to the top first, and only from there shrinks back into its card.
    </Lead>
  </Box>
)

const Footer = () => (
  <Box pt="s32">
    <Section
      caption="A FlatList: each card takes useZoomTransitionSourceId(album.id), so a cell the list recycles for another album registers under a new identifier, and a page opened from it never zooms back into the wrong card."
      title="Recycled cells"
    >
      <CodeBlock code={CODE} />
    </Section>
  </Box>
)

const Separator = () => <Box h={28} />

/** The albums, in a list long enough to recycle its cells. */
export const AlbumsScreen = () => (
  <RnFlatList
    ItemSeparatorComponent={Separator}
    ListFooterComponent={Footer}
    ListHeaderComponent={Header}
    bg="surface.base"
    content={{pb: 's80', pt: 's8', px: 's20'}}
    contentInsetAdjustmentBehavior="automatic"
    data={ALBUMS}
    flex={1}
    keyExtractor={album => album.id}
    renderItem={({item}) => <AlbumCard album={item} />}
  />
)
