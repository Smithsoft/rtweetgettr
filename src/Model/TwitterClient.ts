import TwitterService from "../Service/TwitterService"
import TwitterServiceClient from "../Service/TwitterServiceClient"
import ErrorData from "../Types/ErrorData"
import TweetDataResponse from "../Types/TweetDataResponse"
import Tweet from "./Tweet"

// An opaque unique JS symbol that behaves like string UUID
// and can be used for weakly hiding computed property names
const instanceName = Symbol()

type TweetResults = Tweet[] | ErrorData

type TweetDataHandler = (results: TweetResults) => void

class TwitterClient implements TwitterServiceClient {

    twitter = new TwitterService(this)

    /** If the user is logged in, contains the user's auth token */
    token: string | null = null

    /** The users user id number, if known; or null if not known */
    userId: string | null = null

    /** The users username if known, or null if not known */
    userName: string | null = null

    // Singleton
    private static [instanceName]: TwitterClient | null = null

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
    }

    handleData(results: TweetDataResponse): void {
        //
    }

    handleError(error: ErrorData): void {
        //
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

    fetchTweetsForLoggedInUser(dataHandler: TweetDataHandler): void {
        if (this.userId === null) {

            // User id not current - attempt login
            if (this.userName === null) {
                // User login credentials not current - redirect to login
                dataHandler({ title: "User not logged in", detail: "Log in to request tweets"})
                return
            }
            
            this.twitter.fetchUserDataByUserName(this.userName)
            return
        }

        this.twitter.fetchTweetsForUser(this.userId)
    }
}

export { TwitterClient }