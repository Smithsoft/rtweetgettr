import {
    enablePromise,
    openDatabase,
    ResultSet,
    SQLiteDatabase,
    Transaction,
} from 'react-native-sqlite-storage'
import Tweet from '../Model/Tweet';

const tableName = 'tweetData'
const databaseName = 'tweet-data.db'

enablePromise(true)

/**
 * Opens a connection to a database file, creating it if it doesn't 
 * exist. On iOS it is created in the Library directory of the app
 * which can be backed up by iCloud. On Android its opened in an
 * opaque location ('Library' is ignored)
 * https://github.com/andpor/react-native-sqlite-storage#opening-a-database
 * @returns 
 */
export const getDBConnection = async (): Promise<SQLiteDatabase> => {
    return openDatabase({ name: databaseName, location: 'Library' })
}

/**
 * Creates the database table if it does not exist.  If the table
 * 'tweet-data.db' does exist, command simply has no effect (and
 * no error message is returned)
 * @param db The database handle to create the table on
 */
export const createTable = async (db: SQLiteDatabase): Promise<void> => {
    // automatically creates a `rowid` column that auto-increments, and
    // this will be different to the id that comes from Twitter
    //
    // the UNIQUE constraint as well as making the Twitter 'id'
    // field unique also indexes the table on the field so lookups
    // are faster.
    //
    // Date-times are ISO 8601 - YYYY-MM-DD HH:MM:SS.SSS stored as text
    //  2016-01-01 10:20:05.123 - https://www.sqlite.org/lang_datefunc.html
    // Note that this is the date of the tweet on Twitter, not the date it
    // was inserted in this database.
    const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        id INTEGER NOT NULL UNIQUE,
        createdAt TEXT,
        name TEXT NOT NULL,
        screenName TEXT,
        userImage TEXT,
        profileImage TEXT,
        tweetText TEXT NOT NULL
    );`

    await db.executeSql(query)
}

function tweetToRow(t: Tweet) {
    return (
        `(${t.id}, ${t.createdAt}, '${t.name}', ` +
        `'${t.screenName}', '${t.userImage}', ` + 
        `'${t.profileImageURL}', '${t.text}', '${t.screenName}')`
    )
}

/**
 * Insert the items from the list of tweets - fetched from cloud/API call
 *
 * Where the insert would violate the unique constraint on the id field
 * because we already have that tweet locally then replace it with the
 * new information (rather than creating a new record)
 * 
 * These inserts will automatically create the 'rowid' column as described
 * in the createTable() function.
 * 
 *  May throw a database exception if this call fails.
 * 
 * @param db The database handle to create the table on
 * @param tweetItems The list of tweets - fetched from cloud/API call
 * @returns void promise - async function
 */
export const saveTweetItems = async (
    db: SQLiteDatabase,
    tweetItems: Tweet[],
): Promise<void> => {
    const insertQuery =
        `INSERT OR REPLACE INTO ${tableName}(id, createdAt, name, screenName, ` + 
            'userImage, profileImage, tweetText) values' +
        tweetItems
            .map(tweetToRow)
            .join(',')
    console.log(insertQuery)
    db.executeSql(insertQuery)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tweetItemFromRow(t: any): Tweet {
    console.log(t)
    return {
        id: t.id,
        text: t.tweetText,
        createdAt: t.createdAt,
        name: t.name,
        screenName: t.screenName,
        userImage: t.userImage,
        profileImageURL: t.profileImage,
        biggerProfileImageURL: ''
    }
}

/**
 * Get the tweet items from the store, ordered by date from newest to oldest,
 * for the given user. Only return limit results. Start the results from the
 * given lastResultDate.
 * 
 * May throw a database exception if this call fails.
 * 
 * The use of a transaction makes sure this query occurs without cutting across
 * any update.
 * 
 * @param tx Run the query under this transaction handle
 * @param user Filter by this user
 * @param limit Only return this many results (or all, if this is undefined)
 * @param lastResultDate Start from this date (or from now, if this is undefined)
 * @returns 
 */
export const getTweetItems = async (db: SQLiteDatabase, user?: string, limit?: number, lastResultDate?: Date): Promise<Tweet[]> => {
    const where_clause = (user === undefined && lastResultDate === undefined) ? '' : ' WHERE'
    const conjunction = (user !== undefined && lastResultDate !== undefined) ? ' AND' : ''
    const query = `SELECT id, createdAt, name, screenName, userImage, profileImage, tweetText FROM ${tableName}` +
        where_clause + (user ? ` name = ${user}` : '') + conjunction +
        (lastResultDate ? ` createdAt < ${lastResultDate}` : '') +
        ' ORDER BY createdAt' +
        (limit ? ` LIMIT ${limit}` : '') 
    console.log(query)
    const [result] = await db.executeSql(query);
    return result.rows.raw().map(tweetItemFromRow)
}

export const getTweetItem = async (db: SQLiteDatabase, tweetId: string): Promise<Tweet> => {
    const query = `SELECT id, createdAt, name, screenName, userImage, profileImage, tweetText FROM ${tableName}` +
        ` WHERE id = ${tweetId}`
    console.log(query)
    const [result] = await db.executeSql(query);
    return tweetItemFromRow( result.rows.item(0) )
}

export const deleteTweetItem = async (
    db: SQLiteDatabase,
    id: number,
): Promise<void> => {
    const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`
    await db.executeSql(deleteQuery)
}

export const deleteTable = async (db: SQLiteDatabase): Promise<void> => {
    const query = `drop table ${tableName}`

    await db.executeSql(query)
}
