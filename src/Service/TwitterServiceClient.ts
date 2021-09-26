import ErrorData from "../Types/ErrorData"
import TweetDataResponse from "../Types/TweetDataResponse"

type TweetDataHandler = (results: TweetDataResponse) => void

type ErrorHandler = (error: ErrorData) => void

interface TwitterServiceClient {
    token: string | null
    handleError: ErrorHandler
    handleData: TweetDataHandler
    handleTokenExpiry: () => void
}

export default TwitterServiceClient