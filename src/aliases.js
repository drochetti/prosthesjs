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