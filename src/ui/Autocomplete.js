(function(global) {

	/**
	 * @class ui.Autocomplete
	 * @extends CompositeView
	 */
	global.ui.Autocomplete = CompositeView.extend({

		onRender : function() {
			
		},

		_setupTypeahead : function() {
			this.$el.typeahead({
				source : this._syncCollection
			});
		},

		_syncCollection : function() {
			
		}

	})/*.mix(JQueryPlugin)*/;

})(this);
