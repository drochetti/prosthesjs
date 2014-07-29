(function(global) {

	/**
	 * @namespace ui
	 */
	global.ui = {};

	/**
	 * @namespace view
	 */
	global.view = {};

})(this);




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

(function(global) {

	if (!global.DISABLE_GLOBAL_ALIASES) {
		
		/**
		 * @class Model
		 * @alias Backbone.Model
		 */
		global.Model = Backbone.Model;
	
		/**
		 * @class Collection
		 * @alias Backbone.Collection
		 */
		global.Collection = Backbone.Collection;
	
		/**
		 * @class View
		 * @alias Backbone.View
		 */
		global.View = Backbone.View;
	
		/**
		 * @class ItemView
		 * @alias Backbone.Marionette.ItemView
		 * @extends Backbone.View
		 */
		global.ItemView = Backbone.Marionette.ItemView;
	
		/**
		 * @class CollectionView
		 * @alias Backbone.Marionette.CollectionView
		 */
		global.CollectionView = Backbone.Marionette.CollectionView;
	
		/**
		 * @class CompositeView
		 * @alias Backbone.Marionette.CompositeView
		 */
		global.CompositeView = Backbone.Marionette.CompositeView;
	
		global.Router = Backbone.Router;
		global.AppRouter = Backbone.Marionette.AppRouter;
		global.Application = Backbone.Marionette.Application;

	}

})(this);
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

(function(global) {

	global.errors = {

		mustOverride : function(methodName) {
			var e = new Error(methodName + ' must be overriden by user class.');
			e.cause = errors.mustOverride;
			return e;
		}

	};

})(this);

(function(global) {

	global.PagedCollection = Collection.extend({

		parseData : 'data',

		parse : function(data) {
			var collectionData = this.parseData ? _.result(this.parseData, data) : data;
			this.pageData = this.parsePageData(data);
			return collectionData;
		},

		/**
		 * @protected
		 */
		parsePageData : function(data) {
			return _.pick(data || {}, 'page', 'pages', 'total');
		}

	});

})(this);


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

(function (global, $) {

    var notifyEl = global.NOTIFICATION_DEFAULT_CONTAINER = $('#global-notifications');

    /**
     * @class view.NotificationMixin
     * @mixin
     *
     * Mix into your View classes in order to provide common notication
     * functions to views.
     * Properties you may override to get custom behaviour:
     *
     * @property {Object} notificationDefaults
     * @property {Function} getNotificationContainer
     */
    global.view.NotificationMixin = {

        /**
         * @param msg
         * @param options
         */
        notify: function (msg, options) {
            msg = msg || '';
            options = options || { };
            var text = { };
            if (_.isString(msg)) {
                var msgText = msg;
                msg = {
                    html : msgText
                };
            } else if (!_.isObject(msg) || !_.has(msg, 'text')) {
                throw new Error('The "msg" argument is not a String or a valid Object with a "text" property.');
            }
            var msgOptions = _.extend(options, {
                message: msg
            });
            var el = this.getNotificationContainer ? this.getNotificationContainer() : notifyEl;
            if (!el || !el.length) {
                el = notifyEl;
            }
            var notification = this.currentNotification = el.notify(
                _.extend(this.notificationDefaults || {}, msgOptions));
            notification.$note.append($('<i class="alert-icon"></i>'));
            if (msgOptions.autoShow !== false) {
                notification.show();
            }
            return notification;
        },

        notifySuccess: function (msg, options) {
            return this.notify(msg, _.extend(options || {}, {
                type : 'success'
            }));
        },

        notifyError: function (msg, options) {
            return this.notify(msg, _.extend(options || {}, {
                type: 'danger'
            }));
        },

        notifyWarning: function (msg, options) {
            return this.notify(msg, _.extend(options || {}, {
                type: 'warning'
            }));
        },

        notifyInfo: function (msg, options) {
            return this.notify(msg, _.extend(options || {}, {
                type: 'info'
            }));
        }

    };

})(window, domLib());

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


(function(global) {

	/**
	 * @class BaseView
	 * @extends Backbone.View
	 */
	global.BaseView = ItemView.extend({

		template : global.JST_NONE

	});

	var _init_function = View.prototype.initialize;
	View.prototype.initialize = function() {
		_init_function.apply(this, arguments);
		if (this.options.autoRender) {
			this.render();
		}
	};

})(this);


(function(global) {

	/**
	 * @param {String} style
	 * @param {String} scale
	 */
	global.PagerView = BaseView.extend({

		events : {
			'click li:first-child a' : 'prev',
			'click li:last-child a' : 'next'
		},

		ui : {
			prevButton : 'li:first-child a',
			nextButton : 'li:last-child a'
		},

		onRender : function() {
			this._configureMainEl();
			this._renderControls();
		},

		_configureMainEl : function() {
			this.$el.addClass(this.options.style || 'pagination');
			var scale = this.options.scale;
			if (scale && scale.length) {
				this.$el.addClass('pagination-' + scale);
			}
		},

		_renderControls : function() {
			var html = '<ul>';
			
			html += '</ul>';
		}

	});

})(this);


(function(global, $) {

	/**
	 * @class TableRowView
	 * @extends ItemView
	 */
	global.TableRowView = ItemView.extend({

		tagName : 'tr'

	});


	/**
	 * @class TableView
	 * @extends CollectionView
	 */
	global.TableView = CollectionView.extend({

		itemView : TableRowView,

		render : function() {
			this.$el.addClass('table');

			/**
			 * @property {Element} $body
			 * @memberof TableView
			 */
			this.$body = this.$('tbody').first();

			/**
			 * @property {Array} columnDefinitions
			 * @memberof TableView
			 */
			var columnDefinitions = this.columnDefinitions = this.columnDefinitions || [];

			/**
			 * @property {Number} columnCount
			 * @memberof TableView
			 */
			this.columnCount = columnDefinitions.length;

			/**
			 * @property {Object} rowActions
			 * @memberof 
			 */
			this.rowActions = this.rowActions;

//			this._super();
            CollectionView.prototype.render.call(this, options);
		},

		buildItemView : function(item, itemViewType, itemViewOptions) {
			itemViewType = itemViewType || TableRowView;
			var defs = this.columnDefinitions;
			var row = new itemViewType(_.extend({
				model : item,
				columnDefinitions : defs
			}, itemViewOptions || {}));
			if (!(row instanceof TableRowView)) {
				throw new Error('Your itemView must be a TableRowView');
			}
			row.tableView = this;
			if (!row.template) {
				var rowActions = this.rowActions;
				var view = this;
				row.template = function(rowData) {
					var rowInnerHtml = '';
					_.each(defs, function(definition, i) {
						var value = rowData[definition] || '';
						if (_.isFunction(definition)) {
							value = definition.call(view, rowData);
						}
						rowInnerHtml += '<td>';
						rowInnerHtml += value;
						rowInnerHtml += '</td>';
					});
					if (_.isObject(rowActions)) {
						rowInnerHtml += '<td class="actions"><div class="btn-group">';
						_.each(rowActions, function(actionConfig, actionName) {
							var btnElName = actionConfig.href ? 'a' : 'button';
							rowInnerHtml += '<' + btnElName + ' class="btn ' + actionName + '"';
							if (actionConfig.href) {
								rowInnerHtml += ' href="' + actionConfig.href + '"';
							}
							if (actionConfig.tooltip) {
								rowInnerHtml += ' data-toggle="tooltip" title="' +
									actionConfig.tooltip + '"';
							}
							rowInnerHtml += '>';
							if (actionConfig.icon) {
								rowInnerHtml += '<i class="icon-' + actionConfig.icon + '"></i>';
							}
							rowInnerHtml += actionConfig.text || '';
							rowInnerHtml += '</' + btnElName + '>';
						});
						rowInnerHtml += '</div></td>';
					}
					return rowInnerHtml;
				};
			}
			return row;
		},

		appendHtml : function(collectionView, itemView, index) {
			collectionView.$body.append(itemView.$el);
			var actionButtons = {};
			_.each(collectionView.rowActions, function(action, name) {
				actionButtons[name] = itemView.$('.' + name);
			});
			itemView.actionButtons = actionButtons;
		}

	});

})(this, domLib());


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

(function(global) {

	/**
	 * 
	 */
	global.ui.Widget = BaseView.extend({

		

	});

})(this);

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

(function(global, $) {

	global.ui.Button = ui.Widget.extend({
		
	});

})(this, domLib());

(function(global) {

	var SelectItem = ItemView.extend({
		tagName : 'li',
		template : function(obj) {
			return $('<a/>')
                .attr('tabindex', '-1')
                .attr('href', '#')
                .data('item-cid', obj.cid)
                .data('item-id', obj.id)
                .text(obj.itemText);
		},
		templateHelpers : function() {
			return {
				cid : this.cid,
				itemText : this.model.get(this.options.textAttribute)
			};
		}
	});

    SelectItem.Model = Model.extend({});

	global.ui.DropdownSelect = CompositeView.extend({

		ui : {
			toggle : '.dropdown-toggle',
			menu : 'ul.dropdown-menu'
		},

		template : JST_NONE,

		itemViewContainer : 'ul.dropdown-menu',

		itemView : SelectItem,

        initialize : function(options) {
            this.itemTextAttribute = options.itemTextAttribute || 'name';
//            this._super(options);
            CompositeView.prototype.initialize.call(this, options);
        },

		itemViewOptions : function(model, index) {
			return {
				textAttribute : this.itemTextAttribute,
				itemIndex : index
			};
		},

		onRender : function() {
			if (!this.$el.hasClass('dropdown')) {
				throw new Error('this.$el is not a dropdown container (div.dropdown)!\n' +
					'Check http://twitter.github.io/bootstrap/components.html#dropdowns for info.');
			}
			this.ui.menu.attr('role', 'menu');
			this.ui.menu.on('click', 'li > a', _.bind(this._onItemClick, this));

            this._initCollection();
            this._loadItems();
		},

        _initCollection : function() {
            this.collection = this.collection || new Collection();
            this.collection.model = this.collection.model || SelectItem.Model;
        },

        _loadItems : function() {
            var items = this.$('li > a');
            var collection = this.collection;
            if (!collection.length && items.length) {
                var textAttr = this.itemTextAttribute;
                var options = _.map(items, function(item) {
                    var $item = $(item);
                    var data = {
                        id : $item.data('item-id')
                    };
                    data[textAttr] = _.str.trim($item.text());
                    return data;
                });
                collection.reset(options, { silent : true });
            }
            this.model = collection.at(0); // TODO improve this
        },

		_onItemClick : function(e) {
			if (this.trigger('item:before:select', e) !== false) {
				e.preventDefault();
				var el = $(e.currentTarget);
				var id = el.data('item-id');
				var model = this.collection.findWhere({	id : id	});
				var itemView = null;
				if (model) {
					itemView = this.children.findByModel(model);
				}
				this.ui.toggle.ownText(el.text());
				this.model = model;
				this.trigger('item:select', el, model, itemView, this);
			}
		},

        getSelected : function() {
            return this.model;
        }

	});

})(this);

(function(global, $) {

	global.TOP_HEADER_NAVBAR_CLASS = 'main-header';

	global.ui.NavBar = ui.Widget.extend({

		onRender : function() {
//			this._super();
            ui.Widget.prototype.onRender.call(this, options);
			this._configureScrolling();
		},

		_configureScrolling : function() {
			$(window).scroll(_.throttle(_.bind(function(evt) {
				var op = $(evt.targetEl).scrollTop() > 0 ? 'add' : 'remove';
				this.$el[op + 'Class'].call(this.$el, 'navbar-scrolled');
			}, this), 500));
		}

	});

	var topHeaderNavBarEl = $('.' + global.TOP_HEADER_NAVBAR_CLASS);
	if (topHeaderNavBarEl && topHeaderNavBarEl.length) {

		global.topHeaderNavBar = new ui.NavBar({
			el : topHeaderNavBarEl,
			autoRender: true
		});

	}

})(this, domLib());

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
