package com.hzblj.expozoomtransition

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.graphics.Rect
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

/**
 * The view a zoom lands on in the pushed screen. It hides itself on attach and starts the transform from the registered
 * source on its first pre-draw with a size. `isFittedToSourceAspectRatio` lands the photo where it sits inside the
 * target (a `contain` photo in the middle of a tall page) instead of on the whole target; both ends then have the
 * photo's aspect ratio, and the cropped edges fade in. `reverse` plays the way back.
 */
@SuppressLint("ViewConstructor")
class ZoomTransitionTargetView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  var identifier: String? = null
    set(value) {
      field?.let { ZoomTransitionRegistry.unregisterTarget(it, this) }
      field = value
      if (isAttachedToWindow) {
        value?.let { ZoomTransitionRegistry.registerTarget(it, this) }
      }
    }

  var cornerRadius: Float = 0f

  var isFittedToSourceAspectRatio = false

  private var hasEntered = false
  private var landingRegion: Rect? = null
  private var photoAspectRatio: Float? = null
  private val location = IntArray(2)
  private val windowBounds = Rect()

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) = Unit

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    val id = identifier ?: return
    ZoomTransitionRegistry.registerTarget(id, this)

    if (hasEntered) {
      return
    }
    hasEntered = true

    val source = ZoomTransitionRegistry.source(id)?.takeIf { it.isShown } ?: return
    if (!ZoomTransitionRegistry.beginEnter(id, this)) {
      return
    }
    visibility = INVISIBLE
    waitForLayout { enter(source, id) }
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    identifier?.let { ZoomTransitionRegistry.unregisterTarget(it, this) }
  }

  override fun dispatchDraw(canvas: Canvas) {
    super.dispatchDraw(canvas)
    getLocationInWindow(location)
    windowBounds.set(location[0], location[1], location[0] + width, location[1] + height)
  }

  fun reverse() {
    val id = identifier ?: return
    val region = landingRegion ?: Rect(0, 0, width, height)
    val bounds = Rect(region).apply { offset(windowBounds.left, windowBounds.top) }
    val options = ZoomTransitionRegistry.options(id)
    val snapshot = ZoomTransitionSnapshot.capture(this, region, bounds, cornerRadius, photoAspectRatio, options) ?: return
    val source = ZoomTransitionRegistry.source(id)

    if (source == null) {
      ZoomTransitionRegistry.requestReverse(id, snapshot)
      return
    }

    snapshot.play(source)
  }

  private fun waitForLayout(action: () -> Unit) {
    onNextPreDraw {
      if (width == 0 || height == 0) {
        waitForLayout(action)
        return@onNextPreDraw
      }
      action()
    }
  }

  private fun enter(source: ZoomTransitionSourceView, id: String) {
    val options = ZoomTransitionRegistry.options(id)
    val content = contentView()
    if (!isFittedToSourceAspectRatio || content == null || source.width == 0 || source.height == 0) {
      ZoomTransitionAnimator.run(
        source,
        this,
        source.cornerRadius,
        cornerRadius,
        options,
        onStart = { visibility = VISIBLE },
        onEnd = {
          visibility = VISIBLE
          ZoomTransitionRegistry.endEnter(id, this)
        },
      )
      return
    }

    val sourceRect = source.windowRect()
    val targetRect = windowRect()
    val aspectRatio = ZoomTransitionPhoto.aspectRatio(source, sourceRect)
      ?: (source.width.toFloat() / source.height)
    val startRect = fitRect(aspectRatio, sourceRect, isCover = true)
    val landingRect = fitRect(aspectRatio, targetRect, isCover = false)
    photoAspectRatio = aspectRatio
    landingRegion = Rect(landingRect).apply { offset(-targetRect.left, -targetRect.top) }

    val start = ZoomTransitionFrameView(
      context,
      source,
      sourceRect.left - startRect.left,
      sourceRect.top - startRect.top,
    )
    val end = ZoomTransitionFrameView(
      context,
      this,
      targetRect.left - landingRect.left,
      targetRect.top - landingRect.top,
    )
    content.addAtWindowRect(start, startRect)
    content.addAtWindowRect(end, landingRect)

    content.onNextPreDraw {
      ZoomTransitionAnimator.run(
        start,
        end,
        source.cornerRadius,
        cornerRadius,
        options,
        onStart = { source.alpha = 0f },
        onEnd = {
          source.alpha = 1f
          visibility = VISIBLE
          content.removeView(start)
          content.removeView(end)
          ZoomTransitionRegistry.endEnter(id, this)
        },
      )
    }
  }
}
