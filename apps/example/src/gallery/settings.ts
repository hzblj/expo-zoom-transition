import type {
  ZoomTransitionBlur,
  ZoomTransitionDismissGesture,
  ZoomTransitionEasing,
  ZoomTransitionEnablerProps,
  ZoomTransitionFade,
  ZoomTransitionPath,
} from '@hzblj/expo-zoom-transition'
import type {Theme} from '@hzblj/kara-ui'
import {Platform} from 'react-native'

/** What the gallery lets you change, one field per enabler prop, carried to the photo as route params (strings). */
export type ZoomSettings = {
  blur: 'none' | ZoomTransitionBlur
  dismissGesture: ZoomTransitionDismissGesture
  duration: 'default' | 'quick' | 'slow'
  easing: ZoomTransitionEasing
  fade: ZoomTransitionFade
  path: ZoomTransitionPath
  scrim: 'default' | 'tinted'
}

export const DEFAULT_SETTINGS: ZoomSettings = {
  blur: 'none',
  dismissGesture: 'any',
  duration: 'default',
  easing: 'emphasized',
  fade: 'cross',
  path: 'arc',
  scrim: 'default',
}

export type Choice<TValue extends string> = {label: string; value: TValue}

export const BLURS: Choice<ZoomSettings['blur']>[] = [
  {label: 'None', value: 'none'},
  {label: 'Ultra thin', value: 'ultraThin'},
  {label: 'Thin', value: 'thin'},
  {label: 'Regular', value: 'regular'},
  {label: 'Thick', value: 'thick'},
]

export const DISMISS_GESTURES: Choice<ZoomSettings['dismissGesture']>[] = [
  {label: 'Any gesture', value: 'any'},
  {label: 'Swipe down', value: 'vertical'},
  {label: 'Close button', value: 'none'},
]

export const DURATIONS: Choice<ZoomSettings['duration']>[] = [
  {label: '250 ms', value: 'quick'},
  {label: '450 ms', value: 'default'},
  {label: '900 ms', value: 'slow'},
]

export const EASINGS: Choice<ZoomSettings['easing']>[] = [
  {label: 'Emphasized', value: 'emphasized'},
  {label: 'Standard', value: 'standard'},
  {label: 'Decelerate', value: 'decelerate'},
  {label: 'Linear', value: 'linear'},
]

export const FADES: Choice<ZoomSettings['fade']>[] = [
  {label: 'Cross', value: 'cross'},
  {label: 'In', value: 'in'},
  {label: 'Out', value: 'out'},
  {label: 'Through', value: 'through'},
]

export const PATHS: Choice<ZoomSettings['path']>[] = [
  {label: 'Arc', value: 'arc'},
  {label: 'Straight', value: 'linear'},
]

export const SCRIMS: Choice<ZoomSettings['scrim']>[] = [
  // Unset is UIKit's own dimming on iOS, nothing on Android.
  {label: Platform.OS === 'ios' ? 'Default' : 'None', value: 'default'},
  {label: 'Accent tint', value: 'tinted'},
]

/** In ms: unset is Material's own 450. Slow is past kara's scale on purpose, to watch the transform travel. */
const DURATION_MS: Record<ZoomSettings['duration'], number | undefined> = {default: undefined, quick: 250, slow: 900}

const pick = <TValue extends string>(choices: Choice<TValue>[], value: string | undefined, fallback: TValue) =>
  choices.find(choice => choice.value === value)?.value ?? fallback

export const parseSettings = (params: Partial<Record<keyof ZoomSettings, string>>): ZoomSettings => ({
  blur: pick(BLURS, params.blur, DEFAULT_SETTINGS.blur),
  dismissGesture: pick(DISMISS_GESTURES, params.dismissGesture, DEFAULT_SETTINGS.dismissGesture),
  duration: pick(DURATIONS, params.duration, DEFAULT_SETTINGS.duration),
  easing: pick(EASINGS, params.easing, DEFAULT_SETTINGS.easing),
  fade: pick(FADES, params.fade, DEFAULT_SETTINGS.fade),
  path: pick(PATHS, params.path, DEFAULT_SETTINGS.path),
  scrim: pick(SCRIMS, params.scrim, DEFAULT_SETTINGS.scrim),
})

/** The settings as the props they stand for: the scrim at the top, the rest under `ios` and `android`. */
export const enablerProps = (
  settings: ZoomSettings,
  theme: Theme
): Omit<ZoomTransitionEnablerProps, 'sourceIdentifier'> => ({
  android: {
    duration: DURATION_MS[settings.duration],
    easing: settings.easing,
    fade: settings.fade,
    path: settings.path,
  },
  ios: {blur: settings.blur === 'none' ? undefined : settings.blur, dismissGesture: settings.dismissGesture},
  scrim: settings.scrim === 'tinted' ? theme.color('fill.accent.primary:o20') : undefined,
})

/** Past this many characters a prop breaks onto a line per field, so the snippet fits a phone's width. */
const LINE = 40

const objectProp = (name: string, fields: string[]) => {
  if (fields.length === 0) {
    return []
  }

  const line = `  ${name}={{${fields.join(', ')}}}`

  return line.length <= LINE ? [line] : [`  ${name}={{`, ...fields.map(field => `    ${field},`), '  }}']
}

/** The enabler the photo renders with these settings, the props this platform reads, keys sorted as Biome sorts them. */
export const enablerCode = (settings: ZoomSettings, platform: 'android' | 'ios') => {
  const fields =
    platform === 'ios'
      ? [
          ...(settings.blur === 'none' ? [] : [`blur: '${settings.blur}'`]),
          ...(settings.dismissGesture === 'any' ? [] : [`dismissGesture: '${settings.dismissGesture}'`]),
        ]
      : [
          ...(DURATION_MS[settings.duration] === undefined ? [] : [`duration: ${DURATION_MS[settings.duration]}`]),
          ...(settings.easing === 'emphasized' ? [] : [`easing: '${settings.easing}'`]),
          ...(settings.fade === 'cross' ? [] : [`fade: '${settings.fade}'`]),
          ...(settings.path === 'arc' ? [] : [`path: '${settings.path}'`]),
        ]

  return [
    '<ZoomTransition.Enabler',
    ...objectProp(platform, fields),
    ...(settings.scrim === 'tinted' ? ['  scrim={tint}'] : []),
    '  sourceIdentifier={zoomId}',
    '/>',
  ].join('\n')
}
