(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(function() {
    var Cars, Services, XHR;
    XHR = (function() {
      function XHR() {}

      XHR.prototype.url = null;

      XHR.prototype.send = function(params) {
        var url;
        if (params == null) {
          params = {
            url: "",
            data: {}
          };
        }
        url = params.url || this.url;
        return $.ajax({
          url: url,
          data: params.data,
          context: document.body,
          dataType: 'json',
          type: params.type
        });
      };

      return XHR;

    })();
    Services = (function(superClass) {
      extend(Services, superClass);

      function Services() {
        return Services.__super__.constructor.apply(this, arguments);
      }

      Services.prototype.get = function(params) {
        var promise;
        if (params == null) {
          params = {};
        }
        params = _.extend(params, {
          type: "GET"
        });
        return promise = this.send(params);
      };

      Services.prototype.post = function(params) {
        var promise;
        if (params == null) {
          params = {};
        }
        params = _.extend(params, {
          type: "POST"
        });
        return promise = this.send(params);
      };

      Services.prototype.put = function(params) {
        var promise;
        if (params == null) {
          params = {};
        }
        params = _.extend(params, {
          type: "PUT"
        });
        return promise = this.send(params);
      };

      Services.prototype["delete"] = function(params) {
        var promise;
        if (params == null) {
          params = {};
        }
        params = _.extend(params, {
          type: "DELETE"
        });
        return promise = this.send(params);
      };

      return Services;

    })(XHR);
    Cars = (function(superClass) {
      extend(Cars, superClass);

      function Cars() {
        return Cars.__super__.constructor.apply(this, arguments);
      }

      Cars.prototype.url = "http://localhost:3000/api";

      Cars.prototype.findByText = function(params) {
        var promise;
        params.url = this.url + "/find";
        return promise = this.get(params);
      };

      return Cars;

    })(Services);
    return {
      Cars: new Cars
    };
  });

}).call(this);
