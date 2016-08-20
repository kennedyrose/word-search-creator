
(function($){
	if (ws.getCookie('ws_tablebackground')) {
		ws.tablebackground = ws.getCookie('ws_tablebackground');
	}
		
	if (ws.getCookie('ws_lettercolor')) {
		ws.lettercolor = ws.getCookie('ws_lettercolor');
	}

	if (ws.getCookie('ws_foundcolor')) {
		ws.foundcolor = ws.getCookie('ws_foundcolor');
	}
	var initLayout = function() {
		var hash = window.location.hash.replace('#', '');
		var currentTab = $('ul.navigationTabs a')
							.bind('click', showTab)
							.filter('a[rel=' + hash + ']');
		if (currentTab.size() == 0) {
			currentTab = $('ul.navigationTabs a:first');
		}
		showTab.apply(currentTab.get(0));

		$('#colorSelector1').ColorPicker({
			color: '#' + ws.tablebackground,
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				$('#colorSelector1 div').css('backgroundColor', '#' + hex);
				ws.setCookie("ws_tablebackground", hex, "365");
				ws.tablebackground = hex;
				
			}
		});

		$('#colorSelector2').ColorPicker({
			color: '#' + ws.lettercolor,
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				$('#colorSelector2 div').css('backgroundColor', '#' + hex);
				ws.setCookie("ws_lettercolor", hex, "365");
				ws.lettercolor = hex;
				
			}
		});

		$('#colorSelector3').ColorPicker({
			color: '#' + ws.foundcolor,
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onChange: function (hsb, hex, rgb) {
				$('#colorSelector3 div').css('backgroundColor', '#' + hex);
				ws.setCookie("ws_foundcolor", hex, "365");
				ws.foundcolor = hex;
				
			}
		});
		
	};
	
	var showTab = function(e) {
		var tabIndex = $('ul.navigationTabs a')
							.removeClass('active')
							.index(this);
		$(this)
			.addClass('active')
			.blur();
		$('div.tab')
			.hide()
				.eq(tabIndex)
				.show();
	};
	
	EYE.register(initLayout, 'init');
})(jQuery)