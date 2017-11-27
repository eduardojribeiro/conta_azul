define [
	'jquery'
	'backbone'
	'services'
	'text!templates/CarsTemplate.html'
	'text!templates/LineTemplate.html'
	'text!templates/TableTemplate.html'
], ($, Backbone, Services, CarsTemplate, LineTemplate, TableTemplate) ->

	class CarModel extends Backbone.Model
		idAttribute: "id"
		defaults: ->
			id: null
			combustivel: ""
			imagem: ""
			marca: ""
			modelo: ""
			placa: ""
			valor: ""
			selecionado: false

	class CarsCollection extends Backbone.Collection
		model: CarModel

	class TableView extends Backbone.View
		template: _.template TableTemplate
		tagName: "table"

		keyword: ""
		page: 0

		initialize: ->
			@cars = new CarsCollection()
			@listenTo @cars, "remove", @removeLineView, @

		removeSelected: ->
			@$("input:checked").each (i, input) =>
				@removeItem $(input).attr('value')

		removeItem: (id) ->
			promise = Services.Cars.delete(data: id: id)
			promise.done =>
				@cars.remove(id)

		removeLineView: (model) ->
			model.get('view')?.remove()

		findByText: (value) ->
			@keyword = value
			@render()

		goToPage: (page) ->
			@page = page - 1
			@render()

		createLineView: (model) ->
			return new LineView(model: model)

		prepareToRender: (next, cancel) ->
			unless @keyword
				Services.Cars.get(data: page: @page)
					.done (data) ->
						next(data.result)
			else
				Services.Cars.findByText(data: keyword: @keyword)
					.done (data) ->
						next(data.result)

		render: ->
			@prepareToRender (data) =>
				@cars.set data
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
			"submit .form-search": "submitSearch"
			"click .page": "goToPage"

		initialize: ->
			@tableView = new TableView()

		clickNewCar: (event) ->
			Backbone.history.navigate 'newcar', trigger: true, history: true

		clickDeleteCar: (event) ->
			if window.confirm("Deseja realmente remover o veículo?")
				id = $(event.target).closest('.line').data('id')
				@tableView.removeSelected()
		
		submitSearch: ->
			@tableView.findByText(@$('.input-search').val())
			return false

		goToPage: (event) ->
			@tableView.goToPage($(event.target).text())
			
		render: ->
			@$el.html @template()
			@$(".container").html @tableView.render().$el
			@