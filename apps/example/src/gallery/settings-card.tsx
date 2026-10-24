import {Divider, Island, LabeledContent, Menu, VStack} from '@hzblj/kara-ui'
import {Fragment} from 'react'
import {Platform} from 'react-native'

import {
  BLURS,
  type Choice,
  DISMISS_GESTURES,
  DURATIONS,
  EASINGS,
  FADES,
  PATHS,
  SCRIMS,
  type ZoomSettings,
} from './settings'

type Row<TKey extends keyof ZoomSettings> = {
  choices: Choice<ZoomSettings[TKey]>[]
  key: TKey
  label: string
}

/** The enabler props each platform reads, as rows of the card. */
const ROWS: Row<keyof ZoomSettings>[] =
  Platform.OS === 'ios'
    ? [
        {choices: SCRIMS, key: 'scrim', label: 'Dimming'},
        {choices: BLURS, key: 'blur', label: 'Blur'},
        {choices: DISMISS_GESTURES, key: 'dismissGesture', label: 'Close with'},
      ]
    : [
        {choices: SCRIMS, key: 'scrim', label: 'Scrim'},
        {choices: PATHS, key: 'path', label: 'Path'},
        {choices: DURATIONS, key: 'duration', label: 'Duration'},
        {choices: EASINGS, key: 'easing', label: 'Easing'},
        {choices: FADES, key: 'fade', label: 'Fade'},
      ]

type SettingsCardProps = {
  onChange: (settings: ZoomSettings) => void
  settings: ZoomSettings
}

/** A grouped card of settings, each a menu of the values its prop takes. */
export const SettingsCard = ({onChange, settings}: SettingsCardProps) => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" py="s4" wide>
      {ROWS.map((row, index) => (
        <Fragment key={row.key}>
          {index > 0 ? (
            <VStack px="s16" wide>
              <Divider />
            </VStack>
          ) : null}
          <LabeledContent label={row.label} px="s16">
            <Menu
              actions={row.choices.map(choice => ({
                label: choice.label,
                onPress: () => onChange({...settings, [row.key]: choice.value}),
              }))}
              label={row.choices.find(choice => choice.value === settings[row.key])?.label ?? ''}
            />
          </LabeledContent>
        </Fragment>
      ))}
    </VStack>
  </Island>
)
