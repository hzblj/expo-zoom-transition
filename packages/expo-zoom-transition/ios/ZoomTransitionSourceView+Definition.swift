import ExpoModulesCore

extension ZoomTransitionSourceView {
  static func definition() -> ViewDefinition<ZoomTransitionSourceView> {
    View(ZoomTransitionSourceView.self) {
      // Read by `ExpoViewShadowNode`: keeps the view although `display: contents` gives it no box.
      Prop("disableForceFlatten") { (_: ZoomTransitionSourceView, _: Bool) in }
      Prop("identifier") { (view: ZoomTransitionSourceView, identifier: String) in
        view.identifier = identifier
      }
    }
  }
}
