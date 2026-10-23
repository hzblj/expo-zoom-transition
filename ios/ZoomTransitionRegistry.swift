import UIKit

/**
 Every zoom source and target on screen, by identifier, as weak views. A source is the single child of a
 `ZoomTransitionSourceView`, a target the single child of a `ZoomTransitionTargetView`; the enabler on the pushed
 screen looks both up when UIKit asks for them, so the two screens never reference each other.

 A transient source stands in for a source that is not on screen, such as the photo of a context menu preview the
 user tapped. It wins over the registered source while it is in a window. The transient-source calls and
 `sourceIdentifier(within:)` are public for another module that hands such a photo over (`@hzblj/kara-ui`'s context
 menu does); the rest stays internal.
 */
public final class ZoomTransitionRegistry {
  public static let shared = ZoomTransitionRegistry()

  private final class WeakView {
    weak var view: UIView?

    init(_ view: UIView) {
      self.view = view
    }
  }

  private var sources: [String: WeakView] = [:]
  private var transientSources: [String: ZoomTransitionTransientSource] = [:]
  private var targets: [String: WeakView] = [:]
  private let lock = NSLock()

  func registerSource(_ view: UIView, identifier: String) {
    guard !identifier.isEmpty else {
      return
    }
    lock.lock()
    defer { lock.unlock() }
    sources[identifier] = WeakView(view)
  }

  func unregisterSource(_ view: UIView, identifier: String) {
    lock.lock()
    defer { lock.unlock() }
    if sources[identifier]?.view === view {
      sources.removeValue(forKey: identifier)
    }
  }

  func source(for identifier: String) -> UIView? {
    lock.lock()
    defer { lock.unlock() }
    if let transient = transientSources[identifier], transient.view.window != nil {
      return transient.view
    }
    return sources[identifier]?.view
  }

  public func setTransientSource(_ source: ZoomTransitionTransientSource, identifier: String) {
    lock.lock()
    let previous = transientSources[identifier]
    transientSources[identifier] = source
    lock.unlock()
    previous?.finish()
  }

  func transientSource(for identifier: String) -> ZoomTransitionTransientSource? {
    lock.lock()
    defer { lock.unlock() }
    return transientSources[identifier]
  }

  public func finishTransientSource(_ source: ZoomTransitionTransientSource, identifier: String) {
    lock.lock()
    if transientSources[identifier] === source {
      transientSources.removeValue(forKey: identifier)
    }
    lock.unlock()
    source.finish()
  }

  /// The identifier of a source inside `container`: how a context menu finds the photo its trigger zooms from.
  public func sourceIdentifier(within container: UIView) -> String? {
    lock.lock()
    defer { lock.unlock() }
    return sources.first { $0.value.view?.isDescendant(of: container) == true }?.key
  }

  func registerTarget(_ view: UIView, identifier: String) {
    guard !identifier.isEmpty else {
      return
    }
    lock.lock()
    defer { lock.unlock() }
    targets[identifier] = WeakView(view)
  }

  func unregisterTarget(_ view: UIView, identifier: String) {
    lock.lock()
    defer { lock.unlock() }
    if targets[identifier]?.view === view {
      targets.removeValue(forKey: identifier)
    }
  }

  func target(for identifier: String) -> UIView? {
    lock.lock()
    defer { lock.unlock() }
    return targets[identifier]?.view
  }

  /// Whether the target registered under `identifier` lands the source at the source's own aspect ratio.
  func isAspectRatioMatched(for identifier: String) -> Bool {
    lock.lock()
    defer { lock.unlock() }
    return (targets[identifier]?.view?.superview as? ZoomTransitionTargetView)?.isAspectRatioMatched ?? true
  }
}

/**
 A copy of a tapped context menu preview's photo, laid over the window where the preview shows it, with a frozen
 snapshot of the screen on top so the menu does not vanish while JavaScript pushes the next screen. When the push
 starts, the zoom grows from the copy and the frozen screen fades out; the copy goes once the push completes.
 */
public final class ZoomTransitionTransientSource {
  private static let coverFadeDuration: TimeInterval = 0.3

  let view: UIView
  private let cover: UIView
  private var isHandedOver = false
  private var isFinished = false

  /// `view` is laid over the window where the source shows, `cover` over the whole screen; both are already added.
  public init(view: UIView, cover: UIView) {
    self.view = view
    self.cover = cover
  }

  func handOver(to zoomedViewController: UIViewController, identifier: String) {
    guard !isHandedOver else {
      return
    }
    isHandedOver = true
    fadeOutCover()

    DispatchQueue.main.async { [self] in
      guard
        let coordinator = zoomedViewController.transitionCoordinator
          ?? zoomedViewController.navigationController?.transitionCoordinator
      else {
        ZoomTransitionRegistry.shared.finishTransientSource(self, identifier: identifier)
        return
      }
      coordinator.animate(alongsideTransition: nil) { _ in
        ZoomTransitionRegistry.shared.finishTransientSource(self, identifier: identifier)
      }
    }
  }

  func finish() {
    guard !isFinished else {
      return
    }
    isFinished = true
    view.removeFromSuperview()
    fadeOutCover()
  }

  private func fadeOutCover() {
    let cover = cover
    UIView.animate(
      withDuration: Self.coverFadeDuration,
      delay: 0,
      options: [.beginFromCurrentState, .allowUserInteraction],
      animations: {
        cover.alpha = 0
      },
      completion: { _ in
        cover.removeFromSuperview()
      }
    )
  }
}
