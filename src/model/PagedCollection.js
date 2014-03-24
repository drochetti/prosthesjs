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
