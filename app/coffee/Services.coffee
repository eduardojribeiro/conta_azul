# define ->
# 	class Services
		
# 		get: (params = {url: "", data: {}}) ->
# 			jqxhr = $.get(@url, params.data)
# 			jqxhr.fail ->
# 				alert "Falha ao comunicar com o sistema"

# 		put: ->

# 	class Cars extends Services
# 		url: ''