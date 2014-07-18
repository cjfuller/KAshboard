# Dashboard Hack

## Setup instructions

```
npm install
npm start
```

Server will start at [http://localhost:9966/](http://localhost:9966/).

## Widget guidelines

### Loading message

Render the `LoadingMessage` component (`loading-message.jsx`) if the widget
content has not yet loaded.

```
return <div>
    <LoadingMessage />
</div>;
```

### Github widget

It needs to make authenticated API calls to work.  To get this running locally,
go to your [application settings page on
github](https://github.com/settings/applications), and create a new personal
access token.  (It should only need private repository read permissions, called
"repo" in the interface.)  Then put it on your machine somewhere safe-ish (mine
is at `~/.gh-token` with 0600 permissions) into a file with the following format:

```js
var GHToken = {
    token: '<long hex string token here>',
    pw: 'x-oauth-basic',
};
module.exports = GHToken;
```
and symlink it to `js/gh-token.js` (which is in the `.gitignore` so it doesn't
accidentally get committed).