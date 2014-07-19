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

Follow the instructions [here](https://developers.google.com/bigquery/authorization#service-accounts) to get a *p12* file. Then, run:
```bash
openssl pkcs12 -in <long-hex-string>-privatekey.p12 -out bigquery.pem -nodes
```
to generate a *pem* file. Both file extensions are in the gitignore.

Note that you'll also see a client ID. Paste that into the secrets too!

## Widget guidelines

### Loading message

Render the `LoadingMessage` component (`loading-message.jsx`) if the widget
content has not yet loaded.

```
return <div>
    <LoadingMessage />
</div>;
```
