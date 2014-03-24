$define(function(global) {

    /**
     * Create namespace objects based on a <code>String</code>
     * representation of it.
     *
     * @private
     * @param {String} ns Namespace declaration
     * @returns {Object} top level namespace object reference
     */
    var createNamespace = function (ns, topLevel) {
        var levels = ns.split('.');
        var first = levels.shift();
        var top = topLevel[first] = topLevel[first] || {};
        var lastLevel = top;
        if (levels.length) {
            lastLevel = createNamespace(levels.join('.'), top);
        }
        return lastLevel;
    };

    /**
     * @global
     * @param {string} name The view class name
     * @param {function} closure The closure that must return the class definition
     * @returns {Object}
     */
    global.$defineClass = function(name, closure) {
        var namespace = _.str.strLeftBack(name, '.');
        var className = _.str.strRightBack(name, '.');

        var cls = closure.call(global, global, global.domLib());
        if (cls) {
            var ns = createNamespace(namespace, global);
            ns[className] = cls;
        } else {
            throw new Error('Could not define class "' + name + '". ' +
                'You must return a valid object.');
        }
        return cls;
    };

    /**
     * Defines a View class when the DOM is ready. This method is resource-friendly
     * and will only define the View if it's used in the current document
     * (if an elements with <code>data-view="name"</code> is found).
     *
     * <strong>Note:</strong> If you want to define a View anyway, check
     * the <code>$defineClass</code>, which is used internally.
     *
     * @param {string} name The view class name
     * @param {function} closure The closure that must return the View class definition
     */
    global.$defineView = function(name, closure) {
        var el = $('[data-view="' + name + '"]').first();
        var view = null;
        if (el && el.length) {
            view = global.$defineClass(name, closure);
            if (!(view.prototype && view.prototype.render)) {
                throw new Error('Class "' + name + '" does not appear to be a view (no "render" method).');
            }
        }
        return view;
    };

});