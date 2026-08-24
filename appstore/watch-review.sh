#!/bin/bash
# Poll App Store Connect for Movement 1.0's review state.
# Emits a line on the first reading, then only when the state changes.
# Every terminal state is reported — silence must not look like success.
#
# Kept in the repo (not a temp dir) so it survives a session ending.
# Run standalone any time:  bash appstore/watch-review.sh

cd "$HOME/.appstoreconnect" || exit 1
VER=96d60349-e358-41c4-950e-351413fadb1e
prev=""
fails=0

label() {
  case "$1" in
    WAITING_FOR_REVIEW)        echo "queued, waiting for a reviewer" ;;
    IN_REVIEW)                 echo "a reviewer has picked it up" ;;
    PENDING_APPLE_RELEASE)     echo "APPROVED — Apple is releasing it" ;;
    PENDING_DEVELOPER_RELEASE) echo "APPROVED — waiting on a manual release click" ;;
    READY_FOR_SALE)            echo "LIVE on the App Store" ;;
    REJECTED)                  echo "REJECTED — see Resolution Center" ;;
    METADATA_REJECTED)         echo "METADATA REJECTED — see Resolution Center" ;;
    DEVELOPER_REJECTED)        echo "withdrawn by developer" ;;
    INVALID_BINARY)            echo "INVALID BINARY — needs a new build" ;;
    *)                         echo "state changed" ;;
  esac
}

while true; do
  raw=$(node asc.js GET "/v1/appStoreVersions/$VER" 2>/dev/null || true)
  state=$(printf '%s' "$raw" | tail -n +2 | python3 -c "
import json,sys
try:
    print(json.load(sys.stdin)['data']['attributes'].get('appStoreState') or '')
except Exception:
    print('')
" 2>/dev/null || true)

  if [ -z "$state" ]; then
    fails=$((fails + 1))
    [ "$fails" -eq 6 ] && echo "$(date '+%a %H:%M') watcher: App Store Connect unreachable for ~1h"
  else
    fails=0
    if [ "$state" != "$prev" ]; then
      echo "$(date '+%a %H:%M') Movement 1.0 -> $state ($(label "$state"))"
      prev="$state"
    fi
  fi
  sleep 600
done
