import {withZoomTransition} from '@hzblj/expo-zoom-transition'
import {useAppTheme} from '@hzblj/kara-ui'
import {Stack} from 'expo-router'
import {Platform} from 'react-native'

import {findPhoto} from '../src/content/photos'
import {Providers} from '../src/providers'

const RootStack = () => {
  const theme = useAppTheme()

  return (
    <Stack screenOptions={{contentStyle: {backgroundColor: theme.color('surface.base')}, headerShown: false}}>
      <Stack.Screen name="(tabs)" />
      {/*
        The photo a gallery cell grows into: a full-screen modal over the tabs, the way a gallery opens. No native
        header on iOS: a modal's bar lives in a nested stack, which the zoom does not reach, so the page draws its own
        close. Android keeps Material's bar. withZoomTransition turns an Android push that carries the identifier into
        a fade, so the container transform reads as the transition.
      */}
      <Stack.Screen
        name="photo/[id]"
        options={withZoomTransition(({route}) => ({
          headerShown: Platform.OS === 'android',
          presentation: 'fullScreenModal',
          title: findPhoto((route.params as {id?: string} | undefined)?.id)?.title ?? '',
        }))}
      />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <Providers>
      <RootStack />
    </Providers>
  )
}
