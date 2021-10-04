import Tweet from "../Model/Tweet";
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import UserData from "../Types/UserData";
import ErrorResponse from "../Types/ErrorResponse";
import ErrorData from "../Types/ErrorData";
import TweetDataResponse from "../Types/TweetDataResponse";
import TwitterServiceClient from "./TwitterServiceClient";
import RequestInFlight from "../Types/RequestInFlight"

import { EventEmitter } from 'react-native'

// USER_ID=$(curl -s --request GET "https://api.twitter.com/2/users/by/username/plistinator" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq --raw-output '.data.id')
// {"data":{"id":"2421631333","name":"Plistinator","username":"plistinator"}}

// curl -s --request GET "https://api.twitter.com/2/users/${USER_ID}/tweets?expansions=attachments.media_keys,author_id,referenced_tweets.id&tweet.fields=author_id,created_at,id,text" --header "Authorization: Bearer ${BEARER_TOKEN}" | jq

interface UserDataPayload {
    data: UserData
}

type FetchResult = 'SUCCESS' | 'TOKEN_EXPIRED' | 'ERROR' | 'NOT_FOUND'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestId = symbol

class TwitterService {

    /** If a fetch has completed, contains the result of the fetch */
    fetchResult?: FetchResult

    /** If a fetch has completed with an error, contains error information */
    errorInformation?: string

    userId?: string

    _client: TwitterServiceClient

    constructor(client: TwitterServiceClient) {
        this._client = client
        this.errorHandler = this.errorHandler.bind(this)
    }

    private _requestsInFlight: RequestInFlight[] = []
    private _cancelTokens = axios.CancelToken.source()

    errorHandler(error: AxiosError<ErrorResponse>): void {
        console.log(JSON.stringify(error));
        if (error.response?.status === 401) {
            this._client.handleTokenExpiry()
            this.fetchResult = 'TOKEN_EXPIRED'
        } else if (error.response?.status == 404) {
            this.fetchResult = 'NOT_FOUND'
            const notFoundResource = error.response?.config.url ?? "Unknown resource"
            this._client.handleError({ title: "Not found", detail: notFoundResource})
        } else {
            this.fetchResult = 'ERROR'
            this.errorInformation = error.response?.data.detail ?? "Unknown error"
            this._client.handleError({ title: "Twitter Error", detail: this.errorInformation })
        }
    }

    cancellation(args: { url: string, resourceName: string }): RequestInFlight {
        const cancelSource = axios.CancelToken.source()
        const rq = {
            ...args,
            cancel: cancelSource,
            id: Symbol()
        }
        this._requestsInFlight.push(rq)
        return rq
    }

    conf(): AxiosRequestConfig {
        return {
            headers: {
                Authorization: `Bearer ${this._client.token}`
            } ,
        }
    }

    cancelRequest(requestId: RequestId): void {
        const rq = this._requestsInFlight.findIndex((el) => {el.id === requestId})
        if (rq !== -1) {
            const toCancel = this._requestsInFlight.splice(rq)
            toCancel[0].cancel.cancel()
        }
    }

    fetchUserDataByUserName(userName: string): RequestId {
        console.log(`fetchUserDataByUserName ${userName}`)
        const url = `https://api.twitter.com/2/users/by/username/${userName}`
        const resourceName = userName
        const rq = this.cancellation({ url, resourceName })
        const conf: AxiosRequestConfig = {
            ...this.conf(),
            cancelToken: rq.cancel.token
        }
        axios
            .get<UserDataPayload>(url, conf)
            .then((response) => {
                const userData = response.data
                this.userId = userData.data.id
                this._client.updateUser(userData.data.id)
            })
            .catch(this.errorHandler)
        return rq.id
    }

    fetchTweetsForUser(userId: string): void {
        const url = `https://api.twitter.com/2/users/${userId}/tweets`
        const fields = [
            'author_id',
            'created_at',
            'id',
            'text'
        ]
        const resourceName = userId
        const rq = this.cancellation({ url, resourceName })
        const params: AxiosRequestConfig = {
            ...this.conf(),
            cancelToken: rq.cancel.token,
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