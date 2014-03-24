(function(global) {

	global.errors = {

		mustOverride : function(methodName) {
			var e = new Error(methodName + ' must be overriden by user class.');
			e.cause = errors.mustOverride;
			return e;
		}

	};

})(this);
