// Some APIs (such as GitHub) require a user-agent header.
var USER_AGENT = 'khan-dashboard-hack';
var secrets = require('./secrets.js');

var express = require('express')
    , cors = require('cors')
    , app = express();

var moment = require('moment-timezone');
var _ = require('underscore');
var fs = require('fs');

// Enable CORS
app.use(cors());

var async = require('async')
    , cheerio = require('cheerio')
    , gapi = require('googleapis')
    , http = require('http')
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

var kaOAuth = new OAuth.OAuth(
    'https://www.khanacademy.org/api/auth/request_token',
    'https://www.khanacademy.org/api/auth/access_token',
    secrets.kaConsumerKey,
    secrets.kaConsumerSecret,
    '1.0',
    null,
    'HMAC-SHA1'
);

// Returns true if the given story is probably not spam
var isProbablyNotSpam = function(story) {
    var storyStr = story.story.toLowerCase();
    if (storyStr.length < 5) {
        return false;
    }
    if (storyStr.indexOf('loan amount') >= 0) {
        return false;
    }
    return true;
};

// Get latest stories, including unpublished
app.get('/stories', function(req, res) {
    kaOAuth.get(
        'http://www.khanacademy.org/api/v1/stories' +
        '?include_unpublished=1&casing=camel',
        secrets.kaAccessToken,
        secrets.kaAccessTokenSecret,
        function(e, data) {
            var dataObj = JSON.parse(data);
            dataObj.stories = _.filter(dataObj.stories, isProbablyNotSpam);
            res.send(dataObj);
        }
    );
});

// BigQuery stuff...

// record last table update time, so we can update only occasionally

var tableUpdateTimes = {};
var lastQueryTimes = {};
var resultCache = {};

function isStale(updateTime, expiryIntervalMs) {
    return (!updateTime ||
            moment(updateTime).isBefore(
                moment().subtract('ms', expiryIntervalMs)));
}

function refreshStaleTablesAndCall(tablename, expiryTimeMs, query, func) {
    var lastUpdateTime = null;
    var afterUpdateTimeIsKnown = function(time) {
        if (isStale(time, expiryTimeMs)) {
            queryExec(query, tablename);
            tableUpdateTimes[tablename] = undefined;
            func();
        } else {
            func();
        }
    };

    if (tableUpdateTimes[tablename]) {
        afterUpdateTimeIsKnown(tableUpdateTimes[tablename]);
    } else {
        getTableInfo(tablename, function(err, res) {
           if(err) {
               afterUpdateTimeIsKnown(null);
           } else {
               // Invalidate all caches if we're modifying the table update time
               resultCache[tablename] = {};
               var tableInfo = res;
               tableUpdateTimes[tablename] =
                   parseInt(tableInfo.lastModifiedTime);
               afterUpdateTimeIsKnown(tableUpdateTimes[tablename]);
           }
        });
    }
}

function readCachedOrFetchResults(tableName, requestId, res, formatter) {
    resultCache[tableName] = resultCache[tableName] || {};
    if (resultCache[tableName][requestId]) {
        res.send(resultCache[tableName][requestId]);
    } else {
        readResults(tableName, 100000, 0, function(err, bqRes) {
            if (err) {
                res.send({});
            } else {
                var result = formatter(bqRes);
                resultCache[tableName][requestId] = result;
                res.send(resultCache[tableName][requestId]);
            }
        });
    }
};

var bqDataset = "dashboard_stats";

// Execute a query
// Sends err, results to the provided callback [optional].
// Note that these results will be the response from bigquery and not the
// actual computed results.
var queryExec = function(query, destinationTable, callback) {
    // Don't run a query more often than every 2 minutes.
    // This is needed so that quick-updating widgets don't spawn multiple
    // copies of the same query while waiting for the result.
    //
    // TODO(colin): actually save the prior job ID and see if the query is
    // active.
    if (lastQueryTimes[query] &&
        moment().isBefore(lastQueryTimes[query].add('minutes', '2'))){
        callback && callback("Querying too rapidly!", null);
        return;
    }
    lastQueryTimes[query] = moment();

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

app.get('/registrations', function(req, res) {
    var tableName = "registrations";
    var query = "\
        SELECT activity_month, registrations\
        FROM [latest_derived.company_goals]\
    ";
    var requestId = tableName;
    var twoDaysMSec = 60*60*24*2*1000;

    var formatter = function(bqRes){
        var registrations = {};
        _.each(bqRes.rows, function(row) {
            registrations[row.f[0].v] = row.f[1].v;
        });
        return {registrations: registrations};
    };

    var resultFunc = function() {
        readCachedOrFetchResults(tableName, requestId, res, formatter);
    };

    refreshStaleTablesAndCall(tableName, twoDaysMSec, query, resultFunc);
});

app.get('/error_counts', function(req, res) {
    var tableName = "error_counts";
    var rangeEnd = moment().format("'YYYY-MM-DD'");
    var rangeStart = moment().subtract('days', 2).format("'YYYY-MM-DD'");
    var query = "\
        SELECT\
            COUNT(1) AS error_count,\
            INTEGER(FLOOR(status/100)) as code,\
            INTEGER(FLOOR(start_time/3600)) as time_bin\
        FROM TABLE_DATE_RANGE(logs.requestlogs_,\
            TIMESTAMP(" + rangeStart + "), TIMESTAMP(" + rangeEnd + "))\
        WHERE FLOOR(status/100) > 3\
        GROUP BY code, time_bin\
    ";
    var requestId = tableName;
    var hourMSec = 30*60*1000;

    var formatter = function(bqRes) {
        var errors = {};
        _.each(bqRes.rows, function(row) {
            errors[row.f[2].v] = errors[row.f[2].v] || {};
            errors[row.f[2].v][row.f[1].v] = row.f[0].v;
        });
        return {errors: errors};
    };

    var resultFunc = function() {
        readCachedOrFetchResults(tableName, requestId, res, formatter);
    };

    refreshStaleTablesAndCall(tableName, hourMSec, query, resultFunc);
});


// Get Twitter search results for @khanacademy
app.get('/tweets', function(req, res) {
    var oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        secrets.twitterConsumerKey,
        secrets.twitterConsumerSecret,
        '1.0A',
        null,
        'HMAC-SHA1'
    );
    oauth.get(
        'https://api.twitter.com/1.1/search/tweets.json?q=%40khanacademy',
        secrets.twitterAccessToken,
        secrets.twitterAccessTokenSecret,
        function(e, data) {
            res.send(JSON.parse(data));
        }
    );
});


// Get recent bigbingo experiments
app.get('/recent_experiments', function(req, res) {
    kaOAuth.get(
        'http://www.khanacademy.org/api/v1/bigbingo/experiments',
        secrets.kaAccessToken,
        secrets.kaAccessTokenSecret,
        function(e, data) {
            res.send(JSON.parse(data));
        }
    );
});

// Returns info about the last deploy-via-multijob build
app.get('/deploy', function(req, res) {
    var options = {
        hostname: 'jenkins.khanacademy.org',
        path: '/job/deploy-via-multijob/lastBuild/api/json',
        auth: secrets.jenkinsUserId + ':' + secrets.jenkinsAPIToken
    };
    http.get(options, function(response) {
        var str = '';
        response.on('data', function(chunk) {
            str += chunk;
        });
        response.on('end', function(chunk) {
            res.send(JSON.parse(str));
        });
    });
});

app.listen(3000);
