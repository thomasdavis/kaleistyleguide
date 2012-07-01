define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/page.html',
  'jscssp',
  'config',
  'pagedown',
  'libs/marked/marked',
  'libs/highlight/highlight'
], function($, _, Backbone, stylePageTemplate, jscssp, config, Pagedown, marked, hljs){
  var StylePage = Backbone.View.extend({
    el: '.style-page',
    render: function () {
      $('head').append('<link rel="stylesheet" href="' + config.css_path + '"" type="text/css" />');
      var converter = new Pagedown.Converter();
      var that = this;
      var configDir = config.css_path.substr(0, config.css_path.lastIndexOf('/'));
		 require(['text!'+ configDir + '/' + this.options.style], function (stylesheet){
        var parser = new jscssp();
        marked.setOptions({ sanitize: false, gfm: true });
        var stylesheet = parser.parse(stylesheet, false, true);
        var blocks = [];
        var currentBlock = {
          comments: [],
          css: ''

        };

        _.each(stylesheet.cssRules, function(rule) {
    			if(rule.type === 101) {
    			  var comment = rule.parsedCssText;
            comment = comment.replace('/*', '');
            comment = comment.replace('*/', '');
            var comments = marked.lexer(comment);
            _.each(comments, function (comment) {


              if(comment.type === 'heading' && comment.depth <= 2) {
                currentBlock.css = css_beautify(currentBlock.css);
                if(currentBlock.comments.length !== 0 || currentBlock.css !== '') {
                  currentBlock.comments = marked.parser(currentBlock.comments);
                  blocks.push(_.extend({}, currentBlock));
                  currentBlock.comments = [];
                  currentBlock.css = '';
                }
              }
              if(comment.type === 'code'){
                currentBlock.comments.push({
                  type: 'html',
                  text: '<div class="codedemo">' + comment.text + '<div style="clear: both;"></div></div>'
                })
              };
              currentBlock.comments.push(comment);
            
            });

    			}
          if(rule.type === 1) {
            currentBlock.css += rule.parsedCssText;

          }
          if(rule.type === 3) {
            console.log(rule);
            currentBlock.comments.push({
                  type: 'code',
                  text: rule.parsedCssText
                });

          }

		    });
   
        currentBlock.css = css_beautify(currentBlock.css);

        currentBlock.comments = marked.parser(currentBlock.comments);
        blocks.push(currentBlock);
        $(that.el).html(_.template(stylePageTemplate, {_:_, blocks: blocks, config: config}));
        $(' code').each(function(i, e) {hljs.highlightBlock(e); });

         fixie.init();
        
      });

      
    }
  });
  return StylePage;
});
