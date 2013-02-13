define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/menu.html',
  'less',
  'config',
  'libs/marked/marked',
], function($, _, Backbone, dashboardPageTemplate, less, config){
  var DashboardPage = Backbone.View.extend({
    el: '.kalei-style-menu',
    render: function () {
      var that = this;
      that.$el.html('Loading styles');
      console.log(config.css_path);
      require(['text!' + config.css_path], function (styles) {

      var masterStyle = config.css_path.substr(config.css_path.lastIndexOf('/')+1),
      	 styleDir = config.css_path.substr(0, config.css_path.lastIndexOf('/')) + '/';


      var parser = new(less.Parser)({
			paths: [styleDir, './'], 		// Specify search paths for @import directives
			filename: config.css_path.substr(config.css_path.lastIndexOf('/')+1)
		});
        marked.setOptions({ sanitize: false, gfm: true });
        var menus = [];
        var menuTitle = '';
        var currentMenu = {
          sheets: [],
          category: ''

        };


	 	parser.parse(styles, function(err, tree) {
			if (err) { return console.error(err); }

		_.each(tree.rules, function(rule) {
          if (rule.value !== undefined && rule.rules === undefined && $.type(rule.value) == 'string') {
            var comment = rule.value;
            comment = comment.replace('/*', '');
            comment = comment.replace('*/', '');

            var comments = marked.lexer(comment);
            _.each(comments, function (comment) {

              if(comment.type === 'heading' && comment.depth === 1) {
                menuTitle = marked.parser([comment]);
              }
              if(comment.type === 'heading' && comment.depth === 3) {
                menus.push(_.extend({}, currentMenu));
                currentMenu.sheets = [];
                currentMenu.category = marked.parser([comment]);
              }

            });

          }
          if(rule.path !== undefined) {
            currentMenu.sheets.push(rule.path);
          }

        });
        });
        menus.push(currentMenu);




        $(that.el).html(_.template(dashboardPageTemplate, {_:_, menuTitle: menuTitle, menus: menus, entry: masterStyle}));
        $('[href="' + window.location.hash + '"]').addClass('active');
        if(window.location.hash === '') {
          $('.js-kalei-home').addClass('active');
        }
      });

    },
    events: {
      'click a.kalei-styleguide-menu-link': function (ev) {
        this.$el.find('a.active').removeClass('active');
        $(ev.currentTarget).addClass('active');
      }
    }
  });
  return DashboardPage;
});
