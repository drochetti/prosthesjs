
(function(global) {

	/**
	 * @class BaseView
	 * @extends Backbone.View
	 */
	global.BaseView = ItemView.extend({

		template : global.JST_NONE

	});

	var _init_function = View.prototype.initialize;
	View.prototype.initialize = function() {
		_init_function.apply(this, arguments);
		if (this.options.autoRender) {
			this.render();
		}
	};

})(this);
