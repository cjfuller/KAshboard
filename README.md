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

```js
return <div>
    <LoadingMessage />
</div>;
```
