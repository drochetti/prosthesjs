
(function(global, $) {

	global.view.ModelBinderMixin = {

		before : {

			onBeforeClose : function() {
				this.modelBinder.unbind();
			}

		},

		after : {

			render : function() {
				this.modelBinder.bind(this.model, this.el);
			}

		}

	};

})(this, domLib());
