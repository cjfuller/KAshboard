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

### GitHub Setup

TODO

### BigQuery Setup

Go [here](https://code.google.com/apis/console/b/0/?noredirect#project:124072386181:access) and scroll to the bottom to **Service accounts**. You'll see a client ID in the form of ...@developer.gserviceaccount.com. Put that into the secrets as `bqClientId`.

Full instructions are [here](https://developers.google.com/bigquery/authorization#service-accounts) if you want more context.

Next, generate a private key and get a *p12* file. Then run:
```bash
openssl pkcs12 -in <long-hex-string>-privatekey.p12 -out bigquery.pem -nodes
```
to generate a *pem* file. Both file extensions are in the gitignore.

## Widget guidelines

### Loading message

Render the `LoadingMessage` component (`loading-message.jsx`) if the widget
content has not yet loaded.

```
return <div>
    <LoadingMessage />
</div>;
```
