define([
'jquery',
'underscore',
'backbone',
'libs/marked/marked',
'text!templates/style/page.html',
'config',
'jscssp',
'pagedown',
'libs/highlight/highlight',
'libs/parseuri/parseuri',
'libs/less/less-1.3.3.min'
],
function($, _, Backbone, marked, stylePageTemplate, config, jscssp, Pagedown, hljs, parseuri){
    var that = null;
    var StylePage = Backbone.View.extend({
        el: '.kalei-style-page',
        render: function () {
            that = this;

            //add more space at the bottom of the page to avoid scrolling to last node from menu
            //but we can think for something more smarter
            var pageHeight = document.body.offsetHeight;
            var lastEl = $(".kalei-documentation:last").height();
            console.log(lastEl);
            $(that.el).css({ 'padding-bottom' : pageHeight });

            $('head').append('<link rel="stylesheet" href="' + config.css_path + '"" type="text/css" />');
            $('a.kalei-styleguide-menu-link').removeClass('active');
            if(window.location.hash === '') {
                $('.js-kalei-home').addClass('active');
            } else {
                $('[href="' + window.location.hash + '"]').addClass('active');
            }

            // $("head").find("link").attr("href", function (i, value) {
            //     if (value != config.css_path){
            //         $('head').append('<link rel="stylesheet" href="' + config.css_path + '"" type="text/css" />');
            //     }
            // });


            var styleUrl;
            var configDir;

            if(this.options.style === null) {
                this.options.style = config.css_path.substr(config.css_path.lastIndexOf('/')+1);
            }

            if(this.options.style.substr(0,1) === '/') {
                // non relative
                configDir = config.css_path.substr(0, config.css_path.lastIndexOf('/'));
                var pUrl = parseuri(configDir);
                styleUrl = pUrl.protocol + '://' + pUrl.host + (pUrl.port === '' ? '' : ':'+ pUrl) + this.options.style;
            } else {
                configDir = config.css_path.substr(0, config.css_path.lastIndexOf('/'));
                styleUrl = configDir + '/' + this.options.style;
            }

            console.log('try', configDir);
            console.log('try', styleUrl);
            require(['text!'+ styleUrl], function (stylesheet) {
                var parser = null;
                var regex = /(?:.*\/)(.*)\.(css|less|sass)$/gi;
                var result = regex.exec(styleUrl);
                //result[0] Original Input
                //result[1] Filename
                //result[2] Extension


                var page = {blocks:[]};

                switch (result[2]) {
                    case 'css':
                            parser = new jscssp();
                            stylesheet = parser.parse(stylesheet, false, true);
                            page = that.compute_css(stylesheet);
                        break;
                    case 'less':
                            parser = new(less.Parser)({
                                paths: [configDir + '/'], // Specify search paths for @import directives
                            });
                            parser.parse(stylesheet, function (err, tree) {
                                stylesheet = tree;
                            });
                            page = that.compute_less(stylesheet);
                        break;
                    case 'sass':
                        console.log("Error", "Unsupported style type.");
                        /*require(['sass'], function (sass){
                            //parse
                        });*/
                        break;
                }

                console.log((new Date()).getTime() + " bottom", page)


                $('.kalei-sheet-submenu').slideUp(200);
                var submenu = $('<ul>');

                ////////////NEEDS TO BE EXPORTED TO Menu.js
                _.each(page.blocks, function (block) {
                    if (block.heading != "") {
                        submenu.append($('<li>').text(block.heading));
                    }
                });
                $('li:first-child', submenu).addClass('active');
                $('.kalei-sheet-submenu', $('[data-sheet="' + that.options.style + '"]')).html(submenu).slideDown(200);
                ////////////NEEDS TO BE EXPORTED TO Menu.js

                $(that.el).html(_.template(stylePageTemplate, {_:_, page: page, config: config}));

                //Colour Coding in code Block
                $(' code').each(function(i, e) {hljs.highlightBlock(e); });

                //Fixed by pivanov
                //that.compute_css
                $(".kalei-sheet-submenu li").on('click', function(ev) {
                    $('html, body').animate({
                        scrollTop: $(".kalei-comments h1:contains('"+$(ev.currentTarget).text()+"'), .kalei-comments h2:contains('"+$(ev.currentTarget).text()+"')").offset().top - 40
                    }, 400);
                });

                $(window).scroll(function () {
                    $(".kalei-documentation").each(function(){
                        if ( that.is_on_screen($(this), 40) ) {
                            $(".kalei-sheet-submenu li").removeClass('active');
                            $(".kalei-sheet-submenu li:contains('" + $(this).find('.kalei-comments > h1').text() +"'), .kalei-sheet-submenu li:contains('" + $(this).find('.kalei-comments > h2').text() +"')").addClass('active');
                        }
                    });
                });

                fixie.init();
            });
        },

        is_on_screen: function(el, offset) {

            var win = $(window);

            var viewport = {
                top : win.scrollTop()
            };

            viewport.bottom = viewport.top + win.height();

            var bounds = el.offset();

            return (!(viewport.top + offset < bounds.top || viewport.top > bounds.bottom));

        },

        compute_css: function(stylesheet) {
            console.log("compute_css()")
            var page = {
                blocks:[],
                css:"",
                stylesheets: []
            };
            console.log(stylesheet)
            _.each(stylesheet.cssRules, function(rule) {
                switch (rule.type) {
                    case 1: //Standard rule?
                        break;
                    case 3: //Import Rule (@import)
                        //we need to import jsscp doesnt compile imports
                        stylesheet.deleteRule(rule);
                        break;
                    case 101: //Comment Block
                        page.blocks = page.blocks.concat(that.parse_commentblock(rule.parsedCssText))
                        break;
                }
            });

            page.css = stylesheet.cssText()

            var parser = new(less.Parser);
            var stylesheet
            page.css = ".kalei-style-page{" + page.css + "}"
            parser.parse(page.css, function (err, tree) {
                stylesheet = tree;
            });

            page.css = stylesheet.toCSS({ compress: true });
            return page;
        },

        compute_less: function(stylesheet) {
            console.log("compute_less()", stylesheet)
            var page = {
                blocks:[],
                css:"",
                stylesheets: []
            };

            _.each(stylesheet.rules, function(rule) {
                if (rule.silent != null){ //Comment block
                    page.blocks = page.blocks.concat(that.parse_commentblock(rule.value))
                    //page.blocks.push();
                } else if (rule.rules != null) { //Standard Rule

                } else if (rule.path != null) { //Import Rule
                    // var previous_heading = page.blocks.length - 1;
                    // if (typeof page.blocks[previous_heading].import_rule == "undefined") {
                    //     page.blocks[previous_heading].import_rule = []
                    // }
                    // page.blocks[previous_heading].import_rule.push(rule.path)

                }
            });


            page.css = stylesheet.toCSS({ compress: true });
            page.css = ".kalei-style-page{" + page.css + "}";
            page.css = stylesheet.toCSS({ compress: true });
            return page;
        },

        parse_commentblock: function (comment_block_text) {
            //Remove /* & */
            comment_block_text = comment_block_text.replace(/(?:\/\*)|(?:\*\/)/gi, '');

            marked.setOptions(_.extend({ sanitize: false, gfm: true }, config.marked_options || {}));
            var lexedCommentblock = marked.lexer(comment_block_text);
            var lexerLinks = lexedCommentblock.links || {}; // lexer appends definition links to returned token object

            var return_val = [];
            var block_def = {
                content: [],
                heading: "",
            };
            var block = _.clone(block_def);

            _.each(lexedCommentblock, function (comment) {
                switch (comment.type) {
                    case "code":
                        //Push the code for an example
                        block.content.push({
                          type: 'html',
                          text: '<div class="codedemo">' + comment.text + '<div style="clear: both;"></div></div>'
                        });
                        //Push the code section so marked can parse it as a <pre><code> block
                        comment.text = comment.text.replace(/class=([""'])fixie\1|(?![""' ])fixie(?=[""' ])/g, "")
                        block.content.push(comment);
                        break;
                    case "heading":
                        if (block.heading != "") {  //Multiple headings in one comment block
                                                    //We want to break them up
                            //Parse the content blocks and return the HTML to display
                            block.content.links = lexerLinks
                            block.content = marked.parser(block.content)
                            return_val.push(block);
                            block = _.clone(block_def);
                        }
                        if (comment.depth <= 2) {
                            block.heading = comment.text;
                            block.content.push(comment);
                        } else if (comment.depth == 3) { //Import statement title
                            block.stylesheet = comment.text;
                            //block.heading = "Stylesheets"
                            //this is an import statement
                            //if ($.inArray("Stylesheets", ))
                            //console.log("else", comment)
                        }
                        break;
                    default:
                        //Push everything else
                        block.content.push(comment);
                        break;
                } //Switch
            });

            //Parse the content blocks and return the HTML to display
            block.content.links = lexerLinks
            block.content = marked.parser(block.content)

            return_val.push(block);
            return return_val;
        },

    });
    return StylePage;
});
