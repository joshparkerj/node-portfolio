var http = require('http');
var fs = require('fs');
var path = require('path');

const messages = require('./messages.json');

http.createServer(function (request, response) {
    console.log('request ', request.url);
	
	var serverPaths = ['/contact-submit'];
	
	if (serverPaths.includes(request.url)){
		switch (request.url){
			case '/contact-submit':
				let body = [];
				request.on('data',chunk => body.push(chunk))
				.on('end',() => {
					body = Buffer.concat(body).toString();
					console.log(body);
					const message = JSON.parse(body);
					messages.push(message);
					fs.writeFile('./messages.json',JSON.stringify(messages),err => {
						if (err) response.statusCode = 500;
						else response.statusCode = 201;
						response.end();
					})
				});
				break;
			default:
				response.statusCode = 500;
				response.end();
				break;
		}
	} else {
	
    var filePath = './static' + request.url;
    if (filePath == './static/') {
        filePath = './static/index.html';
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./static/404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
	}
}).listen(3004);
console.log('Server running at http://127.0.0.1:3004/');
