/**
 * Checks what npm would receive, the way a consumer meets it. Packs every published package (each `prepack` builds it
 * through turbo's cache), asserts what must and must not ship in each tarball, then installs it into a throwaway app
 * and type-checks real usage with a consumer's TypeScript: no `source` condition, no workspace links, only what the
 * tarball declares.
 *
 * The negative cases matter as much as the positive ones: if a declaration failed to resolve, its imports would
 * quietly become `any` and everything would compile, so each `@ts-expect-error` is there to prove the types are real.
 */
import {execFileSync} from 'node:child_process'
import {existsSync} from 'node:fs'
import {mkdir, readdir, readFile, rm, writeFile} from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const WORK = path.join(ROOT, '.pack-check')

const run = (command, args, cwd = ROOT) => execFileSync(command, args, {cwd, encoding: 'utf8'})

const fail = message => {
  console.error(`pack-check: ${message}`)
  process.exit(1)
}

const REQUIRED = {
  '@hzblj/expo-zoom-transition': [
    'package.json',
    'README.md',
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
    'build/index.js',
    'build/index.d.ts',
    'build/ZoomTransition.js',
    'build/ZoomTransition.d.ts',
    'build/ZoomTransition.ios.js',
    'build/ZoomTransition.android.js',
    'expo-module.config.json',
    'ios/ExpoZoomTransition.podspec',
    'ios/ExpoZoomTransitionModule.swift',
    'ios/ZoomTransitionDismissGate.swift',
    'ios/ZoomTransitionEnablerView.swift',
    'ios/ZoomTransitionEnablerView+Definition.swift',
    'ios/ZoomTransitionRegistry.swift',
    'ios/ZoomTransitionSourceView.swift',
    'ios/ZoomTransitionSourceView+Definition.swift',
    'ios/ZoomTransitionTargetView.swift',
    'ios/ZoomTransitionTargetView+Definition.swift',
    'android/build.gradle',
    'android/src/main/java/com/hzblj/expozoomtransition/ExpoZoomTransitionModule.kt',
    'android/src/main/java/com/hzblj/expozoomtransition/ZoomTransitionAnimator.kt',
    'android/src/main/java/com/hzblj/expozoomtransition/ZoomTransitionEnablerView.kt',
    'android/src/main/java/com/hzblj/expozoomtransition/ZoomTransitionFrameView.kt',
    'android/src/main/java/com/hzblj/expozoomtransition/ZoomTransitionOptions.kt',
    'android/src/main/java/com/hzblj/expozoomtransition/ZoomTransitionPhoto.kt',
    'android/src/main/java/com/hzblj/expozoomtransition/ZoomTransitionRegistry.kt',
    'android/src/main/java/com/hzblj/expozoomtransition/ZoomTransitionSnapshot.kt',
    'android/src/main/java/com/hzblj/expozoomtransition/ZoomTransitionSourceView.kt',
    'android/src/main/java/com/hzblj/expozoomtransition/ZoomTransitionTargetView.kt',
  ],
}

// The TypeScript sources and the build output of the native projects stay home.
const FORBIDDEN = [/^src\//, /^test\//, /\/build\/intermediates\//, /\.DS_Store$/]

const packages = []

for (const directory of await readdir(path.join(ROOT, 'packages'))) {
  const manifestPath = path.join(ROOT, 'packages', directory, 'package.json')

  if (!existsSync(manifestPath)) {
    continue
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

  if (!manifest.private) {
    packages.push({directory, name: manifest.name})
  }
}

await rm(WORK, {force: true, recursive: true})
await mkdir(path.join(WORK, 'tarballs'), {recursive: true})

let fileCount = 0

for (const {directory, name} of packages) {
  const tarball = path.join(WORK, 'tarballs', `${directory}.tgz`)

  run('yarn', ['pack', '--out', tarball], path.join(ROOT, 'packages', directory))

  const files = run('tar', ['-tzf', tarball])
    .split('\n')
    .filter(Boolean)
    .map(file => file.replace(/^package\//, ''))

  const missing = (REQUIRED[name] ?? ['package.json', 'README.md']).filter(file => !files.includes(file))
  const leaked = files.filter(file => FORBIDDEN.some(pattern => pattern.test(file)))

  if (missing.length > 0) {
    fail(`${name} is missing:\n  ${missing.join('\n  ')}`)
  }

  if (leaked.length > 0) {
    fail(`${name} must not ship:\n  ${leaked.join('\n  ')}`)
  }

  const packed = JSON.parse(run('tar', ['-xzOf', tarball, 'package/package.json']))

  if (JSON.stringify(packed.dependencies ?? {}).includes('workspace:')) {
    fail(`${name} still declares a workspace: range: it would not install outside this repo`)
  }

  const installed = path.join(WORK, 'node_modules', name)

  await mkdir(installed, {recursive: true})
  run('tar', ['-xzf', tarball, '-C', installed, '--strip-components', '1'])
  fileCount += files.length
}

const consumer = `import {
  useZoomTransitionParam,
  useZoomTransitionSourceId,
  withZoomTransition,
  ZOOM_TRANSITION_PARAM,
  ZoomTransition,
  type ZoomTransitionDismissGesture,
  type ZoomTransitionEnablerProps,
} from '@hzblj/expo-zoom-transition'
import {router} from 'expo-router'
import {Image, Pressable} from 'react-native'

const PHOTO = {uri: 'https://example.com/photo.jpg'}

export const Cell = ({id}: {id: string}) => {
  const zoomId = useZoomTransitionSourceId(id)

  return (
    <Pressable onPress={() => router.push({params: {id, [ZOOM_TRANSITION_PARAM]: zoomId}, pathname: '/photo/[id]'})}>
      <ZoomTransition.Source android={{borderRadius: 12}} identifier={zoomId}>
        <Image source={PHOTO} />
      </ZoomTransition.Source>
    </Pressable>
  )
}

const gesture: ZoomTransitionDismissGesture = 'vertical'

const settings: ZoomTransitionEnablerProps = {
  android: {duration: 300, easing: 'standard', fade: 'through', path: 'linear'},
  ios: {blur: 'thin', dismissGesture: gesture},
  scrim: 'rgba(0, 0, 0, 0.2)',
}

export const Detail = () => {
  const zoomId = useZoomTransitionParam()

  return (
    <>
      <ZoomTransition.Enabler sourceIdentifier={zoomId} {...settings} />
      <ZoomTransition.Target android={{borderRadius: 16, fit: 'photo', flex: 1}} identifier={zoomId} ios={{fit: 'target'}}>
        <Image source={PHOTO} />
      </ZoomTransition.Target>
    </>
  )
}

export const options = withZoomTransition({headerShown: false})
export const resolved = withZoomTransition(({route}) => ({title: String(route.params ? 'Photo' : '')}))

// @ts-expect-error: not a dismiss gesture
export const sideways: ZoomTransitionDismissGesture = 'horizontal'

// @ts-expect-error: the duration is in milliseconds
export const named: ZoomTransitionEnablerProps = {android: {duration: 'fast'}}

// @ts-expect-error: a source wraps a single view, not text
export const text = <ZoomTransition.Source identifier="a">caption</ZoomTransition.Source>

// @ts-expect-error: the corners are in dp
export const token = <ZoomTransition.Source android={{borderRadius: 'large'}} identifier="a"><Image source={PHOTO} /></ZoomTransition.Source>
`

await writeFile(path.join(WORK, 'consumer.tsx'), consumer)
await writeFile(
  path.join(WORK, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {noEmit: true, skipLibCheck: true, strict: true},
      extends: 'expo/tsconfig.base',
      include: ['consumer.tsx'],
    },
    null,
    2
  )
)

try {
  run('yarn', ['run', '-T', 'tsc', '-p', WORK])
} catch (error) {
  fail(`a consumer's type check failed:\n${error.stdout}`)
}

await rm(WORK, {force: true, recursive: true})

console.log(`pack-check: ${packages.length} package, ${fileCount} files, and a consumer type-checks`)
