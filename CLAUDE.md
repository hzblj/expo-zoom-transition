# expo-zoom-transition

Turborepo + Yarn 4 workspaces for **`@hzblj/expo-zoom-transition`**: a push that grows out of the view it was opened
from, for Expo Router stacks, UIKit's zoom transition on iOS 18 and Material's container transform on Android, native
both ways. React Native and Expo only, no web.

Every package has its own `CLAUDE.md`: read that one before touching it.

| Path | Package | What lives there |
| --- | --- | --- |
| `packages/expo-zoom-transition/` | `@hzblj/expo-zoom-transition` | The JavaScript API (`src/`), the `ExpoZoomTransition` module (`ios/`, `android/`) and `THIRD_PARTY_NOTICES.md` (the iOS side is adapted from expo-router). |
| `apps/example/` | `expo-zoom-transition-example` (private) | Expo Router app built with `@hzblj/kara-ui`: a photo grid that zooms into a full-screen modal with every enabler setting to try, albums in a recycled `FlatList` pushed onto long pages under a header, and the same page pushed from a button, a `Link` and a round source. Runs the package from **source**. |
| `scripts/` | | `pack-check.mjs`: the tarball as npm gets it, and a consumer type-checked against it. |
| `.yarn/patches/` | | Yarn patches for expo-dev-menu (expo/expo#43338) and react-native-screens (#4711), applied through the root `resolutions`, the same ones kara's example carries. |
| `.changeset/`, `.github/workflows/` | | Release notes (`yarn changeset`), CI (Biome, typecheck, tests, pack check, the Android module compiled) and the changesets → npm release. |

`@hzblj/kara-ui` depends on this package (`@hzblj/kara-router` wraps it with kara's tokens as `ZoomTransition`, and
`@hzblj/kara-native`'s context menu hands it a tapped preview). In the example, Yarn links kara's range to the
workspace (transparent workspaces), so there is one copy of the module, the one being edited, and Metro maps kara's
imports of it to the source too. A version bump here that leaves kara's range (`^0.1.0`) puts a second, published copy
under kara: bump kara after releasing, or autolinking finds two `ExpoZoomTransition` modules. Check with
`find node_modules -path '*@hzblj/expo-zoom-transition'`: one symlink, into `packages/`.

## Commands

```bash
yarn ios / yarn android      # run the example (dev client)
yarn prebuild                # a clean `expo prebuild` of the example, after native or config changes
yarn test                    # nothing yet: the package has no tests, so turbo runs no task and passes
yarn typecheck / yarn lint   # tsc, Biome
yarn pack:check              # what npm receives, and a consumer type-check
yarn changeset               # describe a change for the next release
```

## Conventions that bite

**The example runs the package's source; the world runs `build/`.** The package's `exports` names a `source` entry,
which the example's `metro.config.js` maps and its `tsconfig.json` mirrors with `paths`, so nothing waits for a build.
Not a global `source` condition: published packages ship one too, and kara-ui's points at platform-split sources.

**The example uses the package's API directly**, plain values (dp, ms, `ColorValue`), not kara's token wrapper from
`@hzblj/kara-ui/router`: it demonstrates this library. kara is for everything else on screen.

**Motion is checked on a recording, frame by frame, both ways.** A screenshot cannot tell a zoom from a slide.
`xcrun simctl io <udid> recordVideo`, then split the frames with ffmpeg. Fast Refresh keeps mounted native views and
the enabler only acts on a screen's first commit: cold start the app before judging a change to either.

**The patches are pinned.** The root `resolutions` patch exactly `expo-dev-menu@57.0.20` and
`react-native-screens@4.26.2`. Moving either means re-creating its patch (`yarn patch`), or dropping it once upstream
has the fix.

**Publish through Yarn, tag through changesets.** `yarn release` runs `yarn npm publish` in every public workspace and
then `changeset tag`. Never `changeset publish`: its npm call would ship `workspace:` ranges verbatim.

**Docs copy has no em dashes.** Not in the READMEs, the JSDoc in `src/` (it is the API reference), changesets or the
example's captions. Rewrite with a comma, a colon, parentheses or a second sentence. Code comments are exempt.

**Commits are Jan's alone.** Author `Jan Blazej <hello@janblazej.dev>` (set locally in this repo), no co-author or
generated-by lines.

Code style is Biome-enforced (`@hzblj/biome-config`): 2 spaces, 120 cols, single quotes, no semicolons, sorted imports
and object keys. Named exports and `const` arrow functions; `type` over `interface`.
