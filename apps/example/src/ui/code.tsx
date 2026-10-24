import {Box, RnText} from '@hzblj/kara-ui'
import {Platform} from 'react-native'

/** Kara's typography has no monospaced face, and should not need one: the variant sets the size, this the face. */
const CODE = {fontFamily: Platform.select({android: 'monospace', default: 'Menlo'})}

/** A snippet to copy. */
export const CodeBlock = ({code}: {code: string}) => (
  <Box bg="fill.tertiary" borderRadius="medium" p="s16">
    <RnText color="content.secondary" selectable style={CODE} variant="footnote">
      {code}
    </RnText>
  </Box>
)
