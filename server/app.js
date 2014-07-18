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

var cheerio = require('cheerio');

app.get('/github', function(req, res){
    var options = {
        hostname: 'api.github.com',
        path: '/repos/Khan/webapp/commits',
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

// Get everyone on the team page
// TODO(kevin): Add interns using async
app.get('/team', function(req, res) {
    var url = "https://www.khanacademy.org/about/the-team";
    https.get(url, function(response) {
        var str = '';

        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function(chunk) {
            var $ = cheerio.load(str);
            var team = $('.team-card').map(function(i, employee) {
                return {
                    name: $(employee).find('h2').text().trim(),
                    title: $(employee).find('h3').text().trim(),
                    imageUrl: $(employee).find('img').first().attr('src')
                };
            }).toArray();

            res.send(team);
        });
    });
});

app.listen(3000);
