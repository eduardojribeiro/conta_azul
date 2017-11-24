define [
	'jquery'
	'backbone'
	'text!templates/CarsTemplate.html'
	'text!templates/LineTemplate.html'
	'text!templates/TableTemplate.html'
], ($, Backbone, CarsTemplate, LineTemplate, TableTemplate) ->

	class CarModel extends Backbone.Model
		idAttribute: "placa"
		defaults: ->
			combustivel: ""
			imagem: ""
			marca: ""
			modelo: ""
			placa: ""
			valor: ""
			selecionado: false

	class CarsCollection extends Backbone.Collection
		model: CarModel

		findByText: (value) ->
			console.log @constructor.name, "findByText", value

	class TableView extends Backbone.View
		template: _.template TableTemplate
		tagName: "table"

		initialize: ->
			@cars = new CarsCollection(carros)

			@listenTo @cars, "remove", @removeLineView, @

		removeItem: (id) ->
			@cars.remove(id)

		removeLineView: (model) ->
			model.get('view')?.remove()

		findByText: ->
			@cars.findByText(id)

		createLineView: (model) ->
			return new LineView(model: model)

		render: ->
			@$el.html @template()
			@cars.each (model) =>
				lineView = @createLineView(model)
				model.set "view", lineView
				@$('tbody').append lineView.render().$el
			@


	class LineView extends Backbone.View
		tagName: "tr"
		className: "line"
		template: _.template LineTemplate

		events:
			"checked": "checked"

		attribute: ->
			"data-id": @model.get('placa')

		checked: ->
			return throw new Error("Recurso ainda não implementado!")

		render: ->
			@$el.html @template(@model.toJSON())
			@

	class CarsView extends Backbone.View
		template: _.template CarsTemplate
		
		events:
			"click .new-car": "clickNewCar"
			"click .delete-car": "clickDeleteCar"
			"click .btn-search": "clickSearch"

		initialize: ->
			@tableView = new TableView()

		clickNewCar: (event) ->
			Backbone.history.navigate 'new-car'

		clickDeleteCar: (event) ->
			if window.confirm("Deseja realmente remover o veículo?")
				id = $(event.target).closest('.line').data('id')
				@tableView.removeItem(id)

		clickSearch: (event) ->
			value = @$('.input-search').text()
			@tableView.findByText(value)

		render: ->
			@$el.html @template()
			@$(".container").html @tableView.render().$el
			@