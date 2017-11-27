define [
	'jquery'
	'backbone'
	'views/AppView'
], ($, Backbone, AppView, CarsView) ->
	
	class Router extends Backbone.Router
		routes: 
			'newcar': 'newCar'
			'/': 'defaultAction'
			'*actions': 'defaultAction'
		
		initialize: ->
			appView = new AppView()
			appView.render()

		newCar: ->
			require ['views/NewCarView'], (NewCarView) ->
				newCarView = new NewCarView()
				$('main').html newCarView.render().$el

		defaultAction: ->
			require ['views/CarsView'], (CarsView) ->
				carsView = new CarsView()
				$('main').html carsView.render().$el