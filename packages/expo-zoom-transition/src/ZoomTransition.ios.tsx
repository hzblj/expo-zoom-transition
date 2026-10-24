import {requireNativeView} from 'expo'
import type {ReactElement} from 'react'
import type {ColorValue, ViewStyle} from 'react-native'

import type {
  ZoomTransitionBlur,
  ZoomTransitionComponent,
  ZoomTransitionEnablerProps,
  ZoomTransitionSourceProps,
  ZoomTransitionTargetProps,
} from './types'

/**
 * `collapsableChildren` keeps Fabric from flattening the child away; `disableForceFlatten` (read by
 * `ExpoViewShadowNode`) keeps the wrapper itself although `display: contents` gives it no layout box.
 */
type NativeWrapperProps = {
  children?: ReactElement
  collapsable?: boolean
  collapsableChildren?: boolean
  disableForceFlatten: boolean
  style: ViewStyle
}

type NativeSourceProps = NativeWrapperProps & {identifier: string}

type NativeTargetProps = NativeWrapperProps & {identifier: string; isAspectRatioMatched: boolean}

type NativeEnablerProps = NativeWrapperProps & {
  dimmingBlur?: ZoomTransitionBlur
  dimmingColor?: ColorValue
  isDismissalEnabled: boolean
  isHorizontalDismissalEnabled: boolean
  sourceIdentifier: string
}

const CONTENTS: ViewStyle = {display: 'contents'}

const NativeSource = requireNativeView<NativeSourceProps>('ExpoZoomTransition', 'ZoomTransitionSourceView')

const NativeTarget = requireNativeView<NativeTargetProps>('ExpoZoomTransition', 'ZoomTransitionTargetView')

const NativeEnabler = requireNativeView<NativeEnablerProps>('ExpoZoomTransition', 'ZoomTransitionEnablerView')

/** Registers its single child as the view the zoom grows from. Adds no layout box. */
const Source = ({children, identifier}: ZoomTransitionSourceProps) =>
  identifier ? (
    <NativeSource
      collapsable={false}
      collapsableChildren={false}
      disableForceFlatten
      identifier={identifier}
      style={CONTENTS}
    >
      {children}
    </NativeSource>
  ) : (
    children
  )

/** Registers its single child as the frame the source lands on in the pushed screen. Adds no layout box. */
const Target = ({children, identifier, ios}: ZoomTransitionTargetProps) =>
  identifier ? (
    <NativeTarget
      collapsable={false}
      collapsableChildren={false}
      disableForceFlatten
      identifier={identifier}
      isAspectRatioMatched={ios?.fit !== 'target'}
      style={CONTENTS}
    >
      {children}
    </NativeTarget>
  ) : (
    children
  )

/**
 * UIKit's zoom on the screen's own view controller; the source and target are looked up natively by identifier. It
 * must render in the screen's first commit: react-native-screens pushes right after it.
 */
const Enabler = ({ios, scrim, sourceIdentifier}: ZoomTransitionEnablerProps) => {
  if (!sourceIdentifier) {
    return null
  }

  const dismissGesture = ios?.dismissGesture ?? 'any'

  return (
    <NativeEnabler
      dimmingBlur={ios?.blur}
      dimmingColor={scrim}
      disableForceFlatten
      isDismissalEnabled={dismissGesture !== 'none'}
      isHorizontalDismissalEnabled={dismissGesture === 'any'}
      sourceIdentifier={sourceIdentifier}
      style={CONTENTS}
    />
  )
}

export const ZoomTransition: ZoomTransitionComponent = {Enabler, Source, Target}
