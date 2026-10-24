# expo-zoom-transition

[![npm](https://img.shields.io/npm/v/@hzblj/expo-zoom-transition.svg)](https://www.npmjs.com/package/@hzblj/expo-zoom-transition)
[![license](https://img.shields.io/npm/l/@hzblj/expo-zoom-transition.svg)](./LICENSE)

A push that grows out of the view it was opened from, and shrinks back into it, for Expo Router stacks. UIKit's own zoom transition on iOS 18, with the interactive dismissal (swipe down, edge swipe and pinch), and Material's container transform on Android, both ways. Any stack screen, not only `Link`.

```sh
npx expo install @hzblj/expo-zoom-transition
```

```tsx
import {ZOOM_TRANSITION_PARAM, ZoomTransition, useZoomTransitionParam} from '@hzblj/expo-zoom-transition'

// The list: the view the zoom grows from, and a push that carries its identifier
<ZoomTransition.Source identifier={zoomId}>
  <Image source={photo.uri} />
</ZoomTransition.Source>

router.push({pathname: '/photo/[id]', params: {id: photo.id, [ZOOM_TRANSITION_PARAM]: zoomId}})

// The pushed screen: the enabler first, then what the source lands on
const zoomId = useZoomTransitionParam()

<ZoomTransition.Enabler sourceIdentifier={zoomId} />
<ZoomTransition.Target identifier={zoomId}>
  <Image source={photo.uri} />
</ZoomTransition.Target>
```

**[Documentation](./packages/expo-zoom-transition/README.md)**: the three pieces and their props, `withZoomTransition`, recycled cells and platform behavior.

## This repository

| Path | What lives there |
| --- | --- |
| `packages/expo-zoom-transition/` | `@hzblj/expo-zoom-transition`, the published package: the JavaScript API and the iOS and Android module |
| `apps/example/` | The example app: a photo grid that zooms into full-screen photos with every setting to try, albums in a recycled list that open onto long pages under a header, and the same page pushed from a button, a `Link` and a round source |

```sh
yarn                 # install
yarn prebuild        # a clean `expo prebuild` of the example
yarn ios             # run the example on iOS (dev client); `yarn android` for Android
yarn start           # Metro for the example
yarn lint            # Biome and TypeScript
yarn pack:check      # pack the package as npm gets it and type-check a consumer
yarn changeset       # describe a change for the next release
```

The zoom needs iOS 18 or later; below it the push stays the regular slide.

## License

MIT © Jan Blazej
