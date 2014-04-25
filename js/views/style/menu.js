define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/menu.html',
  'jscssp',
  'config',
  'libs/marked/marked'
],
function($, _, Backbone, dashboardPageTemplate, jscssp, config, marked) {
    var DashboardPage = Backbone.View.extend({
        el: '.kalei-style-menu',
        render: function () {
            var that = this;
            that.$el.html('Loading styles');

            if(config.css_paths) {
              config.css_path = config.css_paths[0]
            }

            require(['text!' + config.css_path], function (styles) {
                var masterStyle = config.css_path.substr(config.css_path.lastIndexOf('/')+1);
                var markedOpts = _.extend({ sanitize: false, gfm: true }, config.marked_options || {});

                var parser = new jscssp();
                marked.setOptions(markedOpts);
                var stylesheet = parser.parse(styles, false, true);
                var menus = [];
                var menuTitle = '';
                var currentMenu = {
                    sheets: [],
                    category: ''
                };

                _.each(stylesheet.cssRules, function(rule) {
                    if(rule.type === 101) {
                        var comment = rule.parsedCssText;
                        comment = comment.replace('/*', '');
                        comment = comment.replace('*/', '');

                        var comments = marked.lexer(comment);
                        var defLinks = comments.links || {};
                        _.each(comments, function (comment) {
                            var tokens = [comment];
                            tokens.links = defLinks;

                            if(comment.type === 'heading' && comment.depth === 1) {
                                menuTitle = marked.parser(tokens);
                            }
                            if(comment.type === 'heading' && comment.depth === 3) {
                                menus.push(_.extend({}, currentMenu));
                                currentMenu.sheets = [];
                                currentMenu.category = marked.parser(tokens);
                            }

                        });

                    }
                    if(rule.type === 3) {
                        var sheet = rule.href.substr(rule.href.indexOf('(')+2, rule.href.indexOf(')')-rule.href.indexOf('(')-3);
                        currentMenu.sheets.push(sheet);
                    }
                });

                if(config.css_paths) {
                  for(var i = 1; i < config.css_paths.length; i++) {
                    currentMenu.sheets.push(config.css_paths[i])
                  }
                }
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
