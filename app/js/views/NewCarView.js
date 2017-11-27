(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['jquery', 'backbone', 'text!templates/NewCarTemplate.html'], function($, Backbone, NewCarTemplate) {
    var NewCarView;
    return NewCarView = (function(superClass) {
      extend(NewCarView, superClass);

      function NewCarView() {
        return NewCarView.__super__.constructor.apply(this, arguments);
      }

      NewCarView.prototype.template = _.template(NewCarTemplate);

      NewCarView.prototype.tagName = "form";

      NewCarView.prototype.events = {
        "submit": "submit"
      };

      NewCarView.prototype.submit = function() {
        return alert("submit");
      };

      NewCarView.prototype.render = function() {
        this.$el.html(this.template());
        return this;
      };

      return NewCarView;

    })(Backbone.View);
  });

}).call(this);
