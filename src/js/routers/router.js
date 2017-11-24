(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['jquery', 'backbone'], function($, Backbone) {
    var TodoRouter;
    return TodoRouter = (function(superClass) {
      extend(TodoRouter, superClass);

      function TodoRouter() {
        return TodoRouter.__super__.constructor.apply(this, arguments);
      }

      TodoRouter.prototype.routes = {
        '/': 'default'
      };

      TodoRouter.prototype["default"] = function() {
        return alert(123);
      };

      return TodoRouter;

    })(Backbone.Router);
  });

}).call(this);
