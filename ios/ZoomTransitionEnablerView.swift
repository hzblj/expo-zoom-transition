import ExpoModulesCore
import UIKit

/**
 Gives the screen it is mounted in an iOS 18 zoom push: sets its view controller's `preferredTransition` to `.zoom`,
 growing from the source registered under `sourceIdentifier` and landing on the target registered under the same
 one. Below iOS 18 it sets nothing and the push stays the regular slide.

 It has to mount in the screen's first commit: react-native-screens pushes in a `dispatch_async` after the mount
 transaction, and the setup below is queued before it.

 Adapted from expo-router's `LinkZoomTransitionEnabler` (`ios/LinkPreview/LinkZoomTransition.swift`, MIT,
 650 Industries, Inc.) — see `THIRD_PARTY_NOTICES.md`. Unlike it, it works with any navigator on react-native-screens,
 gates the interactive dismissal on the scroll views under the finger, and takes a tapped context menu preview as the
 source.
 */
public final class ZoomTransitionEnablerView: ExpoView {
  var sourceIdentifier: String = "" {
    didSet {
      guard sourceIdentifier != oldValue, superview != nil else {
        return
      }
      scheduleSetup()
    }
  }

  var isDismissalEnabled: Bool = true

  var isHorizontalDismissalEnabled: Bool = true

  var dimmingColor: UIColor? {
    didSet {
      guard dimmingColor != oldValue, superview != nil else {
        return
      }
      scheduleSetup()
    }
  }

  /// `ultraThin`, `thin`, `regular` or `thick` — a system material over the screen behind; `nil` for none.
  var dimmingBlur: String? {
    didSet {
      guard dimmingBlur != oldValue, superview != nil else {
        return
      }
      scheduleSetup()
    }
  }

  public override func didMoveToSuperview() {
    super.didMoveToSuperview()
    if superview != nil {
      scheduleSetup()
    }
  }

  // The view has no view controller until it is in the hierarchy, so the setup waits for the next main-queue turn.
  private func scheduleSetup() {
    DispatchQueue.main.async { [weak self] in
      self?.setupZoomTransition()
    }
  }

  private func setupZoomTransition() {
    guard #available(iOS 18.0, *), !sourceIdentifier.isEmpty, let controller = owningViewController() else {
      return
    }

    let identifier = sourceIdentifier
    let options = UIViewController.Transition.ZoomOptions()
    options.dimmingColor = dimmingColor
    options.dimmingVisualEffect = dimmingBlur.flatMap(Self.blurEffect)

    options.alignmentRectProvider = { context in
      guard let target = ZoomTransitionRegistry.shared.target(for: identifier) else {
        return nil
      }
      let rect = target.convert(target.bounds, to: context.zoomedViewController.view)
      guard ZoomTransitionRegistry.shared.isAspectRatioMatched(for: identifier),
        let source = ZoomTransitionRegistry.shared.source(for: identifier)
      else {
        return rect
      }
      return Self.rect(rect, matchingAspectRatioOf: source.bounds.size)
    }

    options.interactiveDismissShouldBegin = { [weak self, weak controller] context in
      guard let self, self.isDismissalEnabled, let view = controller?.view else {
        return false
      }
      return ZoomTransitionDismissGate.shouldBegin(
        in: view,
        context: context,
        allowsHorizontal: self.isHorizontalDismissalEnabled
      )
    }

    controller.preferredTransition = .zoom(options: options) { context in
      ZoomTransitionRegistry.shared.transientSource(for: identifier)?.handOver(
        to: context.zoomedViewController,
        identifier: identifier
      )
      return ZoomTransitionRegistry.shared.source(for: identifier)
    }
  }

  private func owningViewController() -> UIViewController? {
    var responder: UIResponder? = self
    while let current = responder {
      if let controller = current as? UIViewController {
        return controller
      }
      responder = current.next
    }
    return nil
  }

  private static func blurEffect(_ name: String) -> UIBlurEffect? {
    switch name {
    case "ultraThin": return UIBlurEffect(style: .systemUltraThinMaterial)
    case "thin": return UIBlurEffect(style: .systemThinMaterial)
    case "regular": return UIBlurEffect(style: .systemMaterial)
    case "thick": return UIBlurEffect(style: .systemThickMaterial)
    default: return nil
    }
  }

  /// The largest rect centred in `rect` with the source's aspect ratio, so the source lands without being stretched.
  private static func rect(_ rect: CGRect, matchingAspectRatioOf size: CGSize) -> CGRect {
    guard size.width > 0, size.height > 0, rect.width > 0, rect.height > 0 else {
      return rect
    }
    let sourceRatio = size.width / size.height
    let rectRatio = rect.width / rect.height

    if abs(sourceRatio - rectRatio) < 0.001 {
      return rect
    }
    if rectRatio > sourceRatio {
      let width = rect.height * sourceRatio
      return CGRect(x: rect.midX - width / 2, y: rect.origin.y, width: width, height: rect.height)
    }
    let height = rect.width / sourceRatio
    return CGRect(x: rect.origin.x, y: rect.midY - height / 2, width: rect.width, height: height)
  }
}
