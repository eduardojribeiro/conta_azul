require.config
	shim:
		underscore: exports: '_'
		backbone:
			deps: [
				'underscore'
				'jquery'
			]
			exports: 'Backbone'
		backboneLocalstorage:
			deps: [ 'backbone' ]
			exports: 'Store'
	
	paths:
		jquery: '../js/libs/jquery'
		underscore: '../js/libs/underscore-min'
		backbone: '../js/libs/backbone-min'
		text: '../js/libs/text'

require [
	'backbone'
	'views/AppView'
	'routers/router'
], (Backbone, AppView, Router) ->

	router = new Router()
	Backbone.history.start()
	appView = new AppView()