define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/style/page.html',
  'less',
  'config',
  'pagedown',
  'libs/marked/marked',
  'libs/highlight/highlight',
  'libs/parseuri/parseuri',
  'libs/waypoints/waypoints'
], function($, _, Backbone, stylePageTemplate, less, config, Pagedown, marked, hljs, parseuri, waypoints){
  var StylePage = Backbone.View.extend({
    el: '.kalei-style-page',
    render: function () {
      var that = this,
      	  $sheet = $('<link rel="stylesheet/less" href="' + config.css_path + '" />');

      // update menu to indicate what's being viewed
        $('a.kalei-styleguide-menu-link').removeClass('active');
        $('[href="' + window.location.hash + '"]').addClass('active');
        if(window.location.hash === '') {
          $('.js-kalei-home').addClass('active');
        }

      // determine the URL to the style we're currently viewing
      var styleUrl;
      if(this.options.style === null) {
        this.options.style = config.css_path.substr(config.css_path.lastIndexOf('/')+1);
      }
      if(this.options.style.substr(0,1) === '/') {
        // non relative
        var configDir = config.css_path.substr(0, config.css_path.lastIndexOf('/'));
        var pUrl = parseuri(configDir);
        styleUrl = pUrl.protocol + '://' + pUrl.host + (pUrl.port === '' ? '' : ':'+ pUrl) + this.options.style;
      } else {
        var configDir = config.css_path.substr(0, config.css_path.lastIndexOf('/'));
        styleUrl = configDir + '/' + this.options.style;
      }

      // init the LESS parser
      var parser = new(less.Parser)({
			paths: [configDir + '/', './'], 		// Specify search paths for @import directives
			filename: config.css_path.substr(config.css_path.lastIndexOf('/')+1)
		});

      // render all the CSS we need to deal with
      $('head').append($sheet);
      less.sheets.push($sheet[0]);
      less.refresh();

      // parse it for demo markup and render to the page
	   require(['text!'+ styleUrl], function (stylesheet){

        marked.setOptions({ sanitize: false, gfm: true });

		var blocks = [],
	        currentBlock = {
	          comments: [],
	          css: ''
	        },
        	headings = [];

	 	parser.parse(stylesheet, function(err, tree) {
			if (err) { return console.error(err); }

			// parse comments with MarkDown
			_.each(tree.rules, function(rule) {
				if (rule.value !== undefined && rule.rules === undefined && !rule.variable) {
					var comment = rule.value;

					// skip single-line comments
					if (comment.substr(0, 2) == '//') {
						return;
					}

		            comment = comment.replace('/*', '');
		            comment = comment.replace('*/', '');

		            var comments = marked.lexer(comment);
		            _.each(comments, function (comment) {


		              if(comment.type === 'heading' && comment.depth <= 2) {
		                headings.push(comment.text);
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
			});

			currentBlock.css += tree.toCSS();	// append all CSS to the input
		});

		// draw menu
      	$('.sheet-submenu').slideUp(200);

        var submenu = $('<ul>');
        _.each(headings, function (heading) {
          submenu.append($('<li>').text(heading));
        });
        $('li:first-child', submenu).addClass('active');
        $('.sheet-submenu', $('[data-sheet="' + that.options.style + '"]')).html(submenu).slideDown(200);

        currentBlock.css = css_beautify(currentBlock.css);
        currentBlock.comments = marked.parser(currentBlock.comments);
        blocks.push(currentBlock);

        // draw page
        $(that.el).html(_.template(stylePageTemplate, {_:_, blocks: blocks, config: config}));

        // syntax highlighting
        $(' code').each(function(i, e) {hljs.highlightBlock(e); });

        $('.kalei-comments-container > .kalei-comments > h2, .kalei-comments-container > .kalei-comments  > h1').waypoint(function(ev) {
          console.log(arguments);
         $('.sheet-submenu li').removeClass('active');
           $('.sheet-submenu li:contains('+$(ev.currentTarget).text()+')').addClass('active');
        }, {
   offset: 20  // middle of the page
});

        $("body").on('click', '.sheet-submenu li', function(ev) {

             $('html, body').animate({
                 scrollTop: $(".kalei-comments h2:contains('"+$(ev.currentTarget).text()+"'),.kalei-comments h1:contains('"+$(ev.currentTarget).text()+"')").offset().top - 20
             }, 200);
         });

         fixie.init();

      });


    }
  });
  return StylePage;
});
