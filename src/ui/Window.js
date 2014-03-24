(function(global, $) {

	global.ui.Window = ui.Widget.extend({

		onRender : function() {
			
		},

		initPlugin : function() {
			
			this.$el.modal({
				show : this.options.autoShow
			});
		}

	});

})(this, domLib());
