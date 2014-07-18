// Some APIs (such as GitHub) require a user-agent header.
var USER_AGENT = 'khan-dashboard-hack';
var secrets = require('./secrets.js');

var express = require('express');
var app = express();

// Enable CORS
var cors = require('cors');
app.use(cors());

var https = require('https');

var gapi = require('googleapis');

app.get('/github', function(req, res){
    var options = {
        hostname: 'api.github.com',
        path: '/repos/Khan/webapp/events',
        auth: secrets.githubToken + ':x-oauth-basic',
        headers: {
            'user-agent': USER_AGENT
        }
    };
    https.get(options, function(response) {
        var str = '';
        response.on('data', function(chunk) {
            str += chunk;
        });
        response.on('end', function(chunk) {
            res.send(JSON.parse(str));
        });
    });
});

// BigQuery stuff...
// TODO(tony): prefix all this with "BQ" to avoid confusion
var projectNumber = secrets.bqProjectNumber;
var clientId = secrets.bqClientId;

function auth() {
    var config = {
        'client_id': clientId,
        'scope': 'https://www.googleapis.com/auth/bigquery',
    };
    gapi.auth.authorize(config, function() {
        gapi.client.load('bigquery', 'v2');
    });
};

// List tables
app.get('/bq-list', function(req, res) {
    // TODO(tony): order?
    auth();

    var request = gapi.client.bigquery.datasets.list({
        'projectId': projectNumber
    });

    request.execute(function(response) {
        res.send(JSON.stringify(response.result.datasets, null));
    });
});

app.listen(3000);
