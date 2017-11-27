define [
	'jquery'
	'backbone'
	'services'
	'text!templates/NewCarTemplate.html'
], ($, Backbone, Services, NewCarTemplate) ->

	class NewCarView extends Backbone.View
		template: _.template NewCarTemplate
		tagName: "form"

		events: 
			"a.btn.btn-red.cancel": "cancel"
			"submit": "submit"

		submit: ->
			obj = {}
			formData = @$el.serializeArray()
			_(formData).each (item) ->
				obj[item.name] = item.value

			promise = Services.Cars.put(data: obj)
			promise.done =>
				@cancel()
			return false

		cancel: ->
			Backbone.history.navigate "/", trigger: true, history: true

		render: ->
			@$el.html @template()
			@