import TwitterService, { RequestId } from "../Service/TwitterService"
import TwitterServiceClient from "../Service/TwitterServiceClient"
import ErrorData from "../Types/ErrorData"
import TweetDataResponse from "../Types/TweetDataResponse"
import Tweet from "./Tweet"
import { DeviceEventEmitter } from "react-native"
import UserData from "../Types/UserData"
import { ErrorInfo } from "react"
import TweetData from "../Types/TweetData"

export type ServiceResult = 'TWEETS' | 'USER' | 'ERROR'

// An opaque unique JS symbol that behaves like string UUID
// and can be used for weakly hiding computed property names
const instanceName = Symbol()

type TweetDataHandler = (results: Tweet[]) => void
type ErrorHandler = (error: ErrorData) => void


class TwitterClient implements TwitterServiceClient {

    /** Delegate service logic to Twitter service */
    twitter = new TwitterService(this)

    /** If the user is logged in, contains the user's auth token */
    token: string | null = null

    /** The users user id number, if known; or null if not known */
    userId: string | null = null

    /** The users username if known, or null if not known */
    userName: string | null = null

    // Singleton
    private static [instanceName]: TwitterClient | null = null

    static subscribe(result: ServiceResult, handler: TweetDataHandler | ErrorHandler): void {
        DeviceEventEmitter.addListener(result, handler)
    }

    static get instance(): TwitterClient {
        if (!TwitterClient[instanceName]) {
            TwitterClient[instanceName] = new TwitterClient()
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return TwitterClient[instanceName]!
    }

    constructor() {
        this.handleData = this.handleData.bind(this)
        this.handleError = this.handleError.bind(this)
        this.handleTokenExpiry = this.handleTokenExpiry.bind(this)
        this.updateUser = this.updateUser.bind(this)
    }

    setUserName(name: string): TwitterClient {
        this.userName = name
        return this
    }

    setToken(token: string): TwitterClient {
        this.token = token
        return this
    }

    emitEvent(result: ServiceResult, data: Tweet[] | UserData | ErrorInfo): void {
        setTimeout(() => {
            DeviceEventEmitter.emit(result, data)
        })
    }

    handleData(results: TweetDataResponse): void {
        // console.log("Results")
        // console.log(results)
        const tweetData: Tweet[] = results.data.map((t) => {
            return { 
                id: parseInt(t.id),
                text: t.text, 
                createdAt: new Date(t.created_at),
                name: t.author_id,
                screenName: t.author_id,
                userImage: "",
                profileImageURL: "",
                biggerProfileImageURL: ""
            }
        })
        this.emitEvent('TWEETS', tweetData)
    }

    handleError(error: ErrorData): void {
        console.log(error)
    }

    updateUser(userId: string): void {
        this.userId = userId
        console.log("update user")
        this.fetchTweetsForLoggedInUser()
    }

    handleTokenExpiry(): void {
        this.logout()
    }

    logout(): void {
        this.userId = null
        this.userName = null
        this.token = null
    }

    login(): void {
        if (this.userName !== null) {
            this.twitter.fetchUserDataByUserName(this.userName)
        }
    }

    cancelRequests(requestList: RequestId[]): void {
        requestList.forEach((id) => {
            this.twitter.cancelRequest(id)
        })
    }

    fetchTweetsForLoggedInUser(): void {

        console.log(`fetchTweetsForLoggedInUser ${this.userId} - ${this.userName}`)
        if (this.userId === null) {

            // User id not current - attempt login
            if (this.userName === null) {
                // User login credentials not current - redirect to login
                this.handleError({ title: "User not logged in", detail: "Log in to request tweets"})
                return
            }
            
            this.twitter.fetchUserDataByUserName(this.userName)
            return
        }

        this.twitter.fetchTweetsForUser(this.userId)
    }
}

export { TwitterClient }