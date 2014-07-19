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

Go [here](https://code.google.com/apis/console/b/0/?noredirect#project:124072386181:access) and scroll to the bottom to **Service accounts**. You'll see a client email in the form of `...@developer.gserviceaccount.com`. Put that into the secrets as `bqClientId`.

Full instructions are [here](https://developers.google.com/bigquery/authorization#service-accounts) if you want more context.

Next, generate a private key and get a *p12* file. Then run:
```bash
openssl pkcs12 -in <long-hex-string>-privatekey.p12 -out bigquery.pem -nodes
```
to generate a *pem* file. Both file extensions are in the gitignore.

### Khan Academy API OAuth

Khan Academy uses OAuth 1.0. The full instructions are [here](https://github.com/Khan/khan-api/wiki/Khan-Academy-API-Authentication).

First, get a consumer key and secret [here](https://www.khanacademy.org/api-apps/register). Put these into `secrets.js`.

Then clone this: [Khan/khan-api](https://github.com/Khan/khan-api)

Navigate to `examples/test_client`. Modify the script to print out `ACCESS_TOKEN` after `get_access_token()` is called. That will give you the access token and secret. Put these into `secrets.js`.

## Widget guidelines

### Loading message

Render the `LoadingMessage` component (`loading-message.jsx`) if the widget
content has not yet loaded.

```
return <div>
    <LoadingMessage />
</div>;
```
