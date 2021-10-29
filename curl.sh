#!/bin/bash
set -e

if [ ! -f .env ]; then
    echo "Could  not find an .env file with your Twitter developer BEARER_TOKEN - See README"
    exit 1
fi

set -a
source .env
set +a

if [ -z $BEARER_TOKEN ]; then
    echo "Set Twitter developer BEARER_TOKEN var in .env file - See README"
    exit 1
fi

# curl -s --request GET "https://api.twitter.com/2/users/by/username/plistinator" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq

USER_ID=$(curl -s --request GET "https://api.twitter.com/2/users/by/username/plistinator" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq --raw-output '.data.id')

curl -s --request GET "https://api.twitter.com/2/users/${USER_ID}?user.fields=profile_image_url,public_metrics,verified"  --header "Authorization: Bearer ${BEARER_TOKEN}" --header "Accept: application/json" | jq

# curl -s --request GET "https://api.twitter.com/2/users/${USER_ID}/tweets?expansions=attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id&tweet.fields=author_id,created_at,id,text&max_results=8" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq

# curl -s --request GET "https://api.twitter.com/2/users/${USER_ID}/tweets?expansions=attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id&tweet.fields=attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,referenced_tweets,text,withheld&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type&media.fields=duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,non_public_metrics,organic_metrics,promoted_metrics&max_results=5" -H "Authorization: Bearer $BEARER_TOKEN" | jq


#curl -s --request GET 'https://api.twitter.com/2/tweets?ids=1212092628029698048&tweet.fields=attachments,author_id,context_annotations,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,public_metrics,referenced_tweets,source,text,withheld&expansions=referenced_tweets.id' --header 'Authorization: Bearer $BEARER_TOKEN'

#curl -s --request GET "https://api.twitter.com/1.1/users/show.json?screen_name=twitterdev" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq


# https://api.twitter.com/2/tweets?ids=1228393702244134912,1227640996038684673,1199786642791452673&tweet.fields=created_at&expansions=author_id&user.fields=created_at

