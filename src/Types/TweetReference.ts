interface TweetReference {
    type: 'quoted' | 'retweeted' | 'replied_to'
    id: string
}

export default TweetReference