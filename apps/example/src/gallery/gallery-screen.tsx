import {useState} from 'react'
import {Platform} from 'react-native'

import {PHOTOS} from '../content/photos'
import {CodeBlock, Grid, Lead, Notice, Page, Section} from '../ui'
import {PhotoCell} from './photo-cell'
import {DEFAULT_SETTINGS, enablerCode} from './settings'
import {SettingsCard} from './settings-card'

const IOS = Platform.OS === 'ios'

/** Below iOS 18 UIKit has no zoom: the package sets nothing and every push stays the regular slide. */
const BEFORE_ZOOM = IOS && Number.parseInt(String(Platform.Version), 10) < 18

const CELL_CODE = `const zoomId =
  useZoomTransitionSourceId(photo.id)

const open = () =>
  router.push({
    params: {
      id: photo.id,
      [ZOOM_TRANSITION_PARAM]: zoomId,
    },
    pathname: '/photo/[id]',
  })

<Pressable onPress={open}>
  <ZoomTransition.Source
    android={{borderRadius: 8}}
    identifier={zoomId}
  >
    <Thumbnail photo={photo} />
  </ZoomTransition.Source>
</Pressable>`

const TARGET_CODE = `<ZoomTransition.Target
  android={{fit: 'photo', flex: 1}}
  identifier={zoomId}
>
  <FullScreenPhoto photo={photo} />
</ZoomTransition.Target>`

const ROUTE_CODE = `<Stack.Screen
  name="photo/[id]"
  options={withZoomTransition({
    headerShown: false,
    presentation: 'fullScreenModal',
  })}
/>`

/** A photo grid that zooms into a full-screen photo, the settings to try on the way, and the code that does it. */
export const GalleryScreen = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  return (
    <Page>
      <Lead>
        Tap a photo and it grows out of its cell into a full-screen page. Close it and it shrinks back into the same
        cell.
      </Lead>
      {BEFORE_ZOOM ? (
        <Notice title="Needs iOS 18">
          {`This iPhone runs iOS ${Platform.Version}. UIKit's zoom arrived in iOS 18, so here every push stays the regular slide.`}
        </Notice>
      ) : null}
      <Section
        caption={
          IOS
            ? 'Drag the photo down, swipe in from the left edge or pinch it: the page follows your finger back into its cell, and springs back if you let go early.'
            : 'Go back and the container transform plays in reverse, from the photo into the cell it came from.'
        }
        title="Recents"
      >
        <Grid
          columns={3}
          gap="s4"
          items={PHOTOS}
          keyOf={photo => photo.id}
          render={photo => <PhotoCell photo={photo} settings={settings} />}
        />
      </Section>
      <Section
        caption={
          IOS
            ? 'UIKit times the zoom with its own spring. What you set is what lies over the grid behind the photo, and which gestures may close it.'
            : 'Material’s container transform: the path the container travels, how long it takes, its easing, and how the two contents fade into each other.'
        }
        title="Try it"
      >
        <SettingsCard onChange={setSettings} settings={settings} />
      </Section>
      <Section
        caption={`The enabler renders first and unconditionally: on iOS it sets the page's transition in its first commit, and react-native-screens pushes right after.${settings.scrim === 'tinted' ? ' The scrim takes any ColorValue: tint here is kara’s accent at 20%.' : ''}`}
        title="The photo page"
      >
        <CodeBlock code={`${enablerCode(settings, IOS ? 'ios' : 'android')}\n${TARGET_CODE}`} />
      </Section>
      <Section
        caption="useZoomTransitionSourceId makes the identifier unique to the cell and the photo. It travels to the page in the route params."
        title="The cell"
      >
        <CodeBlock code={CELL_CODE} />
      </Section>
      <Section
        caption={
          IOS
            ? 'A modal’s bar lives in a nested stack the zoom does not reach, so on iOS the photo has no native header and draws its own close button. withZoomTransition changes nothing here: UIKit replaces the push.'
            : 'withZoomTransition turns a push that carries the identifier into a short fade, so the container transform reads as the transition. Options you set yourself win.'
        }
        title="The route"
      >
        <CodeBlock code={ROUTE_CODE} />
      </Section>
      {IOS ? (
        <Notice title="Patched in this example">
          In a dev client, expo-dev-menu’s three-finger gesture joins every drag, and the drag to close would not follow
          the finger (expo/expo#43338). On iOS 18 and later, a tap in the half second after a zoom closes would be lost
          (react-native-screens#4711). The example carries a Yarn patch for each.
        </Notice>
      ) : null}
    </Page>
  )
}
