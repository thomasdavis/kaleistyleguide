define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/index.html',
  'jscssp',
  'text!../../../../styles.css'
], function($, _, Backbone, styleIndexTemplate, jscssp, styles){
  var DashboardPage = Backbone.View.extend({
    el: '.style-page',
    render: function () {
		     
      $(this.el).html(_.template(styleIndexTemplate, {_:_}));
      
    }
  });
  return DashboardPage;
});
