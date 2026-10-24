package com.hzblj.expozoomtransition

import android.view.View
import java.lang.ref.WeakReference

/**
 * Sources and targets by identifier, as weak references. Several targets can share an identifier (an overlay and the
 * list item under it): only the first to attach while its source is shown runs the transform (`beginEnter`), and the
 * way back snapshots the most recently registered one still on screen. A reverse whose source is detached (the screen
 * below, which react-native-screens detaches) waits here until that source attaches again.
 */
object ZoomTransitionRegistry {
  private val sources = mutableMapOf<String, WeakReference<ZoomTransitionSourceView>>()
  private val targets = mutableMapOf<String, MutableList<WeakReference<View>>>()
  private val enablers = mutableMapOf<String, WeakReference<ZoomTransitionEnablerView>>()
  private val enteringTargets = mutableMapOf<String, WeakReference<View>>()
  private val pendingReverses = mutableMapOf<String, ZoomTransitionSnapshot>()

  fun registerSource(identifier: String, view: ZoomTransitionSourceView) {
    sources[identifier] = WeakReference(view)
  }

  fun unregisterSource(identifier: String, view: ZoomTransitionSourceView) {
    if (sources[identifier]?.get() === view) {
      sources.remove(identifier)
    }
  }

  fun registerTarget(identifier: String, view: View) {
    val views = targets.getOrPut(identifier) { mutableListOf() }
    views.removeAll { it.get() == null || it.get() === view }
    views.add(WeakReference(view))
  }

  fun unregisterTarget(identifier: String, view: View) {
    val views = targets[identifier] ?: return
    views.removeAll { it.get() == null || it.get() === view }
    if (views.isEmpty()) {
      targets.remove(identifier)
    }
    endEnter(identifier, view)
  }

  fun source(identifier: String): ZoomTransitionSourceView? =
    sources[identifier]?.get()?.takeIf { it.isAttachedToWindow }

  fun target(identifier: String): View? {
    val attached = targets[identifier]?.mapNotNull { it.get() }?.filter { it.isAttachedToWindow } ?: return null
    return attached.lastOrNull { it.isShown } ?: attached.lastOrNull()
  }

  fun registerEnabler(identifier: String, view: ZoomTransitionEnablerView) {
    enablers[identifier] = WeakReference(view)
  }

  fun unregisterEnabler(identifier: String, view: ZoomTransitionEnablerView) {
    if (enablers[identifier]?.get() === view) {
      enablers.remove(identifier)
    }
  }

  /** The options of the screen that zooms from `identifier`, or the defaults when it set none. */
  fun options(identifier: String): ZoomTransitionOptions = enablers[identifier]?.get()?.options ?: ZoomTransitionOptions()

  fun beginEnter(identifier: String, view: View): Boolean {
    if (enteringTargets[identifier]?.get()?.isAttachedToWindow == true) {
      return false
    }
    enteringTargets[identifier] = WeakReference(view)
    return true
  }

  fun endEnter(identifier: String, view: View) {
    if (enteringTargets[identifier]?.get() === view) {
      enteringTargets.remove(identifier)
    }
  }

  fun requestReverse(identifier: String, snapshot: ZoomTransitionSnapshot) {
    pendingReverses.clear()
    pendingReverses[identifier] = snapshot
  }

  fun consumeReverse(identifier: String): ZoomTransitionSnapshot? = pendingReverses.remove(identifier)
}
