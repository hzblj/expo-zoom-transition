import type {ExpoConfig} from 'expo/config'

// Not "Expo Zoom Transition": the generated Xcode target would be `ExpoZoomTransition`, the Swift module of the package.
const NAME = 'Zoom Example'
const BUNDLE_ID = 'com.hzblj.expozoomtransition.example'

export default {
  android: {
    package: BUNDLE_ID,
  },
  experiments: {
    typedRoutes: true,
  },
  ios: {
    bundleIdentifier: BUNDLE_ID,
    supportsTablet: true,
  },
  name: NAME,
  orientation: 'portrait',
  plugins: [
    'expo-router',
    // The example's icons (Material Symbols): every SVG in assets/icons becomes a native asset on both platforms, and
    // its name a type in native-icons.d.ts.
    ['@hzblj/kara-ui', {icons: {source: './assets/icons'}}],
  ],
  scheme: 'zoom-transition-example',
  slug: 'expo-zoom-transition-example',
  userInterfaceStyle: 'automatic',
  version: '1.0.0',
} satisfies ExpoConfig
