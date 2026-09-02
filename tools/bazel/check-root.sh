#!/usr/bin/env bash
# Run workspace-root format, spell, and CSS checks in parallel.
set -uo pipefail

status=0

pnpm run check-format &
p_format=$!
pnpm run check-spell &
p_spell=$!
pnpm run lint:style &
p_style=$!

wait "${p_format}" || status=1
wait "${p_spell}" || status=1
wait "${p_style}" || status=1

exit "${status}"
