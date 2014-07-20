// Some APIs (such as GitHub) require a user-agent header.
var USER_AGENT = 'khan-dashboard-hack';
var secrets = require('./secrets.js');

var express = require('express')
    , cors = require('cors')
    , app = express();

var _ = require('underscore');
var fs = require('fs');

// Enable CORS
app.use(cors());

var async = require('async')
    , cheerio = require('cheerio')
    , gapi = require('googleapis')
    , https = require('https')
    , OAuth = require('oauth')
    , querystring = require('querystring');

var https = require('https');

var bqToken = JSON.parse(fs.readFileSync(
    "./server/.bigquery.v2.token", "utf8"));

var oauth2Client = 
    new gapi.auth.OAuth2(bqToken.client_id, bqToken.client_secret, "");

oauth2Client.credentials = {
    access_token: bqToken.access_token,
    refresh_token: bqToken.refresh_token,
}


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

// record last table update time, so we can update only occasionally

var tableUpdateTimes = {};
var resultCache = {};

function getLastTableUpdateTime(table, callback) {
    if (tableUpdateTimes[table]) {
        callback(tableUpdateTimes[table]);
    } else {
        getTableInfo(table, function(err, res) {
            if (err) {
                callback(null);
            } else {
                var tableInfo = res;
                //var tableInfo = JSON.parse(res);
                tableUpdateTimes[table] = tableInfo.lastModifiedTime;
                getLastTableUpdateTime(table, callback);
            }
        });
    }
}

//List tables
app.get('/bq-list', function (req, res) {
    gapi.discover('bigquery', 'v2').execute(function(err, client) {
        var req = client.bigquery.datasets.list({
            projectId: secrets.bqProjectId});
        req.withAuthClient(oauth2Client).execute(function(err, results) {
            res.send(results);
        });        
    });
});

var bqDataset = "dashboard_stats";

// Execute a query
// Sends err, results to the provided callback [optional].
// Note that these results will be the response from bigquery and not the
// actual computed results.
var queryExec = function(query, destinationTable, callback) {
    var dataset = bqDataset;
    gapi.discover('bigquery', 'v2').execute(function(err, client) {
        var req = client.bigquery.jobs.insert({
           projectId: secrets.bqProjectId});
        req.body = {
            projectId: secrets.bqProjectId,
            configuration: {
                query: {
                    destinationTable: {
                        projectId: secrets.bqProjectId,
                        tableId: destinationTable,
                        datasetId: dataset,
                    },
                    writeDisposition: "WRITE_TRUNCATE",
                    query: query,
                }
            }
        };
        req.withAuthClient(oauth2Client).execute(callback);
    });
};

var readResults = function(sourceTable, maxResults, start, callback) {
    gapi.discover('bigquery', 'v2').execute(function(err, client) {
        var req = client.bigquery.tabledata.list({
           projectId: secrets.bqProjectId,
           datasetId: bqDataset,
           tableId: sourceTable,
           maxResults: maxResults,
           startIndex: start,
        });
        req.withAuthClient(oauth2Client).execute(callback);
    });
};

var getTableInfo = function(table, callback) {
    gapi.discover('bigquery', 'v2').execute(function(err, client) {
        var req = client.bigquery.tables.get({
           projectId: secrets.bqProjectId,
           datasetId: bqDataset,
           tableId: table,
        });
        req.withAuthClient(oauth2Client).execute(callback);
    });
};

// Get everyone on the team page
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

// Returns the latest @all or @here in the Khan Academy HipChat room
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
            if (!history.items) {
                // Likely an error with the proxy server or API access
                res.send({});
                return;
            }
            for (var i = 0; i < history.items.length; i++) {
                var item = history.items[i];
                if (item.message.indexOf('@all') >= 0 ||
                    item.message.indexOf('@here') >= 0) {
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

// Get current weather from Forecast.io
// Limited to 1000 API calls per day
app.get('/weather/:location', function(req, res) {
    var url = ('https://api.forecast.io/forecast/' +
               secrets.forecastAPIKey + '/' + req.params.location +
              '?units=' + (req.query.units || 'us'));
    https.get(url, function(response) {
        var str = '';
        response.on('data', function(chunk) {
            str += chunk;
        });
        response.on('end', function(chunk) {
            if (str == 'Forbidden') {
                res.send({});
                return;
            }
            var forecast = JSON.parse(str);
            res.send(forecast.currently);
        });
    });
});

// Get latest stories, including unpublished
app.get('/stories', function(req, res) {
    var oauth = new OAuth.OAuth(
        'https://www.khanacademy.org/api/auth/request_token',
        'https://www.khanacademy.org/api/auth/access_token',
        secrets.kaConsumerKey,
        secrets.kaConsumerSecret,
        '1.0',
        null,
        'HMAC-SHA1'
    );
    oauth.get(
        'http://www.khanacademy.org/api/v1/stories' +
        '?include_unpublished=1&casing=camel',
        secrets.kaAccessToken,
        secrets.kaAccessTokenSecret,
        function(e, data) {
            res.send(JSON.parse(data));
        }
    );
});

app.get('/registrations/:date', function(req, res) {
    //date should be YYYY-MM
    var tableName = "registrations";
    var query = "\
        SELECT activity_month, registrations\
        FROM [latest_derived.company_goals]\
    ";
    var date = req.params.date;
    var requestId = tableName + "/" + date;
    var twoDaysMSec = 60*60*24*2*1000;
    
    // yep, this looks like code written during a hackathon...
    getLastTableUpdateTime(tableName, function(time) {
        if (time && 
            ((Date.now() - (new Date(parseInt(time))).getTime()) <
              twoDaysMSec)) {
                  if (resultCache[requestId]) {
                      res.send(resultCache[requestId]);
                  } else {
                      readResults(tableName, 100000, 0, function(err, bqRes) {
                          if (err) {
                              res.send({});
                          } else {
                              var myRow = _.find(bqRes.rows, function(row) {
                                  return (row.f[0].v === date);
                              });
                              var result = {
                                  registrations: myRow.f[1].v,
                              };
                              resultCache[requestId] = result;
                              res.send(result);
                          }
                      });
                  }
        } else {
            queryExec(query, tableName);
            res.send({});
        }
    });
});

app.listen(3000);
