/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var data = {'results': []};
var fs = require('fs');

var index = fs.readFileSync('../client/index.html');
var jq = fs.readFileSync('../client/bower_components/jquery/dist/jquery.js');
var bb = fs.readFileSync('../client/bower_components/backbone/backbone.js');
var us = fs.readFileSync('../client/bower_components/underscore/underscore.js');
var app = fs.readFileSync('../client/app.js');
var css = fs.readFileSync('../client/styles/styles.css');

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  //look up request.url and see if file with that url exists
  //if file doesn't exist, return statusCode = 404
  //if file does exist, open file and append json data to it

  if (request.url === '/') {
    response.writeHeader(200, {'Content-Type': 'text/html'});
    response.write(index);
    response.end();
  }

  if (request.url === '/bower_components/jquery/dist/jquery.js') {
    response.writeHeader(200, {'Content-Type': 'text/javascript'});
    response.write(jq);
    response.end();
  }

  if (request.url === '/bower_components/underscore/underscore.js') {
    response.writeHeader(200, {'Content-Type': 'text/javascript'});
    response.write(us);
    response.end();
  }

  if (request.url === '/bower_components/backbone/backbone.js') {
    response.writeHeader(200, {'Content-Type': 'text/javascript'});
    response.write(bb);
    response.end();
  }

  if (request.url === '/app.js') {
    response.writeHeader(200, {'Content-Type': 'text/javascript'});
    response.write(app);
    response.end();
  }

  if (request.url === '/styles/styles.css') {
    response.writeHeader(200, {'Content-Type': 'text/css'});
    response.write(css);
    response.end();
  }
  var mesReg = /\/messages\/.*/;
  
  if (request.url.match(mesReg) && request.method === 'GET') {
    response.writeHeader(200, {'Content-Type': 'text/json'});
    response.write(JSON.stringify(data));
    response.end();
  }

  if (request.url.match(mesReg) && request.method === 'POST') {
    var mes = '';
    response.writeHeader(201, {'Content-Type': 'text/json'});
    request.on('data', function(chunk) {
      mes += chunk;
    });
    request.on('end', function() {
      var parsed = JSON.parse(mes);
      console.log('PARSED MESSAGE -------->>>>>>', parsed);
      data.results.push({
        username: parsed.username,
        text: parsed.text,
        id: Math.floor(Math.random() * 1000)
      });
    });
    console.log(data);
    response.end();
  }

  // The outgoing status.
  var statusCode = 200;

  console.log(request.url);
  var urlReg = /classes\.*/;

  if (!request.url.match(urlReg)) {
    statusCode = 404;
  }

  //****
  var requestMethod = request.method;
  var mes = '';

  // if (requestMethod === 'POST') {
  //   statusCode = 201;
  //   request.on('data', function(chunk) {
  //     mes += chunk;
  //   });
  //   request.on('end', function(end) {
  //     var parsed = JSON.parse(mes);
  //     data.results.push({
  //       username: parsed.username,
  //       message: parsed.message
  //     });
  //   });

  // }

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = "text/plain";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // data.results = results;
  // response.end(JSON.stringify(data));
  // response.end("Hello, World!");
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.requestHandler = requestHandler;

