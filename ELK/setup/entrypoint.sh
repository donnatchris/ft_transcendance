#!/usr/bin/env bash

set -eu
set -o pipefail

source "${BASH_SOURCE[0]%/*}"/lib.sh


# --------------------------------------------------------
# Users declarations

declare -A users_passwords
users_passwords=(
	[logstash_internal]="${LOGSTASH_INTERNAL_PASSWORD:-}"
	[kibana_system]="${KIBANA_SYSTEM_PASSWORD:-}"
)

declare -A users_roles
users_roles=(
	[logstash_internal]='logstash_writer'
)

# --------------------------------------------------------
# Roles declarations

declare -A roles_files
roles_files=(
	[logstash_writer]='logstash_writer.json'
)

# --------------------------------------------------------


log 'Waiting for availability of Elasticsearch. This can take several minutes.'

declare -i exit_code=0
wait_for_elasticsearch || exit_code=$?

if ((exit_code)); then
	case $exit_code in
		6)
			suberr 'Could not resolve host. Is Elasticsearch running?'
			;;
		7)
			suberr 'Failed to connect to host. Is Elasticsearch healthy?'
			;;
		28)
			suberr 'Timeout connecting to host. Is Elasticsearch healthy?'
			;;
		*)
			suberr "Connection to Elasticsearch failed. Exit code: ${exit_code}"
			;;
	esac

	exit $exit_code
fi

sublog 'Elasticsearch is running'

log 'Waiting for initialization of built-in users'

wait_for_builtin_users || exit_code=$?

if ((exit_code)); then
	suberr 'Timed out waiting for condition'
	exit $exit_code
fi

sublog 'Built-in users were initialized'

for role in "${!roles_files[@]}"; do
	log "Role '$role'"

	declare body_file
	body_file="${BASH_SOURCE[0]%/*}/roles/${roles_files[$role]:-}"
	if [[ ! -f "${body_file:-}" ]]; then
		sublog "No role body found at '${body_file}', skipping"
		continue
	fi

	sublog 'Creating/updating'
	ensure_role "$role" "$(<"${body_file}")"
done

for user in "${!users_passwords[@]}"; do
	log "User '$user'"
	if [[ -z "${users_passwords[$user]:-}" ]]; then
		sublog 'No password defined, skipping'
		continue
	fi

	declare -i user_exists=0
	user_exists="$(check_user_exists "$user")"

	if ((user_exists)); then
		sublog 'User exists, setting password'
		set_user_password "$user" "${users_passwords[$user]}"
	else
		if [[ -z "${users_roles[$user]:-}" ]]; then
			suberr '  No role defined, skipping creation'
			continue
		fi

		sublog 'User does not exist, creating'
		create_user "$user" "${users_passwords[$user]}" "${users_roles[$user]}"
	fi
done

# --------------------------------------------------------
# DASHBOARD
# --------------------------------------------------------

until curl -s -u elastic:${ELASTIC_PASSWORD} http://kibana:5601/kibana/api/status \
  | grep -q '"level":"available"'; do
  echo "waiting Kibana retry ..."
  sleep 5
done


curl -X POST http://kibana:5601/kibana/api/saved_objects/_import?overwrite=true \
     -u elastic:${ELASTIC_PASSWORD} \
     -H 'kbn-xsrf: true' \
     --form file=@/var/export.ndjson


curl -X POST http://kibana:5601/kibana/api/saved_objects/_import?overwrite=true \
     -u elastic:${ELASTIC_PASSWORD} \
     -H 'kbn-xsrf: true' \
     --form file=@/var/response.ndjson

# --------------------------------------------------------
# ILM POLICY
# --------------------------------------------------------

echo "Creating/updating ILM policy"

curl -s -X PUT "http://elasticsearch:9200/_ilm/policy/logs-policy" \
  -u elastic:${ELASTIC_PASSWORD} \
  -H 'Content-Type: application/json' \
  -d '{
    "policy": {
      "phases": {
        "hot": {
          "actions": {
            "rollover": {
              "max_size": "50GB",
              "max_age": "30d"
            }
          }
        },
        "warm": {
          "min_age": "30d",
          "actions": {
            "forcemerge": { "max_num_segments": 1 }
          }
        },
        "delete": {
          "min_age": "365d",
          "actions": { "delete": {} }
        }
      }
    }
  }'

# --------------------------------------------------------
# Create index template with ILM policy
# --------------------------------------------------------

echo "Creating/updating index template"

curl -s -X PUT "http://elasticsearch:9200/_index_template/logs-template" \
  -u elastic:${ELASTIC_PASSWORD} \
  -H 'Content-Type: application/json' \
  -d '{
    "index_patterns": ["logs-*"],
    "template": {
      "settings": {
        "index.lifecycle.name": "logs-policy",
        "index.lifecycle.rollover_alias": "logs"
      }
    }
  }'

# --------------------------------------------------------
# Create initial rollover index + alias
# --------------------------------------------------------

echo "Creating initial rollover index with alias"

curl -s -X PUT "http://elasticsearch:9200/logs-000001" \
  -u elastic:${ELASTIC_PASSWORD} \
  -H 'Content-Type: application/json' \
  -d '{
    "aliases": {
      "logs": {
        "is_write_index": true
      }
    }
  }'