import Tweet from "./Tweet"

const tw1: Tweet = {
    id: 737517906833,
    text: 'My tweet',
    createdAt: new Date(),
    name: 'Brian',
    screenName: 'Roger ramjet',
    userImage: 'placeholder',
    profileImageURL: '',
    biggerProfileImageURL: '',
}
const tw2: Tweet = {
    id: 737514856834,
    text: 'My tweet',
    createdAt: new Date(),
    name: 'Roger',
    screenName: 'Wily coyote',
    userImage: 'placeholder',
    profileImageURL: '',
    biggerProfileImageURL: '',
}
const tw3: Tweet = {
    id: 73751796835,
    text: 'My tweet',
    createdAt: new Date(),
    name: 'Myrna',
    screenName: 'Myra ramjet',
    userImage: 'placeholder',
    profileImageURL: '',
    biggerProfileImageURL: '',
}
const tweets = [ tw1, tw2, tw3 ]

export { tw1, tw2, tw3, tweets }