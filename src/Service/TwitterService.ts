import Tweet from "../Model/Tweet";
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import UserData from "../Types/UserData";
import ErrorResponse from "../Types/ErrorResponse";
import ErrorData from "../Types/ErrorData";
import TweetDataResponse from "../Types/TweetDataResponse";
import TwitterServiceClient from "./TwitterServiceClient";


// USER_ID=$(curl -s --request GET "https://api.twitter.com/2/users/by/username/plistinator" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq --raw-output '.data.id')
// {"data":{"id":"2421631333","name":"Plistinator","username":"plistinator"}}

// curl -s --request GET "https://api.twitter.com/2/users/${USER_ID}/tweets?expansions=attachments.media_keys,author_id,referenced_tweets.id&tweet.fields=author_id,created_at,id,text" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq

interface UserDataPayload {
    data: UserData
}

type FetchResult = 'SUCCESS' | 'TOKEN_EXPIRED' | 'ERROR'

class TwitterService {

    /** If a fetch has completed, contains the result of the fetch */
    fetchResult: FetchResult | null = null

    /** If a fetch has completed with an error, contains error information */
    errorInformation: string | null = null

    private _client: TwitterServiceClient

    constructor(client: TwitterServiceClient) {
        this.errorHandler = this.errorHandler.bind(this)
        this._client = client
    }

    errorHandler(error: AxiosError<ErrorResponse>): void {
        if (error.response?.status === 401) {
            this._client.handleTokenExpiry()
            this.fetchResult = 'TOKEN_EXPIRED'
        } else {
            this.fetchResult = 'ERROR'
            this.errorInformation = error.response?.data.detail ?? "Unknown error"
            this._client.handleError({ title: "Twitter Error", detail: this.errorInformation })
        }
    }

    conf(): AxiosRequestConfig {
        return {
            headers: {
                Authorization: `Bearer ${this._client.token}`
            }    
        }
    }

    fetchUserDataByUserName(userName: string): void {
        const url = `https://api.twitter.com/2/users/by/username/${userName}`
        axios
            .get<UserDataPayload>(url, this.conf())
            .then((response) => {
                const userData = response.data
                this.userId = userData.data.id
            })
            .catch(this.errorHandler)
    }

    fetchTweetsForUser(userId: string): void {
        const url = `https://api.twitter.com/2/users/${userId}/tweets`
        const auth = this.conf()
        const fields = [
            'author_id',
            'created_at',
            'id',
            'text'
        ]
        const params: AxiosRequestConfig = {
            ...auth,
            params: {
                'tweet.fields': fields.join()
            }
        }
        axios
            .get<TweetDataResponse>(url, params)
            .then((response) => {
                this._client.handleData(response.data)
            })
    }
}

export default TwitterService