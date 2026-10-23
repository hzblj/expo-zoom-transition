import ExpoModulesCore

extension ZoomTransitionTargetView {
  static func definition() -> ViewDefinition<ZoomTransitionTargetView> {
    View(ZoomTransitionTargetView.self) {
      // Read by `ExpoViewShadowNode`: keeps the view although `display: contents` gives it no box.
      Prop("disableForceFlatten") { (_: ZoomTransitionTargetView, _: Bool) in }
      Prop("identifier") { (view: ZoomTransitionTargetView, identifier: String) in
        view.identifier = identifier
      }
      Prop("isAspectRatioMatched") { (view: ZoomTransitionTargetView, isMatched: Bool?) in
        view.isAspectRatioMatched = isMatched ?? true
      }
    }
  }
}
