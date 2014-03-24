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
