prosthesjs
==========

A Backbone stack aimed to provide blueprints, extensions and better integration between different parts of a Backbone MVC *real* App.

1. Motivation
-------------

After several years doing FrontEnd development and being using Backbone to achieve good result for the last two years


2. Dependencies
---------------

 - underscore
 - underscore.string
 - Backbone
 - Marionette

3. Features
-----------

### Aliasing ###

This is a very simple but useful feature. Since we assume we're using Backbone as our MVC soluction, why write `Backbone.Model`, `Backbone.View` every time? So the following aliases were created:

 - Backbone.**View**
 - Backbone.**Model**
 - Backbone.**Collection**
 - Backbone.Marionette.**ItemView**
 - Backbone.Marionette.**CollectionView**
 

### Scope good practices ###

Everybody knows that keeping most of things out of global scope is a good thing but actually few programmers write code that does that. TODO: improve

```js
$defineView('app.view.UserView', function($, global) {
    return BaseView.extend({
        
    });
});
```

### Html and View auto loading/rendering ###

As applications grow, they tend to get *messy*. When you have a sample application with two models and 4 views, everything looks beautiful, but in a real life app is normal to have at least 10 models and around 30 views.
TODO: improve

```html
<div data-view="app.view.UserView" data-view-user-role="admin" data-model="app.model.User" data-model-init="fetch">
    <!-- View content -->
</div>
```

| Attribute         | Description   | Default  |
| ------------------|---------------| ---------|
| view              |               |          |
| model             |               |          |
| model-init        |               |          |
| collection        |               |          |
| collection-init   |               |          |
| view-render       |               | `true`   |
| view-*            |               |          |

### Mixins ###


4. License
----------

This component is licensed under [MIT]() which is a very simple and easy license with very few restrictions, meaning we encourage you to fork and make pull requests, report and solve issues and contribute with ideas and feedback. 
You are free to use the `prosthesjs` project in any other project (even **commercial** projects) as long as the copyright header is left intact.