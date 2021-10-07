import IncludedData from "./IncludedData"
import MetaInfo from "./MetaInfo"
import TweetData from "./TweetData"

interface TweetDataResponse {
    data: TweetData[]
    includes?: IncludedData
    meta?: MetaInfo
}

export default TweetDataResponse