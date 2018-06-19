// ---------------------------------------------
var _templates = {};

_templates.login =  
	'<div class="content">' +
	'<% if ( rsc.sorry ) { %>' +
	'<p class="sorry"><%= rsc.sorry %></p>' +
	'<% } %>' +
	'<form id="submit-name">' +
		'<input type="text" id="field-name" value="<%= rsc.field %>" />' +
		'<button class="btn">Send</button>' +
	'</form>' +
	'</div>'
;

_templates.loader =
	'<div class="content" id="waiting">' +
		'<h3>Welcome <%= rsc.name %></h3>' +
		'<p><%= rsc.text %></p>' +
		'<div id="loader">' +
		'<% for ( var i = 0; i < 6; i++ ) { %>' +
			'<div class="square"></div>' +
		'<% } %>' +
		'</div>' +
	'</div>'
;
	
_templates.player = 
	'<div class="player" id="<%= rsc.id %>">' +
		'<h3><%= rsc.name %></h3>' +
		'<p>score : ' +
			'<span class="score"><%= rsc.score %></score>' +
		'</p>' +
	'</div>'
;

_templates.playground =
	'<div id="mask">' +
       	'<div id="playground"></div>' +
    '</div>'
;

_templates.dialog = 
	'<div class="dialog">' +
		'<% if ( rsc.classTxt ) { %>' +
			'<p class="<%= rsc.classTxt %>"><%= rsc.text %></p>' +
		'<% } else { %>' +
			'<p><%= rsc.text %></p>' +
		'<% } %>' +
		'<% if ( rsc.button ) { %>' +
			'<button class="btn" id="<%= rsc.button.id %>">' +
				'<%= rsc.button.label %>' +
			'</button>' +
		'<% } %>' +
	'</div>'
;	