(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['jquery', 'backbone', 'services', 'text!templates/CarsTemplate.html', 'text!templates/LineTemplate.html', 'text!templates/TableTemplate.html'], function($, Backbone, Services, CarsTemplate, LineTemplate, TableTemplate) {
    var CarModel, CarsCollection, CarsView, LineView, PagesView, TableView;
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

      TableView.prototype.currentPage = 0;

      TableView.prototype.pages = null;

      TableView.prototype.initialize = function() {
        this.cars = new CarsCollection();
        return this.listenTo(this.cars, "remove", this.removeLineView, this);
      };

      TableView.prototype.removeSelected = function() {
        return this.$(".line input:checked").each((function(_this) {
          return function(i, input) {
            return _this.removeItem($(input).attr('value'));
          };
        })(this));
      };

      TableView.prototype.isSelectedItems = function() {
        return !!this.$(".line input:checked").length;
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
        if ((ref = model.get('view')) != null) {
          ref.remove();
        }
        if (this.cars.isEmpty()) {
          return this.render();
        }
      };

      TableView.prototype.findByText = function(value) {
        this.keyword = value;
        return this.render();
      };

      TableView.prototype.goToPage = function(currentPage) {
        this.currentPage = currentPage - 1;
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
              page: this.currentPage
            }
          }).done(function(data) {
            return next(data);
          });
        } else {
          return Services.Cars.findByText({
            data: {
              keyword: this.keyword
            }
          }).done(function(data) {
            return next(data);
          });
        }
      };

      TableView.prototype.render = function() {
        this.prepareToRender((function(_this) {
          return function(data) {
            if (data.result.length > 0) {
              _this.pages = data.pages;
              _this.cars.set(data.result);
              _this.$el.html(_this.template());
            } else {
              _this.cars.reset();
              _this.$el.html("<p class='empty'>Nenhum resultado encontrado!</p>");
            }
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
        "click": "toggleCheck"
      };

      LineView.prototype.attribute = function() {
        return {
          "data-id": this.model.get('placa')
        };
      };

      LineView.prototype.toggleCheck = function() {
        return this.$('input').prop('checked', !this.$('input').is(":checked"));
      };

      LineView.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      };

      return LineView;

    })(Backbone.View);
    PagesView = (function(superClass) {
      extend(PagesView, superClass);

      function PagesView() {
        return PagesView.__super__.constructor.apply(this, arguments);
      }

      PagesView.prototype.tagName = "ul";

      PagesView.prototype.className = "pages";

      PagesView.prototype.template = _.template("<li><a class='arrow-left'></a></li>	\n<% for(i = 1; i <= pages; ++i){ %>\n	<% if(i == (currentPage + 1)){ print(\"<li class='active'>\"); }else{ print(\"<li>\"); } %>\n		<a class='page'><%= i %></a>\n	</li>\n<% } %>\n<li><a class='arrow-right'></a></li>\n");

      PagesView.prototype.currentPage = null;

      PagesView.prototype.pages = null;

      PagesView.prototype.events = {
        "click .page": "goToPage",
        "click .arrow-left": "goToFirstPage",
        "click .arrow-right": "goToLastPage"
      };

      PagesView.prototype.definePages = function(params) {
        this.currentPage = params.currentPage;
        this.pages = params.pages;
        return this.render();
      };

      PagesView.prototype.goToFirstPage = function() {
        return this.trigger('goToPage', 0);
      };

      PagesView.prototype.goToLastPage = function() {
        return this.trigger('goToPage', this.pages);
      };

      PagesView.prototype.goToPage = function(event) {
        var page;
        page = $(event.target).text();
        return this.trigger('goToPage', page);
      };

      PagesView.prototype.render = function() {
        if (this.pages > 1) {
          this.$el.html(this.template({
            pages: this.pages,
            currentPage: this.currentPage
          }));
        }
        return this;
      };

      return PagesView;

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
        "submit .form-search": "submitSearch"
      };

      CarsView.prototype.initialize = function() {
        this.tableView = new TableView();
        this.pagesView = new PagesView();
        this.tableView.cars.on("update", (function(_this) {
          return function() {
            var currentPage, pages;
            currentPage = _this.tableView.currentPage;
            pages = _this.tableView.pages;
            return _this.pagesView.definePages({
              currentPage: currentPage,
              pages: pages
            });
          };
        })(this));
        return this.pagesView.on("goToPage", (function(_this) {
          return function(currentPage) {
            return _this.tableView.goToPage(currentPage);
          };
        })(this));
      };

      CarsView.prototype.clickNewCar = function(event) {
        return Backbone.history.navigate('newcar', {
          trigger: true,
          history: true
        });
      };

      CarsView.prototype.clickDeleteCar = function(event) {
        if (!this.tableView.isSelectedItems()) {
          return alert("Nenhum item foi selecionado!");
        } else {
          if (window.confirm("Deseja realmente remover o veículo?")) {
            return this.tableView.removeSelected();
          }
        }
      };

      CarsView.prototype.submitSearch = function() {
        this.tableView.findByText(this.$('.input-search').val());
        return false;
      };

      CarsView.prototype.render = function() {
        this.$el.html(this.template());
        this.$(".container").html(this.tableView.render().$el);
        this.$('.pagination').html(this.pagesView.render().$el);
        return this;
      };

      return CarsView;

    })(Backbone.View);
  });

}).call(this);
