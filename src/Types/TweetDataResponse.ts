import IncludedData from "./IncludedData"
import MetaInfo from "./MetaInfo"
import TweetData from "./TweetData"

interface TweetDataResponse {
    data: TweetData[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    includes?: IncludedData
    meta: MetaInfo
}

export default TweetDataResponse