# @hzblj/expo-zoom-transition

[![npm](https://img.shields.io/npm/v/@hzblj/expo-zoom-transition.svg)](https://www.npmjs.com/package/@hzblj/expo-zoom-transition)
[![license](https://img.shields.io/npm/l/@hzblj/expo-zoom-transition.svg)](https://github.com/hzblj/expo-zoom-transition/blob/main/LICENSE)

A push that grows out of the view it was opened from, and shrinks back into it, for Expo Router stacks. A photo opens into its detail the way it does in Photos and the App Store.

- iOS 18: UIKit's own zoom transition (`preferredTransition = .zoom`), with the interactive dismissal: swipe down, edge swipe and pinch
- Android: Material's container transform from the source to the target, both ways
- The dismissal waits for scroll views: a downward swipe dismisses only once the content under the finger is scrolled to the top
- Works with any Expo Router stack screen, not only `Link`
- Below iOS 18 the push stays the regular slide

## Install

```sh
npx expo install @hzblj/expo-zoom-transition
```

Requires Expo SDK 57 or newer, Expo Router with its native stack, and a [development build](https://docs.expo.dev/develop/development-builds/introduction/). Expo Go doesn't include this native module.

## Usage

Three pieces, tied by one identifier: `Source` around the view on the screen you push from, `Enabler` and `Target` on the pushed screen. The identifier travels in the route params.

```tsx
// app/index.tsx: the list
import {ZOOM_TRANSITION_PARAM, ZoomTransition, useZoomTransitionSourceId} from '@hzblj/expo-zoom-transition'

const PhotoCell = ({photo}) => {
  const router = useRouter()
  const zoomId = useZoomTransitionSourceId(photo.id)

  return (
    <Pressable onPress={() => router.push({pathname: '/photo/[id]', params: {id: photo.id, [ZOOM_TRANSITION_PARAM]: zoomId}})}>
      <ZoomTransition.Source identifier={zoomId} android={{borderRadius: 12}}>
        <Image source={photo.uri} style={styles.thumbnail} />
      </ZoomTransition.Source>
    </Pressable>
  )
}
```

```tsx
// app/photo/[id].tsx: the pushed screen
import {ZoomTransition, useZoomTransitionParam} from '@hzblj/expo-zoom-transition'

export default function PhotoScreen() {
  const zoomId = useZoomTransitionParam()

  return (
    <>
      <ZoomTransition.Enabler sourceIdentifier={zoomId} ios={{dismissGesture: 'vertical'}} />
      <ZoomTransition.Target identifier={zoomId} android={{flex: 1}}>
        <Image source={photo.uri} style={styles.photo} />
      </ZoomTransition.Target>
    </>
  )
}
```

```tsx
// app/_layout.tsx
import {withZoomTransition} from '@hzblj/expo-zoom-transition'

<Stack.Screen name="photo/[id]" options={withZoomTransition({headerShown: false})} />
```

- **Render the enabler first and unconditionally**, before any loading state. On iOS it sets the screen's transition from its first mount, and react-native-screens pushes right after that commit. Rendered later, the push is already a slide. The target may come later, once data arrives.
- **`withZoomTransition`** only changes Android: a push carrying the param becomes a short fade, so the container transform reads as the transition instead of racing the stack's slide. Your options win. iOS needs nothing, since UIKit replaces the push animation.
- **`useZoomTransitionSourceId(key)`** makes an identifier unique to the component and the item. A recycled list cell then registers under a new identifier when it shows another item, so a detail opened from its old item zooms back out plainly instead of into the wrong cell.

Top-level props work on both platforms. What only one platform can do is under `ios` or `android` and is ignored on the other.

### `ZoomTransition.Source`

| Prop | Default | Meaning |
| --- | --- | --- |
| `identifier` | None | Unset renders the child alone: no zoom from here |
| `children` | Required | A single view: the photo or card the zoom grows from |
| `android.borderRadius` | `0` | The corners the transform starts with, in dp. iOS reads the view's own |

### `ZoomTransition.Target`

| Prop | Default | Meaning |
| --- | --- | --- |
| `identifier` | None | The source's identifier from the route params. Unset renders the child alone |
| `children` | Required | A single view: what the source lands on |
| `ios.fit` | `source` | `source`: a rect of the source's aspect ratio centred in the target, nothing stretched. `target`: the whole target |
| `android.fit` | `target` | `target`: the whole target. `photo`: the photo inside it, where a `contain` photo sits in a tall page |
| `android.borderRadius` | `0` | The corners the transform ends with, in dp |
| `android.flex` | None | The Android target is a real layout box (iOS adds none): give it `flex` when its child fills the parent |

### `ZoomTransition.Enabler`

| Prop | Default | Meaning |
| --- | --- | --- |
| `sourceIdentifier` | None | The source's identifier from the route params. Unset renders nothing and the push stays the stack's own |
| `scrim` | Platform | A colour laid over the screen behind. Unset: UIKit's own dimming on iOS, none on Android |
| `ios.dismissGesture` | `any` | `any`: swipe down, edge swipe and pinch. `vertical`: a downward swipe only, for content that pages sideways. `none`: the back button only |
| `ios.blur` | None | A system material over the screen behind: `ultraThin`, `thin`, `regular` or `thick` |
| `android.duration` | `450` | The transform's duration in ms |
| `android.easing` | `emphasized` | `emphasized`, `standard`, `decelerate` or `linear` |
| `android.fade` | `cross` | How the two contents fade into each other: `cross`, `in`, `out` or `through` |
| `android.path` | `arc` | The path the container travels: `arc` or `linear` |

## Platform behavior

- iOS: the source and target register their single child natively by identifier, and the enabler hands them to UIKit when it asks, so neither screen references the other. They add no layout box (`display: contents`).
- iOS: zooming into a modal (`presentation: 'fullScreenModal'`, the way a gallery opens), give it no native header. A modal's bar lives in a nested stack, which the zoom doesn't reach. Draw a close button of your own; a drag down closes it too.
- iOS: the interactive dismissal behaves like Photos: down only when no scroll view under the finger can still scroll up, right only when no horizontal one can still scroll back, never up or left.
- Android: the pop is native and starts before JavaScript hears of it, so the way back is played from the navigator's `beforeRemove` while the target is still on screen. The target is hidden until the transform reaches it.
- On iOS 18 and later a zoom pop finishes about 0.5 s after the duration UIKit declares, and react-native-screens reports the dismissal only then, so a tap on the screen below is swallowed meanwhile ([react-native-screens#4711](https://github.com/software-mansion/react-native-screens/issues/4711)).
- In a dev client, `expo-dev-menu`'s three-finger gesture joins every drag and the interactive dismissal pops without following the finger ([expo/expo#43338](https://github.com/expo/expo/issues/43338)). Release builds don't have it.

The iOS side is adapted from expo-router's `Link.AppleZoom` (MIT); see `THIRD_PARTY_NOTICES.md`.

## Example

The [example app](https://github.com/hzblj/expo-zoom-transition/tree/main/apps/example) opens a photo grid into full-screen photos with every setting to try, albums from a recycled list onto long pages under a header, and the same page pushed from a button, a `Link` and a round source. It carries a Yarn patch for each of the two app-side issues above, which an app can copy. Clone the repository and run it:

```sh
yarn && yarn prebuild && yarn ios
```

## License

MIT © Jan Blazej
