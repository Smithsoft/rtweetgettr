# RTweetGettr

App to demonstrate systems code in React

## Setup

* Create iOS and Android build environments
* Run via package.json

```
npm start
npm android
```

https://medium.com/trabe/using-renderless-components-in-react-to-handle-data-4c55f1e94dd4

## Twitter API Keys

To get this to work you'll need Twitter API keys. Go to the [Twitter developer dashboard](https://developer.twitter.com/en/portal/dashboard) to generate some.

Try these out by setting the values in a file `.env` in the root of where this project is checked out, like so:

```bash
BEARER_TOKEN=XXXXXXXXXXXXX
```

Where there `XXXX` is something like `AAAA...` - the actual Twitter API bearer token.