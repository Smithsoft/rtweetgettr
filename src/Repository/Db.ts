import { enablePromise, openDatabase, ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage'
import Tweet from '../Model/Tweet';
import TweetData from '../Types/TweetData';

const tableName = 'tweetData'

enablePromise(true)

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
    return openDatabase({ name: 'todo-data.db', location: 'default' })
}

export const createTable = async (db: SQLiteDatabase): Promise<void> => {
    // create table if not exists
    // automatically creates a `rowid` column that auto-increments
    // this will be different to the id that comes from Twitter
    // the unique constraint as well as making the Twitter 'id' 
    // field unique also indexes the table on the field so lookups
    // are faster.
    // Date-times are ISO 8601 - YYYY-MM-DD HH:MM:SS.SSS stored as text
    //  2016-01-01 10:20:05.123 
    const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        id INTEGER NOT NULL UNIQUE,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        name TEXT NOT NULL,
        screenName TEXT,
        userImage TEXT,
        profileImage TEXT,
        tweetText TEXT NOT NULL
    );`

    await db.executeSql(query)
}

export const saveTweetItems = async (db: SQLiteDatabase, tweetItems: Tweet[]): Promise<[ResultSet]> => {
    // Insert the items from the list of tweets - fetched from cloud/API call
    // Where the insert would violate the unique constraint on the id field
    // because we already have that tweet locally then replace it with the
    // new information (rather than creating a new record)
    const insertQuery =
      `INSERT OR REPLACE INTO ${tableName}(id, name, screenName, userImage, profileImage, tweetText) values` +
      tweetItems.map(i => `(${i.id}, '${i.name}', '${i.screenName}', '${i.userImage}', '${i.profileImageURL}', '${i.text}', '${i.screenName}')`).join(',');
  
    return db.executeSql(insertQuery);
  };
  
  export const deleteTweetItem = async (db: SQLiteDatabase, id: number): Promise<void> => {
    const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
    await db.executeSql(deleteQuery);
  };
  
  export const deleteTable = async (db: SQLiteDatabase): Promise<void> => {
    const query = `drop table ${tableName}`;
  
    await db.executeSql(query);
  };
