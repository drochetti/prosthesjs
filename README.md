prosthesjs
==========

A Backbone stack aimed to provide blueprints, extensions and better integration between different parts of a Backbone MVC *real* App.

1. Motivation
-------------

After several years doing Front End development, I've been using Backbone to achieve good results since 2012. During this period I've created some solutions to overcome some caveats and limitations of the Framework that were impacting productivity and maintenance. So I've decided to organize, document and share those solutions. Here they are, I hope you enjoy and contribute!


2. Dependencies
---------------

 - underscore
 - underscore.string
 - Backbone
 - Marionette

### A note on Marionette ###
[Marionette](https://github.com/marionettejs/backbone.marionette) is a great project, and thanks to it I've been producing better Backbone code over the years. It's present on this stack, so refer to its documentation whenever possible, mainly for [ItemView](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.itemview.md) and [CollectionView](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.collectionview.md).


3. Features
-----------

### Aliasing ###

This is a very simple but useful feature. Since we assume we're using Backbone as our MVC soluction, why write `Backbone.Model`, `Backbone.View` every time? So the following aliases were created:

 - Backbone.`View`
 - Backbone.`Model`
 - Backbone.`Collection`
 - Backbone.Marionette.`ItemView`
 - Backbone.Marionette.`CollectionView`

A `BaseView` class was also defined. It's an `ItemView` that doesn't depend on a `template`, so you can have all the nice features of the Marionette's ItemView but without the need of a template function.


### Scope good practices ###

Everybody knows that keeping most of things out of global scope is a good thing but actually few programmers write code that does that. In order to keep things out of global scope some utility function were create:

#### The `$define(closure)` function ####
This function is a simples JS closure.
This:
```js
$define(function($, global) {
    // do something on your own scope
    // this !== window
    // global === window
});
```
Is the same as:
```js
(function($, global) {
    // same as above but ugly/repetitive code
})(jQuery, window);
```

#### The `$defineClass(name, closure)` function ####
This is a more powerful closure, allowing you to define an object (usually a class) and export it to a name, allowing you to define your own namespaces, like this:
```js
$defineClass('app.model.User', function($, global) {
    return Model.extend({

    });
});
app.model.User !== undefined // Yay!
```

### Html and View auto loading/rendering ###

As applications grow, they tend to get *messy*. When you have a sample application with two models and 4 views, everything looks beautiful, but in a real life app is normal to have at least 10 models and around 30 views. TODO: elaborate...

Normally you'd do something similar to this to create and render your views:
```html
<!-- No clue at all that a View will be rendered on this element -->
<div id="user-view">
    <!-- Nor on this one -->
    <div id="favorites-view">
        <!-- app.view.FavoriteList -->
        <!-- I use to write the View class as a comment
        in order to not get lost during maintenance -->
    </div>
</div>
```

And the JS boilerplate:
```js
app.view.UserDetails = BaseView.extend({
    onRender : function() {
        var favorites = new app.model.Favorites();
        this.favoritesView = new app.view.FavoriteList({
            el: this.$('#favorites-view'),
            displayMax: 20,
            collection: favorites
        });
        favorites.fetch();
        this.favoritesView.render();
    }
});

$(document).ready(function() {
    var userView = new app.view.UserDetails({
        el: $('#user-view')
    });
    userView.render();
});
```
Throw this away and make sure you don't write this kind of boilerplate code anymore! =)

You can simply do this instead:
```html
<div id="user-view" data-view="app.view.UserDetails">
    <div id="favorites-view"
        data-view="app.view.FavoriteList"
        data-view-display-max="20"
        data-collection="app.model.Favorites"
        data-collection-init="fetch">
    </div>
</div>
```
And your views will be nicely instantiated with the right arguments and rendered in the correct order. Furthermore, just by looking at the code you can realize which elements, views, collections and models are used.

#### The `data-*` attributes ####

| Attribute         | Description                                | Default   |
| ------------------|--------------------------------------------|-----------|
| view              | the full qualified name of the View class  | required  |
| model             | the full qualified name of the Model class |           |
| model-init        | the name of the variable with the model data or the name of a model function, used to initialize the model with data      |           |
| collection        | the full qualified name of the Collection class |           |
| collection-init   | the name of the variable with the collection data or the name of a collection function, used to initialize the model with data |           |
| view-render       | Should this view be rendered automatically? | `true`    |
| view-*            | Any other view- preffixed attribute will be passed to the View's constructor              |           |

#### A simplified lifecycle ####
When you organize your code like this, not only you'll never need to instantiate your View class on your code but you won't need to worry about calling `render` on each instance. The loader will create and render your views automatically, unless `data-view-render="false"`.

#### The `$defineView(name, closure)` function ####
This function does the same as the `$defineClass` but with one **important optimization**: if the `data-view` with the same name is not found on the page, the closure is not called, so not only the view is never created/rendered but the view class is not even defined!

#### Parent/Nested relationship ####
Another cool feature of the auto-loading/rendering is the bind of parent/nested views references automatically, for example:

```js
$defineView('app.view.FavoriteList', function() {

    return CollectionView.extend({

        onRender : function() {
            // this.parentView is the reference to
            // the app.view.UserDetails instance
            this.listenTo(this.parentView, 'refresh', this._onUserRefresh);
        },

        _onUserRefresh : function() {
            // do something when the parent view triggers the 'refresh' event
        }

    });
});
```
#### Installing the auto-loader ####
In order to install use this feature you must call ``View.load`` in your initialization script, preferably on the `onDomReady` event:

```js
// using the long form for better code readability
$(document).ready(function() {
    // other backbone and application specific initialization
    View.load();
});
```

### Mixins ###

TODO: doc me


4. License
----------

This component is licensed under [MIT](LICENSE.txt) which is a very simple and easy license with very few restrictions, meaning we encourage you to fork and make pull requests, report and solve issues and contribute with ideas and feedback.
You are free to use the `prosthesjs` project in any other project (even **commercial** projects) as long as the copyright header is left intact.