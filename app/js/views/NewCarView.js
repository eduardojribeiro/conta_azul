(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['jquery', 'backbone', 'services', 'text!templates/NewCarTemplate.html'], function($, Backbone, Services, NewCarTemplate) {
    var NewCarView;
    return NewCarView = (function(superClass) {
      extend(NewCarView, superClass);

      function NewCarView() {
        return NewCarView.__super__.constructor.apply(this, arguments);
      }

      NewCarView.prototype.template = _.template(NewCarTemplate);

      NewCarView.prototype.tagName = "form";

      NewCarView.prototype.events = {
        "a.btn.btn-red.cancel": "cancel",
        "submit": "submit"
      };

      NewCarView.prototype.submit = function() {
        var formData, obj, promise;
        obj = {};
        formData = this.$el.serializeArray();
        _(formData).each(function(item) {
          return obj[item.name] = item.value;
        });
        promise = Services.Cars.put({
          data: obj
        });
        promise.done((function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this));
        return false;
      };

      NewCarView.prototype.cancel = function() {
        return Backbone.history.navigate("/", {
          trigger: true,
          history: true
        });
      };

      NewCarView.prototype.render = function() {
        this.$el.html(this.template());
        return this;
      };

      return NewCarView;

    })(Backbone.View);
  });

}).call(this);
