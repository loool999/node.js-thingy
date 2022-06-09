import Server from 'bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';

const bare = new Server('/bare/', '');

const serve = new nodeStatic.Server('static/');
const fakeServe = new nodeStatic.Server('fakeStatic/');

const server = http.createServer();

server.on('request', (request, response) => {
  const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  var isLS = ip.startsWith('192.168.0.10') || ip.startsWith('192.168.0.10') || ip.startsWith('192.168.0.10') || ip.startsWith('192.168.0.10') || ip.startsWith('192.168.0.10');

  if (isLS)
    fakeServe.serve(request, response);
  else {
    if (bare.route_request(request, response))
      return true;
  
    serve.serve(request, response);
  }
});

server.on('upgrade', (req, socket, head) => {
	if (bare.route_upgrade(req, socket, head))
        return;
	socket.end();
});

server.listen(8080);
