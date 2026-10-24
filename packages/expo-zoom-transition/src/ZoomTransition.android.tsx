import {requireNativeView} from 'expo'
import {useNavigation} from 'expo-router'
import {type ReactElement, useEffect, useMemo} from 'react'
import type {ColorValue, StyleProp, ViewStyle} from 'react-native'

import {reverseZoomTransition} from './ExpoZoomTransitionModule'
import type {
  ZoomTransitionComponent,
  ZoomTransitionEasing,
  ZoomTransitionEnablerProps,
  ZoomTransitionFade,
  ZoomTransitionPath,
  ZoomTransitionSourceProps,
  ZoomTransitionTargetProps,
} from './types'

type NativeViewProps = {children?: ReactElement; collapsable: boolean; style?: StyleProp<ViewStyle>}

type NativeSourceProps = NativeViewProps & {cornerRadius: number; identifier: string}

type NativeTargetProps = NativeViewProps & {
  cornerRadius: number
  identifier: string
  isFittedToSourceAspectRatio: boolean
}

type NativeEnablerProps = NativeViewProps & {
  easing?: ZoomTransitionEasing
  fadeMode?: ZoomTransitionFade
  pathMotion?: ZoomTransitionPath
  scrimColor?: ColorValue
  sourceIdentifier: string
  transformDuration?: number
}

/** Draws nothing and takes no room; it only carries the screen's transform options. */
const ENABLER: ViewStyle = {height: 0, position: 'absolute', width: 0}

const NativeSource = requireNativeView<NativeSourceProps>('ExpoZoomTransition', 'ZoomTransitionSourceView')

const NativeTarget = requireNativeView<NativeTargetProps>('ExpoZoomTransition', 'ZoomTransitionTargetView')

const NativeEnabler = requireNativeView<NativeEnablerProps>('ExpoZoomTransition', 'ZoomTransitionEnablerView')

/** The view Material's container transform grows from, and shrinks back into. */
const Source = ({android, children, identifier}: ZoomTransitionSourceProps) =>
  identifier ? (
    <NativeSource collapsable={false} cornerRadius={android?.borderRadius ?? 0} identifier={identifier}>
      {children}
    </NativeSource>
  ) : (
    children
  )

/** The view the transform lands on in the pushed screen. Hidden until the transform reaches it. */
const Target = ({android, children, identifier}: ZoomTransitionTargetProps) => {
  const flex = android?.flex
  const style = useMemo(() => (flex === undefined ? undefined : {flex}), [flex])

  if (!identifier) {
    return children
  }

  return (
    <NativeTarget
      collapsable={false}
      cornerRadius={android?.borderRadius ?? 0}
      identifier={identifier}
      isFittedToSourceAspectRatio={android?.fit === 'photo'}
      style={style}
    >
      {children}
    </NativeTarget>
  )
}

/**
 * The target starts the way in natively once it is laid out. The way back cannot wait for the target to go: the pop is
 * native, and by the time the screen unmounts it is already sliding away. So the transform is played back from
 * `beforeRemove`, while the target is still on screen.
 */
const Enabler = ({android, scrim, sourceIdentifier}: ZoomTransitionEnablerProps) => {
  const navigation = useNavigation()

  useEffect(() => {
    if (!sourceIdentifier) {
      return
    }

    return navigation.addListener('beforeRemove', () => {
      void reverseZoomTransition(sourceIdentifier)
    })
  }, [navigation, sourceIdentifier])

  if (!sourceIdentifier) {
    return null
  }

  return (
    <NativeEnabler
      collapsable={false}
      easing={android?.easing}
      fadeMode={android?.fade}
      pathMotion={android?.path}
      scrimColor={scrim}
      sourceIdentifier={sourceIdentifier}
      style={ENABLER}
      transformDuration={android?.duration}
    />
  )
}

export const ZoomTransition: ZoomTransitionComponent = {Enabler, Source, Target}
