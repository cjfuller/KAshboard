# Dashboard Hack

## Setup instructions

```
npm install
npm start
```

Server will start at [http://localhost:9966/](http://localhost:9966/).

## Local API server

First, set up your secrets file.

```bash
cp server/secrets.js.sample server/secrets.js
# Add your secrets to server/secrets.js
```

Then you can run the server:

```bash
node server/app.js
```

## Widget guidelines

### Loading message

Render the `LoadingMessage` component (`loading-message.jsx`) if the widget
content has not yet loaded.

```
return <div>
    <LoadingMessage />
</div>;
```
