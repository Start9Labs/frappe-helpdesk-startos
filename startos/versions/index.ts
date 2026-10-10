import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_1_30_1_1 } from './v1.30.1_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_1_30_1_1],
})
