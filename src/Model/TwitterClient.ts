/* eslint-disable @typescript-eslint/no-non-null-assertion */
import TwitterService, { RequestId } from "../Service/TwitterService"
import TwitterServiceClient from "../Service/TwitterServiceClient"
import ErrorData from "../Types/ErrorData"
import TweetDataResponse from "../Types/TweetDataResponse"
import Tweet from "./Tweet"
import { DeviceEventEmitter, EmitterSubscription } from "react-native"
import UserData from '../Types/UserData';
import { ErrorInfo } from "react"
import TweetData from "../Types/TweetData"

export type ServiceResult = 'TWEETS' | 'USER' | 'ERROR'

// An opaque unique JS symbol that behaves like string UUID
// and can be used for weakly hiding computed property names
const instanceName = Symbol()

const DEFAULT_PROFILE_IMAGE_URL = "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
const DEFAULT_BIGGER_IMAGE_URL = "https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png"

type TweetDataHandler = (results: Tweet[]) => void
type ErrorHandler = (error: ErrorData) => void

function largerProfileImageURLFromNormal(normalProfileURL: string): string {
    return normalProfileURL.replace('_normal', '_bigger')
}

type ServiceDataTypes = 'TWEETS' | 'USER_DETAIL' | 'USER_BRIEF'

function tweetFromTweetRecord(author: UserData, tweetRecord: TweetData): Tweet {
    const biggerImageURL = author.profile_image_url 
        ? largerProfileImageURLFromNormal(author.profile_image_url)
        : DEFAULT_BIGGER_IMAGE_URL
    return { 
        id: parseInt(tweetRecord.id),
        text: tweetRecord.text, 
        createdAt: new Date(tweetRecord.created_at),
        name: author?.name ?? "Egg",
        screenName: author?.username ?? "Egg name",
        userImage: "",
        profileImageURL: author?.profile_image_url ?? DEFAULT_PROFILE_IMAGE_URL,
        biggerProfileImageURL: biggerImageURL
    }
}

class TwitterClient implements TwitterServiceClient {

    /** Delegate service logic to Twitter service */
    twitter = new TwitterService(this)

    /** If the user is logged in, contains the user's auth token */
    token: string | null = null

    /** The users user id number, if known; or null if not known */
    userId: string | null = null

    /** The users username if known, or null if not known */
    userName: string | null = null

    /** Cache of users seen by the app - TODO implement LRU */
    knownUsers = new Map<string, UserData>()

    tweetsQueue: Tweet[] = []

    // Singleton
    private static [instanceName]: TwitterClient | null = null

    static subscribe(result: ServiceResult, handler: TweetDataHandler | ErrorHandler): EmitterSubscription {
        return DeviceEventEmitter.addListener(result, handler)
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

    accumulateUserRecord(userRecord: UserData): void {
        this.knownUsers.set(userRecord.id, userRecord)
    }

    accumulateTweetRecord(tweetRecord: TweetData): void {
        const author = this.knownUsers.has(tweetRecord.author_id)
            ? this.knownUsers.get(tweetRecord.author_id)
            : undefined
        if (author?.profile_image_url) {
            const tweet = tweetFromTweetRecord(author, tweetRecord)
            this.tweetsQueue.push(tweet)
        } else {
            this.twitter.fetchUserDataById(tweetRecord.author_id)
        }
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

    upsertUser(user: UserData): void {
        if (this.knownUsers.has(user.id)) {
            const existUser = this.knownUsers.get(user.id)!
            this.knownUsers.set(user.id, {
                ...existUser,
                ...user
            })
        } else {
            this.knownUsers.set(user.id, user)
        }
    }

    handleData(results: TweetDataResponse): void {
        results.includes?.users?.forEach(this.accumulateUserRecord, this)
        if (Array.isArray(results.data)) {
            results.data?.forEach(this.accumulateTweetRecord, this)
        } else {
            this.upsertUser(results.data)
        }
        this.emitEvent('TWEETS', this.tweetsQueue)
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