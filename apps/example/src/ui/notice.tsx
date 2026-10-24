import {type IconName, Island, Label, Text, VStack} from '@hzblj/kara-ui'

type NoticeProps = {
  children: string
  icon?: IconName
  title: string
}

/** Something about this device or build that changes what the page shows. */
export const Notice = ({children, icon = 'info', title}: NoticeProps) => (
  <Island>
    <VStack align="start" bg="fill.accent.base" borderRadius="large" p="s16" spacing="s8" wide>
      <Label color="content.accent" icon={icon} title={title} variant="headline" />
      <Text color="content.secondary" variant="subheadline">
        {children}
      </Text>
    </VStack>
  </Island>
)
