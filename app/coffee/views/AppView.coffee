define [
	'jquery'
	'backbone'
], ($, Backbone) ->

	TEMPLATE = """
		<header>
			<div class="container-logo">
				<!-- <a href="#"><img src="images/logo.png" /></a> -->
			</div>
		</header>
		<main></main>
	"""

	class AppView extends Backbone.View
		el: ".page"
				
		render: ->
			@$el.html _.template TEMPLATE