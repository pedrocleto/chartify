'use strict';

var Firebase = require('firebase');

var firebase = (function(){
	var BASE_URL = 'https://chartify.firebaseio.com/',
	getRef = function() {
		return new Firebase(BASE_URL);
	};

	return{
		getRef:getRef
	}
}());

module.exports = firebase;