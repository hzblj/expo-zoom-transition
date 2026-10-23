package com.hzblj.expozoomtransition

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Rect
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import java.lang.ref.WeakReference

/**
 * The way back: a bitmap of the target at its last window bounds, played back as a ghost `ImageView` transforming into
 * the source. The pop is driven natively before JavaScript hears of it, so the target is drawn while it is still on
 * screen. Drawn by hand: Fabric views are never `isLaidOut`, so `drawToBitmap` throws.
 */
class ZoomTransitionSnapshot(
  private val bitmap: Bitmap,
  private val bounds: Rect,
  private val cornerRadius: Float,
  private val photoAspectRatio: Float?,
  private val coveredView: WeakReference<View>,
  private val options: ZoomTransitionOptions,
) {
  companion object {
    fun capture(
      view: View,
      region: Rect,
      windowBounds: Rect,
      cornerRadius: Float,
      photoAspectRatio: Float?,
      options: ZoomTransitionOptions,
    ): ZoomTransitionSnapshot? {
      if (region.isEmpty || windowBounds.isEmpty) {
        return null
      }
      val bitmap = Bitmap.createBitmap(region.width(), region.height(), Bitmap.Config.ARGB_8888)
      val canvas = Canvas(bitmap)
      canvas.translate(-region.left.toFloat(), -region.top.toFloat())
      view.draw(canvas)
      return ZoomTransitionSnapshot(bitmap, windowBounds, cornerRadius, photoAspectRatio, WeakReference(view), options)
    }
  }

  fun play(source: ZoomTransitionSourceView) {
    val root = source.rootView as? ViewGroup ?: return
    val ghost = attachGhost(root)
    coveredView.get()?.visibility = View.INVISIBLE

    source.onNextPreDraw {
      if (source.width == 0) {
        root.removeView(ghost)
        return@onNextPreDraw
      }
      val aspectRatio = photoAspectRatio
      val content = source.contentView()
      if (aspectRatio == null || content == null) {
        ZoomTransitionAnimator.run(ghost, source, cornerRadius, source.cornerRadius, options, onEnd = { root.removeView(ghost) })
        return@onNextPreDraw
      }

      val sourceRect = source.windowRect()
      val frameRect = fitRect(aspectRatio, sourceRect, isCover = true)
      val frame = ZoomTransitionFrameView(
        source.context,
        source,
        sourceRect.left - frameRect.left,
        sourceRect.top - frameRect.top,
      )
      content.addAtWindowRect(frame, frameRect)
      content.onNextPreDraw {
        ZoomTransitionAnimator.run(
          ghost,
          frame,
          cornerRadius,
          source.cornerRadius,
          options,
          onStart = { source.alpha = 0f },
          onEnd = {
            source.alpha = 1f
            root.removeView(ghost)
            content.removeView(frame)
          },
        )
      }
    }
  }

  private fun attachGhost(root: ViewGroup): View {
    val ghost = ImageView(root.context).apply {
      setImageBitmap(bitmap)
      scaleType = ImageView.ScaleType.FIT_XY
      layoutParams = FrameLayout.LayoutParams(bounds.width(), bounds.height())
      translationX = bounds.left.toFloat()
      translationY = bounds.top.toFloat()
    }
    root.addView(ghost)
    return ghost
  }
}
