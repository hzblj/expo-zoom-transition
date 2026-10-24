import {Tabs} from '@hzblj/kara-ui/router'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen icon="photo-library" name="(gallery)" selectedIcon="photo-library-filled" title="Gallery" />
      <Tabs.Screen icon="photo-album" name="albums" selectedIcon="photo-album-filled" title="Albums" />
      <Tabs.Screen icon="layers" name="pushes" selectedIcon="layers-filled" title="Pushes" />
    </Tabs>
  )
}
