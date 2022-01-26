import Tweet from "../Model/Tweet";
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import UserData from "../Types/UserData";
import ErrorResponse from "../Types/ErrorResponse";
import ErrorData from "../Types/ErrorData";
import TweetDataResponse from "../Types/TweetDataResponse";
import TwitterServiceClient from "./TwitterServiceClient";
import RequestInFlight from "../Types/RequestInFlight"

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

    static nullRequest = Symbol()

    /** If a fetch has completed, contains the result of the fetch */
    fetchResult?: FetchResult

    /** If a fetch has completed with an error, contains error information */
    errorInformation?: string

    userId?: string

    _client: TwitterServiceClient

    /** Set to true if client is paused */
    paused = false

    constructor(client: TwitterServiceClient) {
        this._client = client
        this.errorHandler = this.errorHandler.bind(this)
    }

    private _requestsInFlight: RequestInFlight[] = []

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

    cancelAllRequests(): void {
        const prev_pause = this.paused
        this.paused = true
        console.log("Cancel All Requests: " + this._requestsInFlight.length)
        this._requestsInFlight.forEach(r => { r.cancel.cancel() })
        this._requestsInFlight = []
        this.paused = prev_pause
    }

    fetchUserDataByUserName(userName: string): RequestId {
        if (this.paused) { 
            console.log("Ignoring fetch while paused")
            return TwitterService.nullRequest
        }
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

    fetchTweetsForUser(userId: string): RequestId {
        if (this.paused) {
            console.log("Ignoring fetch while paused")
            return TwitterService.nullRequest
        }
        const url = `https://api.twitter.com/2/users/${userId}/tweets`
        const fields = [
            'author_id',
            'created_at',
            'id',
            'text'
        ]
        const expansions = [
            'attachments.media_keys',
            'author_id',
            'entities.mentions.username',
            'geo.place_id',
            'in_reply_to_user_id',
            'referenced_tweets.id',
            'referenced_tweets.id.author_id'
        ]
        const max_results = 8
        const rq = this.cancellation({ url, 'resourceName': userId })
        const params: AxiosRequestConfig = {
            ...this.conf(),
            cancelToken: rq.cancel.token,
            params: {
                'expansions': expansions.join(),
                'tweet.fields': fields.join(),
                max_results
            }
        }
        axios
            .get<TweetDataResponse>(url, params)
            .then((response) => {
                this._client.handleData(response.data)
                console.log(JSON.stringify(response.data))
            })
        return rq.id
    }

    fetchUserDataById(userId: string): RequestId {
        if (this.paused) {
            console.log("Ignoring fetch while paused")
            return TwitterService.nullRequest
        }
        const url = `https://api.twitter.com/2/users/${userId}`
        const fields = [
            'profile_image_url',
            'public_metrics',
            'verified'
        ]
        const rq = this.cancellation({ url, 'resourceName': userId })
        const params: AxiosRequestConfig = {
            ...this.conf(),
            cancelToken: rq.cancel.token,
            params: {
                'user.fields': fields.join()
            }
        }
        axios
            .get<TweetDataResponse>(url, params)
            .then((response) => {
                console.log(JSON.stringify(response.data))
                this._client.handleData(response.data)
            })
        return rq.id
    }
}

export default TwitterService