package com.hzblj.expozoomtransition

import android.view.View
import android.view.ViewGroup
import androidx.transition.Transition
import androidx.transition.TransitionListenerAdapter
import androidx.transition.TransitionManager
import com.google.android.material.shape.ShapeAppearanceModel
import com.google.android.material.transition.MaterialArcMotion
import com.google.android.material.transition.MaterialContainerTransform

/**
 * Material's container transform from one view to another over the window — the Android counterpart of iOS 18's zoom
 * push. Not Compose shared elements: `SharedTransitionLayout` animates only inside one Compose tree, and every screen
 * is its own react-native-screens fragment. Material hides both ends (alpha 0) in the frame it adds its overlay, so
 * nothing is hidden by hand before it starts.
 */
object ZoomTransitionAnimator {
  fun run(
    start: View,
    end: View,
    startCornerRadius: Float,
    endCornerRadius: Float,
    options: ZoomTransitionOptions,
    onStart: () -> Unit = {},
    onEnd: () -> Unit = {},
  ) {
    val sceneRoot = start.rootView as? ViewGroup ?: return

    val transform = MaterialContainerTransform().apply {
      startView = start
      endView = end
      addTarget(end)
      setPathMotion(if (options.pathMotion == "linear") null else MaterialArcMotion())
      scrimColor = options.scrimColor
      fadeMode = options.materialFadeMode
      startShapeAppearanceModel = ShapeAppearanceModel.builder().setAllCornerSizes(startCornerRadius).build()
      endShapeAppearanceModel = ShapeAppearanceModel.builder().setAllCornerSizes(endCornerRadius).build()
      duration = options.durationMs
      interpolator = options.interpolator
      addListener(
        object : TransitionListenerAdapter() {
          override fun onTransitionStart(transition: Transition) {
            onStart()
          }

          override fun onTransitionEnd(transition: Transition) {
            onEnd()
          }
        }
      )
    }

    TransitionManager.beginDelayedTransition(sceneRoot, transform)
  }
}
