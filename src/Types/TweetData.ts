import TweetReference from "./TweetReference";

interface TweetData {
    id: string
    created_at: string
    author_id: string
    referenced_tweets?: TweetReference[]
    text: string
}

export default TweetData