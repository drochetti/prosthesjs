
(function(global) {

	/**
	 * @param {String} style
	 * @param {String} scale
	 */
	global.PagerView = BaseView.extend({

		events : {
			'click li:first-child a' : 'prev',
			'click li:last-child a' : 'next'
		},

		ui : {
			prevButton : 'li:first-child a',
			nextButton : 'li:last-child a'
		},

		onRender : function() {
			this._configureMainEl();
			this._renderControls();
		},

		_configureMainEl : function() {
			this.$el.addClass(this.options.style || 'pagination');
			var scale = this.options.scale;
			if (scale && scale.length) {
				this.$el.addClass('pagination-' + scale);
			}
		},

		_renderControls : function() {
			var html = '<ul>';
			
			html += '</ul>';
		}

	});

})(this);
