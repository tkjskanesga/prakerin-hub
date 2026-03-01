#!/bin/sh
mkdir -p /var/lib/postgresql/certs

cp /mnt/certs_root/server.key /var/lib/postgresql/certs/server.key
cp /mnt/certs_root/server.crt /var/lib/postgresql/certs/server.crt
cp /mnt/certs_root/ca.crt /var/lib/postgresql/certs/ca.crt

chown postgres:postgres /var/lib/postgresql/certs/server.key
chmod 600 /var/lib/postgresql/certs/server.key

exec docker-entrypoint.sh postgres \
  -c ssl=on \
  -c ssl_cert_file=/var/lib/postgresql/certs/server.crt \
  -c ssl_key_file=/var/lib/postgresql/certs/server.key \
  -c ssl_ca_file=/var/lib/postgresql/certs/ca.crt