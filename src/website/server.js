var express = require('express');
var app = express();
var httpProxy = require('http-proxy'),
    endpoint = {
        host: 'localhost',
        port: 3003,
        prefix: '/1.0'
    };
var proxy = new httpProxy.RoutingProxy();

app.use(express.static(__dirname + '/build'));
app.set('views', __dirname + '/');
app.set('view engine', 'jade');
app.set('view options', {
    layout: false,
    pretty: true
});

app.use(express.logger());

app.use(function(req, res, next) {
    req.headers.host = 'localhost';
    if (req.url.indexOf(endpoint.prefix) === 0) {
        proxy.proxyRequest(req, res, endpoint);
    } else {
        next();
    }

});

app.use(app.router);



app.get('*', function(req, res) {
    res.sendfile(__dirname + '/build/index.html');
});

app.listen(8000, function() {
    console.log('Listening server on port 8000');
});