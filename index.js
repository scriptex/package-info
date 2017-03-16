'use strict';
const got = require('got');
const registryUrl = require('registry-url')();
const zip = require('lodash.zip');

/*function request(name) {
	return got.head(registryUrl + name.toLowerCase())
		.then(() => false)
		.catch(err => {
			if (err.statusCode === 404) {
				return true;
			}

			throw err;
		});
}

module.exports = name => {
	if (!(typeof name === 'string' && name.length !== 0)) {
		return Promise.reject(new Error('Package name required'));
	}

	return request(name);
};*/

module.exports = function (name, cb) {
	got(registryUrl + encodeURIComponent(name), {method: 'GET'}, function (err, data) {
		var name 		= '';
		var version 	= '';
		var description = '';
		var license 	= '';
		var homepage 	= '';
		var author_name = '';

		if (err === 404) {
			return cb(new Error('Package doesn\'t exist'));
		}

		if (err) {
			return cb(err);
		}

		var data_parsed = JSON.parse(data);
		var name 		= data_parsed.name;
		var version 	= data_parsed[ 'dist-tags' ].latest;
		var description = data_parsed.description;
		var license 	= data_parsed.license;

		if(data_parsed.homepage !== undefined){
			var homepage 	= data_parsed.homepage;
		}

		if(data_parsed.author !== undefined){
			var author_name = data_parsed.author.name;
		}
		else{
			if(data_parsed.maintainers !== undefined){
				for (var i in data_parsed.maintainers) {
					var maintainer = data_parsed.maintainers[i];
					if(author_name == ''){
						author_name = maintainer.name;
					}
					else{
						author_name = author_name + ', ' + maintainer.name;
					}
				}
			}
		}

		cb(null, {
			name          	: name,
			version			: version,
			description		: description,
			license			: license,
			homepage		: homepage,
			author			: author_name
		});
	});
};
