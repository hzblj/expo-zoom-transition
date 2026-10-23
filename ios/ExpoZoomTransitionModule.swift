import ExpoModulesCore

public class ExpoZoomTransitionModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoZoomTransition")

    ZoomTransitionSourceView.definition()
    ZoomTransitionTargetView.definition()
    ZoomTransitionEnablerView.definition()
  }
}
