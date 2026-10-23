import ExpoModulesCore
import UIKit

/**
 Registers its single child as the frame a zoom transition lands on in the pushed screen — the enabler's
 `alignmentRectProvider` reads it. `display: contents` on the JavaScript side, like the source.
 */
public final class ZoomTransitionTargetView: ExpoView {
  private var child: UIView?

  /// Whether the source lands in a rect of its own aspect ratio centred in the target, or over the whole target.
  var isAspectRatioMatched = true

  var identifier: String = "" {
    didSet {
      guard identifier != oldValue, let child else {
        return
      }
      ZoomTransitionRegistry.shared.unregisterTarget(child, identifier: oldValue)
      ZoomTransitionRegistry.shared.registerTarget(child, identifier: identifier)
    }
  }

  public override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    guard child == nil else {
      return
    }
    child = childComponentView
    ZoomTransitionRegistry.shared.registerTarget(childComponentView, identifier: identifier)
    super.mountChildComponentView(childComponentView, index: index)
  }

  public override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    guard childComponentView === child else {
      return
    }
    ZoomTransitionRegistry.shared.unregisterTarget(childComponentView, identifier: identifier)
    child = nil
    super.unmountChildComponentView(childComponentView, index: index)
  }
}
