define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/menu.html',
  'jscssp',
  'config'
], function($, _, Backbone, dashboardPageTemplate, jscssp, config){
  var DashboardPage = Backbone.View.extend({
    el: '.style-menu',
    render: function () {
      var that = this;
      that.$el.html('Loading styles');
      require(['text!' + config.css_path + '/styles.css'], function (styles) {

        var parser = new jscssp();
        var sheet = parser.parse(styles, false, true);
        console.log(sheet);
        var rules = [];
        _.each(sheet.cssRules, function (rule){
          var cssObj = {};
          if(rule.type === 101) {
            var css = rule.parsedCssText;
            css = css.replace('/*', '');
            css = css.replace('*/', '');
            var cssLines = css.split('\n');
            _.each(cssLines, function(line){
             var splits = line.match(/([^:]*)\:(.*)/);
              console.log(splits);
              if(splits !== null) {
                cssObj[splits[1].toLowerCase()] = splits[2];
              }
            });
          };
          rule.metadata = cssObj;
          rules.push(rule);
        });



        var importRules = _.filter(sheet.cssRules, function (rule) {
          if(rule.type === 3){
            return true;
          } 
          console.log(rule.metadata + 'asasd');
          if(rule.type === 101 && typeof rule.metadata.category !== 'undefined') {
            return true;

          }
        });
        
     
        $(that.el).html(_.template(dashboardPageTemplate, {_:_, importRules: importRules}));
        $('[href="' + window.location.hash + '"]').addClass('active');
      });
      
    },
    events: {
      'click a': function (ev) {
        this.$el.find('a.active').removeClass('active');
        $(ev.currentTarget).addClass('active');
      }
    }
  });
  return DashboardPage;
});
