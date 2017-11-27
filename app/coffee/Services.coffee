define ->

	class XHR 
		url: null
		send: (params = {url: "", data: {}}) ->
			url = params.url or @url
			$.ajax
				url: url,
				data: params.data,
				context: document.body
				dataType: 'json'
				type: params.type

	class Services extends XHR
		
		get: (params = {}) ->
			params = _.extend params, type: "GET"
			promise = @send(params)

		post: (params = {}) ->
			params = _.extend params, type: "POST"
			promise = @send(params)

		put: (params = {}) ->
			params = _.extend params, type: "PUT"
			promise = @send(params)

		delete: (params = {}) ->
			params = _.extend params, type: "DELETE"
			promise = @send(params)

	class Cars extends Services
		url: "http://localhost:3000/api"

		findByText: (params) ->
			params.url = @url + "/find"
			promise = @get(params)

	return
		Cars: new Cars