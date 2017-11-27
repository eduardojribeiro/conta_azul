(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['jquery', 'backbone', 'services', 'text!templates/CarsTemplate.html', 'text!templates/LineTemplate.html', 'text!templates/TableTemplate.html'], function($, Backbone, Services, CarsTemplate, LineTemplate, TableTemplate) {
    var CarModel, CarsCollection, CarsView, LineView, TableView;
    CarModel = (function(superClass) {
      extend(CarModel, superClass);

      function CarModel() {
        return CarModel.__super__.constructor.apply(this, arguments);
      }

      CarModel.prototype.idAttribute = "id";

      CarModel.prototype.defaults = function() {
        return {
          id: null,
          combustivel: "",
          imagem: "",
          marca: "",
          modelo: "",
          placa: "",
          valor: "",
          selecionado: false
        };
      };

      return CarModel;

    })(Backbone.Model);
    CarsCollection = (function(superClass) {
      extend(CarsCollection, superClass);

      function CarsCollection() {
        return CarsCollection.__super__.constructor.apply(this, arguments);
      }

      CarsCollection.prototype.model = CarModel;

      return CarsCollection;

    })(Backbone.Collection);
    TableView = (function(superClass) {
      extend(TableView, superClass);

      function TableView() {
        return TableView.__super__.constructor.apply(this, arguments);
      }

      TableView.prototype.template = _.template(TableTemplate);

      TableView.prototype.tagName = "table";

      TableView.prototype.keyword = "";

      TableView.prototype.page = 0;

      TableView.prototype.initialize = function() {
        this.cars = new CarsCollection();
        return this.listenTo(this.cars, "remove", this.removeLineView, this);
      };

      TableView.prototype.removeSelected = function() {
        return this.$("input:checked").each((function(_this) {
          return function(i, input) {
            return _this.removeItem($(input).attr('value'));
          };
        })(this));
      };

      TableView.prototype.removeItem = function(id) {
        var promise;
        promise = Services.Cars["delete"]({
          data: {
            id: id
          }
        });
        return promise.done((function(_this) {
          return function() {
            return _this.cars.remove(id);
          };
        })(this));
      };

      TableView.prototype.removeLineView = function(model) {
        var ref;
        return (ref = model.get('view')) != null ? ref.remove() : void 0;
      };

      TableView.prototype.findByText = function(value) {
        this.keyword = value;
        return this.render();
      };

      TableView.prototype.goToPage = function(page) {
        this.page = page - 1;
        return this.render();
      };

      TableView.prototype.createLineView = function(model) {
        return new LineView({
          model: model
        });
      };

      TableView.prototype.prepareToRender = function(next, cancel) {
        if (!this.keyword) {
          return Services.Cars.get({
            data: {
              page: this.page
            }
          }).done(function(data) {
            return next(data.result);
          });
        } else {
          return Services.Cars.findByText({
            data: {
              keyword: this.keyword
            }
          }).done(function(data) {
            return next(data.result);
          });
        }
      };

      TableView.prototype.render = function() {
        this.prepareToRender((function(_this) {
          return function(data) {
            _this.cars.set(data);
            _this.$el.html(_this.template());
            return _this.cars.each(function(model) {
              var lineView;
              lineView = _this.createLineView(model);
              model.set("view", lineView);
              return _this.$('tbody').append(lineView.render().$el);
            });
          };
        })(this));
        return this;
      };

      return TableView;

    })(Backbone.View);
    LineView = (function(superClass) {
      extend(LineView, superClass);

      function LineView() {
        return LineView.__super__.constructor.apply(this, arguments);
      }

      LineView.prototype.tagName = "tr";

      LineView.prototype.className = "line";

      LineView.prototype.template = _.template(LineTemplate);

      LineView.prototype.events = {
        "checked": "checked"
      };

      LineView.prototype.attribute = function() {
        return {
          "data-id": this.model.get('placa')
        };
      };

      LineView.prototype.checked = function() {
        throw new Error("Recurso ainda não implementado!");
      };

      LineView.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      return LineView;

    })(Backbone.View);
    return CarsView = (function(superClass) {
      extend(CarsView, superClass);

      function CarsView() {
        return CarsView.__super__.constructor.apply(this, arguments);
      }

      CarsView.prototype.template = _.template(CarsTemplate);

      CarsView.prototype.events = {
        "click .new-car": "clickNewCar",
        "click .delete-car": "clickDeleteCar",
        "submit .form-search": "submitSearch",
        "click .page": "goToPage"
      };

      CarsView.prototype.initialize = function() {
        return this.tableView = new TableView();
      };

      CarsView.prototype.clickNewCar = function(event) {
        return Backbone.history.navigate('newcar', {
          trigger: true,
          history: true
        });
      };

      CarsView.prototype.clickDeleteCar = function(event) {
        var id;
        if (window.confirm("Deseja realmente remover o veículo?")) {
          id = $(event.target).closest('.line').data('id');
          return this.tableView.removeSelected();
        }
      };

      CarsView.prototype.submitSearch = function() {
        this.tableView.findByText(this.$('.input-search').val());
        return false;
      };

      CarsView.prototype.goToPage = function(event) {
        return this.tableView.goToPage($(event.target).text());
      };

      CarsView.prototype.render = function() {
        this.$el.html(this.template());
        this.$(".container").html(this.tableView.render().$el);
        return this;
      };

      return CarsView;

    })(Backbone.View);
  });

}).call(this);
