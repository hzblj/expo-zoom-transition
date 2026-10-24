package com.hzblj.expozoomtransition

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.graphics.Rect
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.widget.FrameLayout

/**
 * One end of a transform that has the photo's aspect ratio: draws `content` live, shifted by the offset, inside a
 * rectangle laid over `android:id/content`. The transform draws in that view's overlay and throws
 * "android:id/content is not a valid ancestor" for an end view outside it.
 */
@SuppressLint("ViewConstructor")
class ZoomTransitionFrameView(
  context: Context,
  private val content: View,
  private val contentOffsetX: Int,
  private val contentOffsetY: Int,
) : View(context) {
  init {
    visibility = INVISIBLE
  }

  override fun onDraw(canvas: Canvas) {
    val count = canvas.save()
    canvas.translate(contentOffsetX.toFloat(), contentOffsetY.toFloat())
    content.draw(canvas)
    canvas.restoreToCount(count)
  }
}

internal fun View.windowRect(): Rect {
  val location = IntArray(2)
  getLocationInWindow(location)
  return Rect(location[0], location[1], location[0] + width, location[1] + height)
}

internal fun View.contentView(): ViewGroup? = rootView.findViewById(android.R.id.content)

internal fun ViewGroup.addAtWindowRect(view: View, windowRect: Rect) {
  val origin = windowRect()
  view.layoutParams = FrameLayout.LayoutParams(windowRect.width(), windowRect.height())
  view.translationX = (windowRect.left - origin.left).toFloat()
  view.translationY = (windowRect.top - origin.top).toFloat()
  addView(view)
}

internal fun View.onNextPreDraw(action: () -> Unit) {
  viewTreeObserver.addOnPreDrawListener(
    object : ViewTreeObserver.OnPreDrawListener {
      override fun onPreDraw(): Boolean {
        viewTreeObserver.removeOnPreDrawListener(this)
        action()
        return true
      }
    }
  )
}

internal fun fitRect(aspectRatio: Float, bounds: Rect, isCover: Boolean): Rect {
  val isWiderThanBounds = aspectRatio >= bounds.width().toFloat() / bounds.height()
  val fitsWidth = isWiderThanBounds != isCover
  val width = if (fitsWidth) bounds.width() else (bounds.height() * aspectRatio).toInt()
  val height = if (fitsWidth) (bounds.width() / aspectRatio).toInt() else bounds.height()
  val left = bounds.left + (bounds.width() - width) / 2
  val top = bounds.top + (bounds.height() - height) / 2
  return Rect(left, top, left + width, top + height)
}
