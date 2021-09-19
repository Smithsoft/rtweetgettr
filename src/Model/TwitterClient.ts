/* eslint-disable @typescript-eslint/no-non-null-assertion */
// An opaque unique JS symbol that behaves like string UUID

// and can be used for weakly hiding computed property names
const instanceName = Symbol()

export class TwitterClient {

    // Singleton
    private static [instanceName]: TwitterClient | null = null

    static get instance(): TwitterClient {
        if (!TwitterClient[instanceName]) {
            TwitterClient[instanceName] = new TwitterClient()
        }
        return TwitterClient[instanceName]!
    }
}
