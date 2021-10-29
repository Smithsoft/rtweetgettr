import IncludedData from "./IncludedData"
import MetaInfo from "./MetaInfo"
import TweetData from "./TweetData"
import UserData from './UserData';

interface TweetDataResponse {
    data: TweetData[] | UserData
    includes?: IncludedData
    meta?: MetaInfo
}

export default TweetDataResponse