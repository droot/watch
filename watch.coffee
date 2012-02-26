root = exports ? this


is_box_visible = (color)->
	selector = ".#{color}box:visible"
	return $(selector).length > 0

watch = (fn, args, timeout)->
	dfd = new jQuery.Deferred()
	curr_probe = null

	probe = ()->
		if fn(args)
			dfd.resolve(args)
			curr_probe = null
		else
			curr_probe = setTimeout probe, 5
	
	if timeout
		setTimeout(()->
					curr_probe and clearTimeout curr_probe
					dfd.reject(args)
			,timeout)

	probe()
	return dfd.promise()

inject_box = (color)->
	box_html = """<div id="#{color}-box" class='box #{color}box'></div"""
	$(box_html).appendTo('#canvas')

click_handler = (ev)->
	$target = $(ev.target)
	if $target.is('#red-box')
		return if is_box_visible('red')
		inject_box('red')
	else if $target.is('#green-box')
		return if is_box_visible('green')
		inject_box('green')

place_guider_note = ->
					guider_note =
						attachTo: "#blue-box"
						buttons: [{name: "Close", onclick: guiders.hideAll}]
						description:"""Voila!
									This box appeared because both red and green boxes have appeared on
									our screen. """
						position: 2
						title: "Blue Box"
						width: 230
					guiders.createGuider(guider_note).show()

place_intro_guider_note = ->
					guider_note =
						attachTo: "#nav"
						buttons: [{name: "Close", onclick: guiders.hideAll}]
						description:"""
									1. Use buttons to inject color boxes below <br/>
									2. If green and red boxes appear on the screen, blue box will appear automatically<br />
									"""
						position: 2
						title: "Inject Boxes"
						width: 230
					guiders.createGuider(guider_note).show()

initialize = ()->
	$('#nav').bind('click', click_handler)
	place_intro_guider_note()
	watch(is_box_visible, 'red').then(
		(status)->
		,
		(status)->
			alert "#{status} with failure ...."
		)

	$.when(watch(is_box_visible, 'green'),
			watch(is_box_visible, 'red')).then(()->
												inject_box('blue')
												place_guider_note()
											)
	

$(document).ready initialize
