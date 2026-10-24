import {Box, RnText} from '@hzblj/kara-ui'

/** A snippet to copy. */
export const CodeBlock = ({code}: {code: string}) => (
  <Box bg="fill.tertiary" borderRadius="medium" p="s16">
    <RnText color="content.secondary" monospaced selectable variant="footnote">
      {code}
    </RnText>
  </Box>
)
