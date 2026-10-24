import ExpoModulesCore
import UIKit

/**
 Registers its single child as the view a zoom transition grows from. `display: contents` on the JavaScript side, so
 it adds no layout box; the child is what UIKit zooms.
 */
public final class ZoomTransitionSourceView: ExpoView {
  private var child: UIView?

  var identifier: String = "" {
    didSet {
      guard identifier != oldValue, let child else {
        return
      }
      ZoomTransitionRegistry.shared.unregisterSource(child, identifier: oldValue)
      ZoomTransitionRegistry.shared.registerSource(child, identifier: identifier)
    }
  }

  public override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    guard child == nil else {
      return
    }
    child = childComponentView
    ZoomTransitionRegistry.shared.registerSource(childComponentView, identifier: identifier)
    super.mountChildComponentView(childComponentView, index: index)
  }

  public override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    guard childComponentView === child else {
      return
    }
    ZoomTransitionRegistry.shared.unregisterSource(childComponentView, identifier: identifier)
    child = nil
    super.unmountChildComponentView(childComponentView, index: index)
  }
}
