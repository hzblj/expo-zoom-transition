import {type NativeModule, requireOptionalNativeModule} from 'expo'

declare class ExpoZoomTransitionNativeModule extends NativeModule {
  reverseZoomTransition?(identifier: string): Promise<void>
}

const ExpoZoomTransition = requireOptionalNativeModule<ExpoZoomTransitionNativeModule>('ExpoZoomTransition')

/**
 * Android: plays the transform back from the target into its source. Called when the screen starts to leave
 * (`beforeRemove`): the pop is native and starts before JavaScript hears of it, so the target is snapshotted while it
 * is still on screen. A no-op in a build without the module and on iOS, where UIKit plays the way back itself.
 */
export const reverseZoomTransition = async (identifier: string): Promise<void> => {
  await ExpoZoomTransition?.reverseZoomTransition?.(identifier)
}
