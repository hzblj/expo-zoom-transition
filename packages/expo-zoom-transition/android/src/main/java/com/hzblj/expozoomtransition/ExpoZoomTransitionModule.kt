package com.hzblj.expozoomtransition

import android.graphics.Color
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoZoomTransitionModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoZoomTransition")

    View(ZoomTransitionSourceView::class) {
      Prop("identifier") { view: ZoomTransitionSourceView, identifier: String? ->
        view.identifier = identifier
      }
      Prop("cornerRadius") { view: ZoomTransitionSourceView, radius: Float ->
        view.cornerRadius = radius * view.resources.displayMetrics.density
      }
    }

    View(ZoomTransitionTargetView::class) {
      Prop("identifier") { view: ZoomTransitionTargetView, identifier: String? ->
        view.identifier = identifier
      }
      Prop("cornerRadius") { view: ZoomTransitionTargetView, radius: Float ->
        view.cornerRadius = radius * view.resources.displayMetrics.density
      }
      Prop("isFittedToSourceAspectRatio") { view: ZoomTransitionTargetView, isFitted: Boolean ->
        view.isFittedToSourceAspectRatio = isFitted
      }
    }

    View(ZoomTransitionEnablerView::class) {
      Prop("sourceIdentifier") { view: ZoomTransitionEnablerView, identifier: String? ->
        view.sourceIdentifier = identifier
      }
      Prop("transformDuration") { view: ZoomTransitionEnablerView, duration: Int? ->
        view.options = view.options.copy(durationMs = (duration ?: 450).toLong())
      }
      Prop("easing") { view: ZoomTransitionEnablerView, easing: String? ->
        view.options = view.options.copy(easing = easing ?: "emphasized")
      }
      Prop("fadeMode") { view: ZoomTransitionEnablerView, fadeMode: String? ->
        view.options = view.options.copy(fadeMode = fadeMode ?: "cross")
      }
      Prop("pathMotion") { view: ZoomTransitionEnablerView, pathMotion: String? ->
        view.options = view.options.copy(pathMotion = pathMotion ?: "arc")
      }
      Prop("scrimColor") { view: ZoomTransitionEnablerView, color: Color? ->
        view.options = view.options.copy(scrimColor = color?.toArgb() ?: Color.TRANSPARENT)
      }
    }

    // The pop is native and starts before JavaScript hears of it, so the way back is started from `beforeRemove`.
    AsyncFunction("reverseZoomTransition") { identifier: String ->
      (ZoomTransitionRegistry.target(identifier) as? ZoomTransitionTargetView)?.reverse()
    }.runOnQueue(Queues.MAIN)
  }
}
