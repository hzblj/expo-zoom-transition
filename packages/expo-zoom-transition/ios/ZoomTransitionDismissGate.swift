import UIKit

/**
 Decides whether UIKit's interactive zoom dismissal (swipe down, edge swipe, pinch) may begin, the way Photos and the
 App Store behave: a downward swipe dismisses only when no scroll view under the finger can still scroll up, a
 rightward one only when no horizontal scroll view under it can still scroll back; upward and leftward swipes never
 do. It only answers and never restarts a gesture recognizer.
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

    let scrollViews = scrollViewsUnder(context.location, in: rootView)

    if abs(velocity.dx) > abs(velocity.dy) {
      return allowsHorizontal && velocity.dx > 0 && !scrollViews.contains(where: canScrollTowardsLeadingEdge)
    }

    return velocity.dy > 0 && !scrollViews.contains(where: canScrollTowardsTop)
  }

  private static func scrollViewsUnder(_ location: CGPoint, in rootView: UIView) -> [UIScrollView] {
    var scrollViews: [UIScrollView] = []
    var view = rootView.hitTest(location, with: nil)

    while let current = view, current !== rootView.superview {
      if let scrollView = current as? UIScrollView, scrollView.isScrollEnabled {
        scrollViews.append(scrollView)
      }
      view = current.superview
    }

    return scrollViews
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
