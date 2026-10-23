package com.hzblj.expozoomtransition

import android.annotation.SuppressLint
import android.content.Context
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

/**
 * Carries the pushed screen's transform options to its target. Draws nothing and lays nothing out; it only registers
 * its options under the source's identifier, as soon as a prop is set, so they are there before the target's first
 * pre-draw starts the transform.
 */
@SuppressLint("ViewConstructor")
class ZoomTransitionEnablerView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  var sourceIdentifier: String? = null
    set(value) {
      field?.let { ZoomTransitionRegistry.unregisterEnabler(it, this) }
      field = value
      register()
    }

  var options = ZoomTransitionOptions()
    set(value) {
      field = value
      register()
    }

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) = Unit

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    register()
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    sourceIdentifier?.let { ZoomTransitionRegistry.unregisterEnabler(it, this) }
  }

  private fun register() {
    sourceIdentifier?.takeIf { it.isNotEmpty() }?.let { ZoomTransitionRegistry.registerEnabler(it, this) }
  }
}
