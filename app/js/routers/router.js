(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['jquery', 'backbone', 'views/AppView', 'views/CarsView'], function($, Backbone, AppView, CarsView) {
    var Router;
    return Router = (function(superClass) {
      extend(Router, superClass);

      function Router() {
        return Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.routes = {
        '*actions': 'defaultAction'
      };

      Router.prototype.initialize = function() {
        var appView;
        appView = new AppView();
        return appView.render();
      };

      Router.prototype.defaultAction = function() {
        var carsView;
        carsView = new CarsView();
        return $('main').html(carsView.render().$el);
      };

      return Router;

    })(Backbone.Router);
  });

}).call(this);
