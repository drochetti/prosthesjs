
(function(global) {

	var _bb_extend = Backbone.View.extend;

	function applyInterceptor(interceptorFunctions, beforeOrAfter) {
		beforeOrAfter = (beforeOrAfter || '').toLowerCase();
		var proto = this.prototype;
		if (_.isObject(interceptorFunctions)) {
			_.each(interceptorFunctions, function(interceptor, name) {
				if (_.isFunction(interceptor)) {
					var original = proto[name] || function() {};
					if (beforeOrAfter === 'before') {
						proto[name] = function() {
							var result = interceptor.apply(this, arguments);
							if (result !== false) {
								result = original.apply(this, arguments);
							}
							return result;
						};
					} else if (beforeOrAfter === 'after') {
						proto[name] = function() {
							var result = original.apply(this, arguments);
							result = interceptor.apply(this,
								_.union(_.toArray(arguments), result));
							return result;
						};
					} else {
						throw new Error('You can only specify "before" or "after" for interceptors.');
					}
				}
			});
		}
	}

	/**
	 * @static
	 * @method mixin
	 * @memberof View
	 * 
	 */
	var _mixin = function() {
		var proto = this.prototype;
		_.each(_.toArray(arguments || []), function(mixin) {
			if (!(_.isObject(mixin))) {
				throw new Error('Mixin must be an valid object!');
			}
			var objToMix = _.omit(mixin, 'mix', 'before', 'after');
			//objToMix = _.filter(objToMix, function(member) {
			//	return member && _.isFunction(member);
			//});
			_.defaults(proto, objToMix);
			if (mixin.mix && _.isFunction(mixin.mix)) {
				mixin.mix.call(objToMix, this);
			}
			applyInterceptor.call(this, mixin.before, 'before');
			applyInterceptor.call(this, mixin.after, 'after');
		}, this);
		return this;
	};

	var _patched_extend = function() {
		var clazz = _bb_extend.apply(this, arguments);
		clazz.mixin = _mixin;
		return clazz;
	};

	var classesToPatch = [View, ItemView, CollectionView, CompositeView, Model, Collection];
	_.each(classesToPatch, function(clazz) {
		clazz.extend = _patched_extend;
	});

})(this);
