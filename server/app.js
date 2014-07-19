// Some APIs (such as GitHub) require a user-agent header.
var USER_AGENT = 'khan-dashboard-hack';
var secrets = require('./secrets.js');

var express = require('express');
var app = express();

// Enable CORS
var cors = require('cors');
app.use(cors());

var https = require('https');
var querystring = require('querystring');

var gapi = require('googleapis');

var cheerio = require('cheerio');
var async = require('async');

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
    var getTeam = function(url, callback) {
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
                callback(null, team);
            });
        });
    };

    async.parallel([
        function(callback) {
            var url = 'https://www.khanacademy.org/about/the-team';
            getTeam(url, callback);
        },
        function(callback) {
            var url = 'https://www.khanacademy.org/about/our-interns';
            getTeam(url, callback);
        }
    ], function(err, results) {
        res.send(results[0].concat(results[1]));
    });
});

// Returns the latest @all in the Khan Academy HipChat room
// Returns an empty JSON object if there is no @all in the last 75 messages
app.get('/at-all', function(req, res) {
    var hipchatRoom = 'Khan Academy';
    var params = {
        auth_token: secrets.hipchatToken,
        reverse: false
    };
    var options = {
        hostname: 'api.hipchat.com',
        path: ('/v2/room/' + encodeURIComponent(hipchatRoom) + '/history?' +
               querystring.stringify(params))
    };
    https.get(options, function(response) {
        var str = '';

        response.on('data', function(chunk) {
            str += chunk;
        });

        response.on('end', function(chunk) {
            var history = JSON.parse(str);
            for (var i = 0; i < history.items.length; i++) {
                var item = history.items[i];
                if (item.message.indexOf('@all') >= 0) {
                    res.send({
                        date: item.date,
                        from: item.from,
                        message: item.message
                    });
                    return;
                }
            };

            // No @all in the last 75 messages
            res.send({});
        });
    });
});

app.listen(3000);
