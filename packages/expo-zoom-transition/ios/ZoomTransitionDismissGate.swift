import UIKit

/**
 Decides whether UIKit's interactive zoom dismissal (swipe down, edge swipe, pinch) may begin, the way Photos and the
 App Store behave: a downward swipe dismisses only when no scroll view under the finger can still scroll up, a
 rightward one only when no horizontal scroll view under it can still scroll back and no target under it pages
 sideways under its own gesture (`isHorizontalDismissalBlocked`: a gesture-handler carousel has no scroll view to
 ask); upward and leftward swipes never do. It only answers and never restarts a gesture recognizer.
 */
@available(iOS 18.0, *)
enum ZoomTransitionDismissGate {
  private static let edgeTolerance: CGFloat = 1

  static func shouldBegin(
    in rootView: UIView,
    context: UIViewController.Transition.ZoomOptions.InteractionContext,
    allowsHorizontal: Bool
  ) -> Bool {
    let velocity = context.velocity

    if abs(velocity.dx) < edgeTolerance && abs(velocity.dy) < edgeTolerance {
      return allowsHorizontal && context.willBegin
    }

    let touchedViews = viewsUnder(context.location, in: rootView)
    let scrollViews = touchedViews.compactMap { $0 as? UIScrollView }.filter(\.isScrollEnabled)

    if abs(velocity.dx) > abs(velocity.dy) {
      return allowsHorizontal
        && velocity.dx > 0
        && !touchedViews.contains(where: blocksHorizontalDismissal)
        && !scrollViews.contains(where: canScrollTowardsLeadingEdge)
    }

    return velocity.dy > 0 && !scrollViews.contains(where: canScrollTowardsTop)
  }

  /// The hit view under the finger and every ancestor up to the root.
  private static func viewsUnder(_ location: CGPoint, in rootView: UIView) -> [UIView] {
    var views: [UIView] = []
    var view = rootView.hitTest(location, with: nil)

    while let current = view, current !== rootView.superview {
      views.append(current)
      view = current.superview
    }

    return views
  }

  private static func blocksHorizontalDismissal(_ view: UIView) -> Bool {
    (view as? ZoomTransitionTargetView)?.isHorizontalDismissalBlocked == true
  }

  private static func canScrollTowardsLeadingEdge(_ scrollView: UIScrollView) -> Bool {
    let isHorizontal = scrollView.contentSize.width > scrollView.bounds.width + edgeTolerance
    return isHorizontal && scrollView.contentOffset.x > -scrollView.adjustedContentInset.left + edgeTolerance
  }

  private static func canScrollTowardsTop(_ scrollView: UIScrollView) -> Bool {
    let isVertical = scrollView.contentSize.height > scrollView.bounds.height + edgeTolerance
    return isVertical && scrollView.contentOffset.y > -scrollView.adjustedContentInset.top + edgeTolerance
  }
}
