// Generated by CoffeeScript 1.7.1
(function() {
  var Request, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.HTTPromiseFormat = {
    json: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      encode: function(data) {
        var str;
        try {
          str = JSON.stringify(data);
        } catch (_error) {}
        return str;
      },
      parse: function(xhr) {
        var data;
        try {
          data = JSON.parse(xhr.response);
        } catch (_error) {}
        return {
          data: data,
          xhr: xhr
        };
      }
    },
    formData: {
      encode: function(input) {
        var form;
        form = typeof input === 'string' ? document.querySelector(input) : input;
        return new FormData(form);
      },
      parse: function(xhr) {
        return {
          data: xhr.response,
          xhr: xhr
        };
      }
    }
  };

  root.HTTPromise = (function() {
    function HTTPromise(config) {
      if (config == null) {
        config = {};
      }
      this.config = config;
      this.type = config.type || 'json';
    }

    HTTPromise.prototype.get = function(url, params) {
      var k, q, qs, v;
      if (params) {
        q = [];
        for (k in params) {
          v = params[k];
          q.push("" + k + "=" + v);
        }
        qs = "?" + q.join('&');
        url = encodeURI(url + qs);
      }
      return this.request('get', url);
    };

    HTTPromise.prototype.post = function(url, data) {
      return this.request('post', url, data);
    };

    HTTPromise.prototype.put = function(url, data) {
      return this.request('put', url, data);
    };

    HTTPromise.prototype.patch = function(url, data) {
      return this.request('patch', url, data);
    };

    HTTPromise.prototype["delete"] = function(url, data) {
      return this.request('delete', url, data);
    };

    HTTPromise.prototype.request = function(method, url, data) {
      return new Request(this.type, method, url, data);
    };

    return HTTPromise;

  })();

  Request = (function() {
    function Request(type, method, url, data) {
      var format;
      format = HTTPromiseFormat[type];
      this.promise = new Promise(function(fulfill, reject) {
        var k, request, v, _ref;
        request = new XMLHttpRequest;
        request.onload = function() {
          return fulfill(format.parse(this));
        };
        request.onerror = function() {
          return reject({
            state: "ERROR",
            xhr: this
          });
        };
        request.onabort = function() {
          return reject({
            state: "ABORT",
            xhr: this
          });
        };
        request.ontimeout = function() {
          return reject({
            state: "TIMEOUT",
            xhr: this
          });
        };
        request.open(method.toUpperCase(), url, true);
        _ref = format.headers;
        for (k in _ref) {
          v = _ref[k];
          request.setRequestHeader(k, v);
        }
        if (data) {
          return request.send(format.encode(data));
        } else {
          return request.send();
        }
      });
    }

    Request.prototype.then = function(fn) {
      this.promise.then(function(r) {
        return fn(r.data, r.xhr);
      });
      return this;
    };

    Request.prototype.when = function(status, fn) {
      this.promise.then(function(r) {
        if (r.xhr.status === status) {
          return fn(r.data, r.xhr);
        }
      });
      return this;
    };

    Request.prototype.success = function(fn) {
      this.promise.then(function(r) {
        if (r.xhr.status >= 200 && r.xhr.status < 300) {
          return fn(r.data, r.xhr);
        }
      });
      return this;
    };

    Request.prototype.error = function(fn) {
      var fulfill, reject;
      fulfill = function(r) {
        if (r.xhr.status < 200 || r.xhr.status >= 300) {
          return fn(r);
        }
      };
      reject = function(r) {
        return fn(r);
      };
      this.promise.then(fulfill, reject);
      return this;
    };

    return Request;

  })();

}).call(this);
