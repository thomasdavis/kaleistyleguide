// :TODO: share parsed style data with page.js so we don't need to process it twice.
//        There is a lot of duplicate code between the two at the moment
define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/menu.html',
  'jscssp',
'less',
  'config',
  'libs/marked/marked'
],
function($, _, Backbone, dashboardPageTemplate, jscssp, less, config, marked) {
    var DashboardPage = Backbone.View.extend({
        el: '.kalei-style-menu',
        render: function () {
            var that = this;
            that.$el.html('Loading styles');

            if(config.css_paths) {
              config.css_path = config.css_paths[0]
            }

            var configDir, styleUrl, masterStyle = config.css_path.substr(config.css_path.lastIndexOf('/')+1);

            if (masterStyle.substr(0,1) === '/') {
                // non relative
                configDir = config.css_path.substr(0, config.css_path.lastIndexOf('/'));
                var pUrl = parseuri(configDir);
                styleUrl = pUrl.protocol + '://' + pUrl.host + (pUrl.port === '' ? '' : ':'+ pUrl) + masterStyle;
            } else {
                configDir = config.css_path.substr(0, config.css_path.lastIndexOf('/'));
                styleUrl = configDir + '/' + masterStyle;
            }

            var markedOpts = _.extend({ sanitize: false, gfm: true }, config.marked_options || {});
            marked.setOptions(markedOpts);
            var menus = [];
            var menuTitle = '';
            var currentMenu = {
                sheets: [],
                category: ''
            };

            function finishMenu()
            {
                if(config.css_paths) {
                  for(var i = 1; i < config.css_paths.length; i++) {
                    currentMenu.sheets.push(config.css_paths[i])
                  }
                }
                menus.push(currentMenu);

                $(that.el).html(_.template(dashboardPageTemplate, {_:_, menuTitle: menuTitle, menus: menus, entry: masterStyle, externalStyles: config.external_stylesheets}));
                $('[href="' + window.location.hash + '"]').addClass('active');
                if(window.location.hash === '') {
                    $('.js-kalei-home').addClass('active');
                }
            }

            switch (config.css_processor) {
                case 'jscssp':

                    require(['text!' + config.css_path], function (styles) {
                        var parser = new jscssp();
                        var stylesheet = parser.parse(styles, false, true);

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
console.log('found import', sheet);
                                currentMenu.sheets.push(sheet);
                            }
                        });

                        finishMenu();
                    });

                    break;

                case 'less':

                    require(['text!' + styleUrl], function (styles) {
                        var parser = new(less.Parser)({
                                filename: styleUrl,
                                rootpath: configDir + '/',
                                relativeUrls: true,
                                insecure: true,
                                paths: [configDir + '/'], // Specify search paths for @import directives
                            });

                        parser.parse(styles, function (err, tree) {
                            _.each(tree.rules, function(rule) {
                                if (rule.silent === false){ //Comment block
                                    var comment = rule.value;
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
                                } else if (rule.path != null) { //Import Rule
                                    currentMenu.sheets.push(rule.path.value);
                                }
                            });

                            finishMenu();
                        });
                    });

                    break;
            }
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
