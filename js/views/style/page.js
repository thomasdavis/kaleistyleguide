define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/page.html',
  'jscssp',
  'config'
], function($, _, Backbone, stylePageTemplate, jscssp, config){
  var StylePage = Backbone.View.extend({
    el: '.style-page',
    render: function () {
      var that = this;
		 require(['text!'+ config.css_path + '/' + this.options.style], function (stylesheet){
       var parser = new jscssp();

        var stylesheet = parser.parse(stylesheet, false, true);
        $(that.el).html(_.template(stylePageTemplate, {_:_, stylesheet: stylesheet}));
        _.each($('iframe'), function(iframe) {
          $(iframe).contents().find('body').html($(iframe).attr('data-content'));
          if($(iframe).hasClass('all-styles')) {
            $(iframe).contents().find('body').append('<style>'+stylesheet.cssText()+'</style>');
          } else {
            $(iframe).contents().find('body').append('<link rel="stylesheet" href="' + config.css_path + '/styles.css" />');
          }
         fixie.init($(':empty', $('iframe').contents().find('body')));
        });
        SyntaxHighlighter.highlight();
      });

      
    }
  });
  return StylePage;
});
