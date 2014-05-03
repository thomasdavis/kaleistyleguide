define({
	// This css path is used as a default by the Kalei project it self.
	css_path: window.location.protocol + '//' + window.location.hostname + (window.location.port === '' ? '' : ':'+ window.location.port) + window.location.pathname +  'css/styles.css',

	// You can configure any path by just deleting the one above and uncommenting the one below to point at your css directory
	// css_path: 'http://pospi.booty/kaleistyleguide/css/styles.css',

	// You can manually list the css files to process by giving a css_paths array
	//css_paths: ['../css/styles.css', '../css/buttons.css'],

	// By default, Kalei parses raw CSS files using the jscssp library.
	// If you'd rather use a different processor or preprocessor, you can choose from the below:
	css_processor:
		'jscssp',
		// 'less',

	// You can optionally set configuration for marked.js
	marked_options: {
		tables: true
	}

	//disqus_shortname: 'kaleistyleguide'
});
