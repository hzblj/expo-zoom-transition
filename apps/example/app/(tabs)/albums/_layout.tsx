import {withZoomTransition} from '@hzblj/expo-zoom-transition'
import {Stack} from 'expo-router'

import {TabStack} from '../../../src/ui'

export default function AlbumsLayout() {
  return (
    <TabStack title="Albums">
      {/* First, so the tab opens on the list. */}
      <Stack.Screen name="index" />
      {/* The album's page shows its own title over the story: the bar keeps only the way back. */}
      <Stack.Screen name="[id]" options={withZoomTransition({headerLargeTitle: false, title: ''})} />
    </TabStack>
  )
}
