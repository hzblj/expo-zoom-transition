# Third-party notices

## expo-router

`ios/` is adapted from expo-router's zoom transition (`Link.AppleZoom`,
[`ios/LinkPreview/LinkZoomTransition.swift`](https://github.com/expo/expo/blob/main/packages/expo-router/ios/LinkPreview/LinkZoomTransition.swift)):
the source / target / enabler split, registering a view's single child under an identifier, setting
`preferredTransition = .zoom` from the enabler, and the aspect-ratio alignment rect
(`ZoomTransitionEnablerView.rect(_:matchingAspectRatioOf:)`). The registry, the dismissal gate, the transient
source and the Android side are this package's own.

```
The MIT License (MIT)

Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
