'use strict';

const GenericApp = require('./generic-app');
const utils = require('./utils');

const trans_websocket = require('./trans-websocket');
const trans_jsonp = require('./trans-jsonp');
const trans_xhr = require('./trans-xhr');
const iframe = require('./iframe');
const trans_eventsource = require('./trans-eventsource');
const trans_htmlfile = require('./trans-htmlfile');
const info = require('./info');

class App extends GenericApp {
  constructor(options, emit) {
    super(options, emit);
  }

  welcome_screen(req, res) {
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.writeHead(200);
    res.end('Welcome to SockJS!\n');
  }

  handle_404(req, res) {
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.writeHead(404);
    res.end('404 Error: Page not found\n');
  }

  h_sid(req, res, _head, next) {
    // Some load balancers do sticky sessions, but only if there is
    // a JSESSIONID cookie. If this cookie isn't yet set, we shall
    // set it to a dummy value. It doesn't really matter what, as
    // session information is usually added by the load balancer.
    req.cookies = utils.parseCookie(req.headers.cookie);
    if (typeof this.options.jsessionid === 'function') {
      // Users can supply a function
      this.options.jsessionid(req, res);
    } else if (this.options.jsessionid) {
      // We need to set it every time, to give the loadbalancer
      // opportunity to attach its own cookies.
      const jsid = req.cookies['JSESSIONID'] || 'dummy';
      res.setHeader('Set-Cookie', `JSESSIONID=${jsid}; path=/`);
    }
    next();
  }
}

Object.assign(App.prototype,
  iframe,
  info,
  trans_websocket,
  trans_jsonp,
  trans_xhr,
  trans_eventsource,
  trans_htmlfile
);

module.exports = App;
