// Some APIs (such as GitHub) require a user-agent header.
var USER_AGENT = 'khan-dashboard-hack';
var secrets = require('./secrets.js');

var express = require('express');
var app = express();

// Enable CORS
var cors = require('cors');
app.use(cors());

var https = require('https');

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

app.listen(3000);
