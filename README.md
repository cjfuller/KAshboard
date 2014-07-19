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

You need to generate an oauth2 token to access the API.  Follow the instructions at [https://github.com/Khan/webapp/blob/master/bigquery/bq_connection.py#L78](https://github.com/Khan/webapp/blob/master/bigquery/bq_connection.py#L78).

Then symlink the token (which should be at ~/.bigquery.v2.token into the server directory).

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
