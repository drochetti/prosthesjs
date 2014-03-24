(function(global) {

	global.ui.PluginAdapter = {

		after : {

			render : function() {
				
			}

		},

		pluginOptions : function() {
			throw errors.mustOverride('getPluginOptions');
		},

		pluginMethods : function() {
			throw errors.mustOverride('getPluginMethods');
		},

		pluginName : function() {
			throw errors.mustOverride('getPluginName');
		}
		
	};

})(this);
