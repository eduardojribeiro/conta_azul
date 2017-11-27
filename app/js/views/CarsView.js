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

      CarModel.prototype.idAttribute = "placa";

      CarModel.prototype.defaults = function() {
        return {
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

      CarsCollection.prototype.findByText = function(value) {
        return console.log(this.constructor.name, "findByText", value);
      };

      return CarsCollection;

    })(Backbone.Collection);
    TableView = (function(superClass) {
      extend(TableView, superClass);

      function TableView() {
        return TableView.__super__.constructor.apply(this, arguments);
      }

      TableView.prototype.template = _.template(TableTemplate);

      TableView.prototype.tagName = "table";

      TableView.prototype.initialize = function() {
        this.cars = new CarsCollection();
        return this.listenTo(this.cars, "remove", this.removeLineView, this);
      };

      TableView.prototype.removeItem = function(id) {
        return this.cars.remove(id);
      };

      TableView.prototype.removeLineView = function(model) {
        var ref;
        return (ref = model.get('view')) != null ? ref.remove() : void 0;
      };

      TableView.prototype.findByText = function() {
        return this.cars.findByText(id);
      };

      TableView.prototype.createLineView = function(model) {
        return new LineView({
          model: model
        });
      };

      TableView.prototype.prepareToRender = function(next, cancel) {
        var promise;
        promise = Services.Cars.get();
        return promise.done(function(dados) {
          return next(dados.result);
        });
      };

      TableView.prototype.render = function() {
        this.prepareToRender((function(_this) {
          return function(dados) {
            _this.cars.set(dados);
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
        "click .btn-search": "clickSearch"
      };

      CarsView.prototype.initialize = function() {
        return this.tableView = new TableView();
      };

      CarsView.prototype.clickNewCar = function(event) {
        return Backbone.history.navigate('new-car');
      };

      CarsView.prototype.clickDeleteCar = function(event) {
        var id;
        if (window.confirm("Deseja realmente remover o veículo?")) {
          id = $(event.target).closest('.line').data('id');
          return this.tableView.removeItem(id);
        }
      };

      CarsView.prototype.clickSearch = function(event) {
        var value;
        value = this.$('.input-search').text();
        return this.tableView.findByText(value);
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
