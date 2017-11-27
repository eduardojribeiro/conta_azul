(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['jquery', 'backbone'], function($, Backbone) {
    var AppView, TEMPLATE;
    TEMPLATE = "<header>\n	<div class=\"container-logo\">\n		<a href=\"#\"><img src=\"images/logo.png\" /></a>\n	</div>\n</header>\n<main></main>";
    return AppView = (function(superClass) {
      extend(AppView, superClass);

      function AppView() {
        return AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.el = ".page";

      AppView.prototype.render = function() {
        return this.$el.html(_.template(TEMPLATE));
      };

      return AppView;

    })(Backbone.View);
  });

}).call(this);
