#!/usr/bin/env bash
# Reproduce the benchmark locally using a throwaway PostgreSQL cluster.
# Requires a local PostgreSQL install (initdb / pg_ctl / psql on PATH).
# No existing cluster is touched; everything runs in a temp datadir on port 55433.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
PGDATA="$(mktemp -d /tmp/sqldemo_pg.XXXXXX)"
export PGPORT=55433 PGHOST=/tmp PGUSER=postgres PGDATABASE=sqldemo

cleanup() {
  pg_ctl -D "$PGDATA" stop -m fast >/dev/null 2>&1 || true
  rm -rf "$PGDATA"
}
trap cleanup EXIT

echo "==> initdb ($PGDATA)"
initdb -D "$PGDATA" -U postgres --no-locale --encoding=UTF8 >/dev/null

echo "==> start postgres on :$PGPORT"
pg_ctl -D "$PGDATA" -o "-p $PGPORT -k /tmp -c fsync=off -c synchronous_commit=off" -l "$PGDATA/server.log" start
sleep 2
createdb -p "$PGPORT" -h /tmp -U postgres sqldemo

echo "==> schema"
psql -q -f "$HERE/schema.sql"
echo "==> seed (1,000,000 rows; this takes a few seconds)"
psql -q -f "$HERE/seed.sql"

echo; echo "########## BEFORE (no index) ##########"
psql -c "SET max_parallel_workers_per_gather=0;" -f "$HERE/queries/01_before.sql"
echo; echo "########## CREATE INDEX ##########"
psql -f "$HERE/queries/02_indexes.sql"
echo; echo "########## AFTER (index) ##########"
psql -c "SET max_parallel_workers_per_gather=0;" -f "$HERE/queries/03_after.sql"

echo; echo "Done. (temp cluster is removed automatically)"
