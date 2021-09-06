set -e
set -a
source .env
set +a
USER_ID=$(curl -s --request GET "https://api.twitter.com/2/users/by/username/plistinator" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq --raw-output '.data.id')

curl -s --request GET "https://api.twitter.com/2/users/${USER_ID}/tweets" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq
