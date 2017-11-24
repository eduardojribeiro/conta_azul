define [
	'jquery'
	'backbone'
	'text!templates/NewCarTemplate.html'
], ($, Backbone, NewCarTemplate) ->

	class NewCarView extends Backbone.View
		template: _.template NewCarTemplate
		tagName: "form"

		events: 
			"submit": "submit"

		submit: ->
			alert("submit")

		render: ->
			@$el.html @template()
			@