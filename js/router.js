// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
	'vm'
], function ($, _, Backbone, Vm) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Pages
      '/style/*style': 'style',	
    
      // Default - catch all
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(options){
		var appView = options.appView;
    var router = new AppRouter(options);
		router.on('route:style', function (style) {
			require(['views/style/page'], function (StylePage) {
				var stylePage = Vm.create(appView, 'StylePage', StylePage, {style: style});
				stylePage.render();
			});
		});
		router.on('route:defaultAction', function (actions) {
      require(['views/style/page'], function (StylePage) {
        var stylePage = Vm.create(appView, 'StylePage', StylePage, {style:null});
        stylePage.render();
      });
		});

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
