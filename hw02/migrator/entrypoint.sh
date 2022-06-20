cat <<EOF > .postgratorrc.json
{
  "migrationPattern": "migrations/*",
  "driver": "pg",
  "host": "$DB_HOST",
  "port": $DB_PORT,
  "database": "$DB_NAME",
  "username": "$DB_USER",
  "password": "$DB_PASS"
}
EOF

npm start