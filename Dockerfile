# DATUM Gateway, built from OCEAN upstream master plus our own commits.
#
# The same repository as the BLAKE2b sibling, and a different line on it. The
# BLAKE2b package builds from the Convoy-based branch, because only Convoy's fork
# can talk to the pool that serves that chain. This one builds from the
# `ocean-sha256-2` branch: OCEAN v0.5.1beta (85a19fd, 2026-10-19) merged over
# OCEAN master 9e80dac (2026-10-17) and four commits:
#
# - b46d74c: a miner can ask for a minimum difficulty, through mining.configure
#   or, when stratum.password_difficulty is on, d=N in the password. This is our
#   OCEAN #234 as reviewed: a request only raises difficulty, rounds up to a
#   power of two and never lands below vardiff_min. There is no fd= any more.
# - fe82d01: gateway-local share counts, so the dashboard shows miner work when
#   solo, and the Umbrel widget's share stat uses them when no pool is set.
# - df51d73, 0c51cc6: why each local share was rejected, on the dashboard and
#   the clients page.
#
# The previous pin (ad57651) was OCEAN master as of 2026-08-05 under the BLAKE2b
# header-v2 mining commits from justinfilip and Jason Sopko. None of those do
# anything against a SHA256 node: they only engage when the template asks for
# BLAKE2b. They were here because the local share stats and the reject reasons
# were written on top of them. Both are ported onto OCEAN master on their own,
# and the BLAKE2b code, the macOS build and the old password difficulty are
# dropped. So is `mining.pow_algorithm`: OCEAN has no such option, and SHA256d is
# the only thing it mines.
#
# The dupe table index fix that ad57651 carried is upstream now, as OCEAN #237.
#
# Pinned by commit, not by branch. A branch name is a moving target and this is
# the one input that decides whether the work we hand an ASIC matches consensus.
FROM debian:bookworm-slim AS build

ARG DATUM_REPO=https://github.com/paulscode/datum_gateway.git
ARG DATUM_REF=463f8c3bef67467e646ea78c8928384e15518110

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential cmake pkgconf git ca-certificates \
        libcurl4-openssl-dev libjansson-dev libsodium-dev libmicrohttpd-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
RUN git init -q \
 && git remote add origin "$DATUM_REPO" \
 && git fetch -q --depth 1 origin "$DATUM_REF" \
 && git checkout -q FETCH_HEAD \
 && git rev-parse HEAD > /src/PINNED_COMMIT

# -DDATUM_API_FOR_UMBREL compiles in `/umbrel-api`, a small unauthenticated JSON
# endpoint returning connected clients and estimated hashrate in the shape
# umbrelOS wants for a home-screen widget. Upstream gates it behind that flag and
# sets it in its own Umbrel CI build.
#
# Set unconditionally here, because one image serves both platforms and a
# StartOS-only build with the flag missing is how the widget silently 404s. It
# adds no exposure: those two figures are already on the status page, which needs
# no password, and are what this package's own health checks scrape from it.
#
# Found by asking the running gateway rather than by reading the source. The
# source at our pin has the route, so grepping for it says yes; the string is not
# even in the binary, because gcc inlines a short strcmp against a constant, so
# grepping the binary says no for the wrong reason. `curl /umbrel-api` on a
# running container answered 404, which is the only test that settles it.
RUN cmake -B build -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_C_FLAGS=-DDATUM_API_FOR_UMBREL \
 && cmake --build build -j"$(nproc)" \
 && ./build/datum_gateway --test \
 && strip build/datum_gateway

# ----------------------------------------------------------------------
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        libcurl4 libjansson4 libsodium23 libmicrohttpd12 wget python3 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -r -m -d /data -u 1000 datum

COPY --from=build /src/build/datum_gateway /usr/local/bin/datum_gateway
COPY --from=build /src/PINNED_COMMIT /etc/datum-pinned-commit
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Three Python scripts used to be installed here: a recording proxy for an opt-in
# compatibility-test port, a summariser that turned a capture into a report, and a
# one-page web front end for it. All removed in 1.0.0:43, along with the
# `/etc/datum-tooling-id` fingerprint that existed so a report could identify the
# build it came from.
#
# python3 stays, and the comment that used to say it was here only for those
# scripts was wrong even then: entrypoint.sh uses it to merge DATUM_SETTINGS over
# the generated config, one level deep with a reserved-key check, which is more
# than this should be doing in shell.

VOLUME /data
EXPOSE 23334 7152

USER datum
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
# The Umbrel app overrides both of these and runs datum_gateway directly against
# a persistent config file, which is what the official Umbrel Datum app does. See
# that app's docker-compose.yml.
