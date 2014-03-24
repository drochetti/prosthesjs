
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
