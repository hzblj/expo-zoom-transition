package com.hzblj.expozoomtransition

import android.graphics.Color
import android.view.animation.Interpolator
import android.view.animation.LinearInterpolator
import androidx.core.view.animation.PathInterpolatorCompat
import com.google.android.material.transition.MaterialContainerTransform

/**
 * How the container transform plays, set by the pushed screen's `ZoomTransitionEnablerView` and read by its target
 * (the way in) and by the snapshot it leaves behind (the way back).
 */
data class ZoomTransitionOptions(
  val durationMs: Long = 450L,
  val easing: String = "emphasized",
  val fadeMode: String = "cross",
  val pathMotion: String = "arc",
  val scrimColor: Int = Color.TRANSPARENT,
) {
  val interpolator: Interpolator
    get() = when (easing) {
      "standard" -> PathInterpolatorCompat.create(0.4f, 0f, 0.2f, 1f)
      "decelerate" -> PathInterpolatorCompat.create(0f, 0f, 0f, 1f)
      "linear" -> LinearInterpolator()
      else -> PathInterpolatorCompat.create(0.2f, 0f, 0f, 1f)
    }

  val materialFadeMode: Int
    get() = when (fadeMode) {
      "in" -> MaterialContainerTransform.FADE_MODE_IN
      "out" -> MaterialContainerTransform.FADE_MODE_OUT
      "through" -> MaterialContainerTransform.FADE_MODE_THROUGH
      else -> MaterialContainerTransform.FADE_MODE_CROSS
    }
}
