


(function(global) {

    var g = global;

    /**
     * @global
     */
	g.domLib = function() {
		return g.$ || g.jQuery || g.zepto;
	};

	/**
	 * @global
	 */
	g.EMPTY_FN = function() {};

    /**
     * @global
     * @type {Function}
     */
	g.JST_NONE = g.EMPTY_FN;

    var $ = g.domLib();

    /**
     * @global
     * @param closure
     */
    g.$define = function(closure) {
        return closure.call(g, g, $);
    };


})(this);
