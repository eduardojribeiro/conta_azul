define [
	'jquery'
	'backbone'
], ($, Backbone) ->
	
	class TodoRouter extends Backbone.Router
		routes: '/': 'default'
		default: ->
			alert 123