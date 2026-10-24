package com.hzblj.expozoomtransition

import android.graphics.Rect
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView

/**
 * The aspect ratio of the photo a source shows: the drawable of its most visible `ImageView`. A source that crops its
 * photo (`contentFit="cover"`) has another aspect ratio than the photo itself.
 */
object ZoomTransitionPhoto {
  fun aspectRatio(view: View, frame: Rect): Float? {
    var bestArea = 0
    var best: Float? = null
    val visible = Rect()

    fun visit(child: View) {
      if (child.visibility != View.VISIBLE || child.alpha == 0f) {
        return
      }
      val drawable = (child as? ImageView)?.drawable
      if (drawable != null && drawable.intrinsicWidth > 0 && drawable.intrinsicHeight > 0 &&
        child.getGlobalVisibleRect(visible) && visible.intersect(frame)
      ) {
        val area = visible.width() * visible.height()
        if (area > bestArea) {
          bestArea = area
          best = drawable.intrinsicWidth.toFloat() / drawable.intrinsicHeight
        }
      }
      if (child is ViewGroup) {
        for (index in 0 until child.childCount) {
          visit(child.getChildAt(index))
        }
      }
    }

    visit(view)
    return best
  }
}
