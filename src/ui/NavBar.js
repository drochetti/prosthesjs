(function(global, $) {

	global.TOP_HEADER_NAVBAR_CLASS = 'main-header';

	global.ui.NavBar = ui.Widget.extend({

		onRender : function() {
//			this._super();
            ui.Widget.prototype.onRender.call(this, options);
			this._configureScrolling();
		},

		_configureScrolling : function() {
			$(window).scroll(_.throttle(_.bind(function(evt) {
				var op = $(evt.targetEl).scrollTop() > 0 ? 'add' : 'remove';
				this.$el[op + 'Class'].call(this.$el, 'navbar-scrolled');
			}, this), 500));
		}

	});

	var topHeaderNavBarEl = $('.' + global.TOP_HEADER_NAVBAR_CLASS);
	if (topHeaderNavBarEl && topHeaderNavBarEl.length) {

		global.topHeaderNavBar = new ui.NavBar({
			el : topHeaderNavBarEl,
			autoRender: true
		});

	}

})(this, domLib());
