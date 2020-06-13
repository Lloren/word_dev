'use strict';

importScripts('js/config.js');

self.addEventListener('install', event => {
	console.log("active", event);
});

self.addEventListener('activate', event => {
	console.log("active", event);
	fetch(url+"/app/version.json").then(response => {
		console.log(response);
	});
});

self.addEventListener('fetch', event => {
	console.log("fetch", event);
	
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				console.log('Found response in cache:', response);
				
				return response;
			}
			console.log('No response found in cache. About to fetch from network...');
			
			var nf = event.request.clone();
			nf.url = url+"/app/"+nf.url;
			return fetch(nf).then(function(response) {
				console.log('Response from network is:', response);
				
				cache.put(event.request, response.clone());
				return response;
			}).catch(function(error) {
				console.error('Fetching failed:', error);
				
				throw error;
			});
		})
	);
});