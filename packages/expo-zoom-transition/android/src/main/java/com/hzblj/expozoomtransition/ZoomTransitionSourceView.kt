package com.hzblj.expozoomtransition

import android.annotation.SuppressLint
import android.content.Context
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

/**
 * The view a zoom grows from, and shrinks back into. A real layout box, unlike iOS's `display: contents`. `onLayout`
 * is a no-op: `ExpoView` is a `LinearLayout`, and toggling visibility re-laid the React Native children out at 0,0.
 */
@SuppressLint("ViewConstructor")
class ZoomTransitionSourceView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  var identifier: String? = null
    set(value) {
      field?.let { ZoomTransitionRegistry.unregisterSource(it, this) }
      field = value
      if (isAttachedToWindow) {
        value?.let { ZoomTransitionRegistry.registerSource(it, this) }
      }
    }

  var cornerRadius: Float = 0f

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) = Unit

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    val id = identifier ?: return
    ZoomTransitionRegistry.registerSource(id, this)
    ZoomTransitionRegistry.consumeReverse(id)?.play(this)
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    identifier?.let { ZoomTransitionRegistry.unregisterSource(it, this) }
  }
}
