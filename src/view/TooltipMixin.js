
(function(global, $) {

	global.view.TooltipMixin = {

		mix : function() {
			if (_.isUndefined($.fn.tooltip)) {
				throw new Error('Bootstrap Tooltip plugin was not found!');
			}
		},

		before : {

			onBeforeClose : function() {
				this.$('[data-toggle="tooltip"]').tooltip('destroy');
			}

		},

		after : {

			render : function() {
				this.$('[data-toggle="tooltip"]').tooltip();
			}

		}

	};

})(this, domLib());
