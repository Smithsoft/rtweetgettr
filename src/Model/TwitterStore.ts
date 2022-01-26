import { tweets } from "./FakeData"
import { TwitterClient } from "./TwitterClient"
import TweetsList from '../UI/TweetsList';
import Tweet from "./Tweet";
import TweetRepo from '../Repository/TweetRepo';
import { EmitterSubscription, NativeAppEventEmitter } from 'react-native';


const instanceName = Symbol()

class TwitterStore {

    private static [instanceName]: TwitterStore | null = null

    tweetsRepo = new TweetRepo()

    subscription?: EmitterSubscription

    static get instance(): TwitterStore {
        if (!TwitterStore[instanceName]) {
            TwitterStore[instanceName] = new TwitterStore()
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return TwitterStore[instanceName]!
    }

    startSync(): void {
        this.subscription = TwitterClient.subscribe('TWEETS', (tweets: Tweet[]) => {
            this.tweetsRepo.saveData(tweets)
        })
    }

    stopSync(): void {
        this.subscription?.remove()
        this.subscription = undefined
    }
}

export default TwitterStore