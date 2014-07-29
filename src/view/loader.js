
$define(function(global, $) {

    /**
     * @private
     * @param viewName
     * @returns {string}
     */
    function getViewIdentifier(viewName) {
        var identifier = _.str.strRightBack(viewName, '.');
        return identifier.charAt(0).toLowerCase() + identifier.slice(1);
    }

    /**
     * @private
     * @param nameRef
     * @param top
     * @returns {*}
     */
    function getReference(nameRef, top) {
        var names = nameRef.split('.');

        var name = names.shift();
        var ref = top[name];
        if (ref && names.length) {
            ref = getReference(names.join('.'), ref);
        }
        return ref;
    }

    function referenceNotFoundError(name) {
        return new Error('Class "' +
            name +
            '" could not be found. Make sure it exists, is included and is not misspelled.');
    }

    function resolveModel(el) {

        var initModel = function(ref, init) {
            var model = null;
            if (init) {
                if (ref.prototype[init]) {
                    model = new ref();
                    model[init].call(model);
                } else {
                    var content = getReference(init, global);
                    if (content) {
                        model = new ref(content);
                    }
                }
            }
            return model || new ref();
        };

        var modelRef = {};
        _.each(['model', 'collection'], function(name) {
            var modelAttr = el.data(name);
            if (modelAttr) {
                var ref = getReference(modelAttr, global);
                if (ref) {
                    var modelInit = el.data(name + '-init') || '';
                    modelRef[name] = initModel(ref, modelInit);
                } else {
                    throw referenceNotFoundError(modelAttr);
                }
            }
        });
        return modelRef;
    }

    function resolveViewOptions(el) {
        var opts = {};
        _.each(el.data(), function(value, name) {
            name = _.str.underscored(name);
            if (_.str.startsWith(name, 'view_')) {
                var optionName = _.str.strRight(name, '_');
                optionName = _.str.classify(optionName);
                optionName = optionName.charAt(0).toLowerCase() + optionName.slice(1);

                if (typeof(_.str.toBoolean(value)) !== 'undefined') {
                    value = _.str.toBoolean(value);
                } else if (_.str.toNumber(value)) {
                    value = _.str.toNumber(value);
                }
                opts[optionName] = value;
            }
        });
        return opts;
    }

    /**
     * @private
     * @param viewName
     * @param el
     * @returns {View}
     */
    function createView(viewName, el) {
        var View = getReference(viewName || '', global);
        if (!View) {
            throw referenceNotFoundError(viewName);
        }

        var view = new View(_.extend({
            el : el
        }, resolveViewOptions(el), resolveModel(el)));
        view.nestedViews = {};
        return view;
    }

    /**
     * Verifies if a view bound to an element should be
     * rendered when document ready.
     *
     * @private
     * @param el
     * @returns {boolean}
     */
    function shouldRender(el) {
        return el.data('view-render') !== false;
    }

    /**
     *
     * @returns {View}
     */
    $.fn.view = function() {
        return this.data('view');
    };

    /**
     *
     * @returns {View}
     */
    $.fn.createView = function() {
        var $views = $(this);
        $views.each(function createAndBindViews() {
            var $el = $(this);
            var viewName = $el.data('view');
            var view = createView(viewName, $el);
            view.on('close', function() {
                _.each(this.nestedViews, function(nestedView) {
                    nestedView.close();
                });
            });
            $el.data('view', view);

            var $parent = $el.parents('[data-view]').first();
            var hasParent = !!$parent.length;

            if (hasParent) {
                var parentView = $parent.data('view');
                view.parentView = parentView;

                var viewIdentifier = $el.data('view-alias') || getViewIdentifier(viewName);
                parentView.nestedViews[viewIdentifier] = view;
                if (shouldRender($el)) {
                    if (!parentView._isRendered) {
                        parentView.on('render', _.bind(view.render, view));
                    }
                }
            }

        });

        $views.each(function renderTopLevelViews() {
            var $el = $(this);
            var view = $el.view();
            var parentView = view.parentView;
            if ((!parentView || parentView._isRendered) && shouldRender($el)) {
                view.render();
            }
        });
        return $views;
    };

    /**
     * @member View
     */
    global.View.load = function() {
        $(function() {
            $('[data-view]').createView();
        });
    };

});
