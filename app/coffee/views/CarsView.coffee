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
		currentPage: 0
		pages: null

		initialize: ->
			@cars = new CarsCollection()
			@listenTo @cars, "remove", @removeLineView, @

		removeSelected: ->
			@$(".line input:checked").each (i, input) =>
				@removeItem $(input).attr('value')

		isSelectedItems: ->
			return !!@$(".line input:checked").length

		removeItem: (id) ->
			promise = Services.Cars.delete(data: id: id)
			promise.done =>
				@cars.remove(id)

		removeLineView: (model) ->
			model.get('view')?.remove()
			if @cars.isEmpty()
				@render()

		findByText: (value) ->
			@keyword = value
			@render()

		goToPage: (currentPage) ->
			@currentPage = currentPage - 1
			@render()

		createLineView: (model) ->
			return new LineView(model: model)

		prepareToRender: (next, cancel) ->
			unless @keyword
				Services.Cars.get(data: page: @currentPage)
					.done (data) ->
						next(data)
			else
				Services.Cars.findByText(data: keyword: @keyword)
					.done (data) ->
						next(data)

		render: ->
			@prepareToRender (data) =>
				if(data.result.length > 0)
					@pages = data.pages
					@cars.set data.result
					@$el.html @template()
				else
					@cars.reset()
					@$el.html "<p class='empty'>Nenhum resultado encontrado!</p>"

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
			"click": "toggleCheck"

		attribute: ->
			"data-id": @model.get('placa')

		toggleCheck: ->
			@$('input').prop('checked', !@$('input').is(":checked"))

		render: ->
			@$el.html @template(@model.toJSON())
			@

	class PagesView extends Backbone.View
		tagName: "ul"
		className: "pages"
		template: _.template """
			<li><a class='arrow-left'></a></li>	
			<% for(i = 1; i <= pages; ++i){ %>
				<% if(i == (currentPage + 1)){ print("<li class='active'>"); }else{ print("<li>"); } %>
					<a class='page'><%= i %></a>
				</li>
			<% } %>
			<li><a class='arrow-right'></a></li>

		"""
		currentPage: null
		pages: null

		events: 
			"click .page": "goToPage"
			"click .arrow-left": "goToFirstPage"
			"click .arrow-right": "goToLastPage"

		definePages: (params) ->
			@currentPage = params.currentPage
			@pages = params.pages
			@render()

		goToFirstPage: ->
			@trigger('goToPage', 0)

		goToLastPage: ->
			@trigger('goToPage', @pages)

		goToPage: (event) ->
			page = $(event.target).text()
			@trigger('goToPage', page)

		render: ->
			if @pages > 1
				@$el.html @template(pages: @pages, currentPage: @currentPage)
			@

	class CarsView extends Backbone.View
		template: _.template CarsTemplate
		
		events:
			"click .new-car": "clickNewCar"
			"click .delete-car": "clickDeleteCar"
			"submit .form-search": "submitSearch"
		
		initialize: ->
			@tableView = new TableView()
			@pagesView = new PagesView()

			@tableView.cars.on "update", =>
				currentPage = @tableView.currentPage
				pages = @tableView.pages
				@pagesView.definePages(currentPage: currentPage, pages: pages)

			@pagesView.on "goToPage", (currentPage) =>
				@tableView.goToPage(currentPage)

		clickNewCar: (event) ->
			Backbone.history.navigate 'newcar', trigger: true, history: true

		clickDeleteCar: (event) ->
			unless @tableView.isSelectedItems()
				alert("Nenhum item foi selecionado!")
			else
				if window.confirm("Deseja realmente remover o veículo?")
					@tableView.removeSelected()
		
		submitSearch: ->
			@tableView.findByText(@$('.input-search').val())
			return false

		render: ->
			@$el.html @template()
			@$(".container").html @tableView.render().$el
			@$('.pagination').html @pagesView.render().$el
			@