import TweetData from '../Types/TweetData'

import { tweets as tweetData } from '../Model/FakeData'
import {
    createTable,
    getDBConnection,
    getTweetItems,
    saveTweetItems,
} from './Db'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { TwitterClient } from '../Model/TwitterClient'

import Tweet from '../Model/Tweet'

class TweetRepo {
    db?: SQLiteDatabase

    loadData = async (): Promise<void> => {
        try {
            if (this.db === undefined) {
                this.db = await getDBConnection()
                await createTable(this.db)
            }
            const user = TwitterClient.instance.userName ?? undefined
            getTweetItems(this.db, user, 20).then(items => {
                TwitterClient.instance.emitEvent('TWEETS', items)
            })
        } catch (error) {
            console.log(error)
            TwitterClient.instance.emitEvent('ERROR', error as Error)
        }
    }

    saveData = async (tweets: Tweet[]): Promise<void> => {
        try {
            if (this.db === undefined) {
                this.db = await getDBConnection()
                await createTable(this.db)
            }
            saveTweetItems(this.db, tweets)
        } catch (error) {
            console.log(error)
            TwitterClient.instance.emitEvent('ERROR', error as Error)
        }
    }
}

export default TweetRepo
