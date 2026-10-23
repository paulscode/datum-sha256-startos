import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'

// One node. This package is new, so there is nothing to migrate from and no
// earlier version anyone can be coming from.
//
// It shares its code with `datum-blake2b`, whose graph carries migrations
// (`v1_0_0_36`, `v1_0_0_38`, `v1_0_0_43`) for changes it went through. Those
// describe that package's history against a store this one has never had, so
// they are not carried over: a migration that has nothing to migrate is not harmless, it
// is a claim about the past that is false here.
export const versionGraph = VersionGraph.of({
  current,
  other: [],
})
