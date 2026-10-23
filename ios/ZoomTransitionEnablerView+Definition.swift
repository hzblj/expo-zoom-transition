import ExpoModulesCore

extension ZoomTransitionEnablerView {
  static func definition() -> ViewDefinition<ZoomTransitionEnablerView> {
    View(ZoomTransitionEnablerView.self) {
      // Read by `ExpoViewShadowNode`: keeps the view although `display: contents` gives it no box.
      Prop("disableForceFlatten") { (_: ZoomTransitionEnablerView, _: Bool) in }
      Prop("sourceIdentifier") { (view: ZoomTransitionEnablerView, identifier: String) in
        view.sourceIdentifier = identifier
      }
      Prop("isDismissalEnabled") { (view: ZoomTransitionEnablerView, isEnabled: Bool?) in
        view.isDismissalEnabled = isEnabled ?? true
      }
      Prop("isHorizontalDismissalEnabled") { (view: ZoomTransitionEnablerView, isEnabled: Bool?) in
        view.isHorizontalDismissalEnabled = isEnabled ?? true
      }
      Prop("dimmingColor") { (view: ZoomTransitionEnablerView, color: UIColor?) in
        view.dimmingColor = color
      }
      Prop("dimmingBlur") { (view: ZoomTransitionEnablerView, blur: String?) in
        view.dimmingBlur = blur
      }
    }
  }
}
