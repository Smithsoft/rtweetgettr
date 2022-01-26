/* eslint-disable @typescript-eslint/no-non-null-assertion */
import TwitterService, { RequestId } from "../Service/TwitterService"
import TwitterServiceClient from "../Service/TwitterServiceClient"
import ErrorData from "../Types/ErrorData"
import TweetDataResponse from "../Types/TweetDataResponse"
import Tweet from "./Tweet"
import { DeviceEventEmitter, EmitterSubscription } from "react-native"
import UserData from '../Types/UserData';
import TweetData from "../Types/TweetData"
import TweetRepo from '../Repository/TweetRepo';

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

    tweetsQueue: TweetData[] = []

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

    setUserName(name: string): TwitterClient {
        this.userName = name
        return this
    }

    setToken(token: string): TwitterClient {
        this.token = token
        return this
    }

    emitEvent(result: ServiceResult, data: Tweet[] | UserData | Error): void {
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

    //// EXERCISE FOR THE READER - 
    ////  Write this like a React reducer using actions & state
    ////  with the 3 different cases, and immutable data
    /** Reducer that demuxes possible data responses into displayable tweets */
    handleData(results: TweetDataResponse): void {
        results.includes?.users?.forEach(this.accumulateUserRecord, this)
        const publishedTweets: Tweet[] = []
        if (Array.isArray(results.data)) {
            // Got tweets, publish ones where the author data is known, queue the rest
            results.data.forEach((tweetRecord) => {
                const author = this.knownUsers.has(tweetRecord.author_id)
                    ? this.knownUsers.get(tweetRecord.author_id)
                    : undefined
                if (author?.profile_image_url) {
                    publishedTweets.push(tweetFromTweetRecord(author, tweetRecord))
                } else {
                    this.twitter.fetchUserDataById(tweetRecord.author_id)
                    this.tweetsQueue.push(tweetRecord)
                }
            })
        } else {
            // Got user records, complete tweets we can
            const user = results.data
            this.upsertUser(results.data)
            const completedTweets = this.tweetsQueue.filter((tweetData) => tweetData.author_id === user.id)
            if (completedTweets.length > 0) {
                const toBeRemoved: string[] = []
                completedTweets.forEach((tweetData) => {
                    toBeRemoved.push(tweetData.id)
                    publishedTweets.push(tweetFromTweetRecord(user, tweetData))
                })
                this.tweetsQueue = this.tweetsQueue.filter((twd) => toBeRemoved.indexOf(twd.id) != -1)
            }
        }
        this.emitEvent('TWEETS', publishedTweets)
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
        if (this.userName !== null && this.token !== null) {
            this.fetchTweetsForLoggedInUser()
        }
    }

    cancelRequests(requestList: RequestId[]): void {
        requestList.forEach((id) => {
            this.twitter.cancelRequest(id)
        })
    }

    stopAllRequests(): void {
        this.twitter.paused = true
        this.twitter.cancelAllRequests()
    }

    startRequests(): void {
        this.twitter.paused = false
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