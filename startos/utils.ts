// Ports chosen so all three Datum packages can be installed at once: the
// official `datum` (23334 stratum, 7152 UI), `datum-blake2b` (23336, 7153), and
// this one.
//
// 23335 and 23337 are both skipped. 23335 was observed not to be honoured as a
// preferred external port on the lab box, silently getting a random ephemeral
// one instead, with no cause ever identified; 23337 was `datum-blake2b`'s
// compatibility-capture port until that feature was removed, and reusing a
// number that appears in that package's release notes and docs under a different
// meaning is a small confusion not worth saving a port for.
//
// A clash would not fail an install. StartOS hands the later claimant a random
// port, which leaves the user with a stratum URL that silently points nowhere.
// Distinct numbers are for predictability, and a dependent should still read the
// live binding rather than assume these.
export const stratumPort = 23338
export const uiPort = 7154

export const dataDir = '/data'

// Where this container mounts the node's volume, read-only, to read its cookie.
export const knotsMountpoint = '/knots'

// DATUM's dashboard admin user is not configurable: `datum_conf.c` documents the
// admin_password option as "username 'admin'".
export const dashboardUser = 'admin'

// Password shape for the dashboard. Alphanumeric on purpose: it is typed into a
// browser's HTTP-auth prompt, and DATUM also folds it into a CSRF token, so
// punctuation buys nothing and costs transcription errors.
export const defaultPasswordSpec = { charset: 'a-z,A-Z,0-9', len: 24 } as const
