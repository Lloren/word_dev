'use strict';

importScripts('js/config.js');
var cache = false;

self.addEventListener('install', event => {
	console.log("install", event);
});

self.addEventListener('activate', event => {
	console.log("active", event);
	caches.open("site_cache").then(cache_obj => {
		cache = cache_obj;
	});
	fetch(base_url+"/app_version.json").then(response => {
		console.log(response);
	});
});

self.addEventListener('fetch', event => {
	console.log("fetch", event.request.url, event);
	
	//if (dev)
	//	return;
	
	event.respondWith(
		cache.match(event.request).then(function(response) {
			if (response) {
				console.log('Found response in cache:', response);
				
				return response;
			}
			var url = event.request.url;
			console.log('No response found in cache. About to fetch from network...', url);
			
			if (!url.match(new RegExp(base_url)))
				url = base_url+"/app/"+url;
			return fetch(url).then(function(response) {
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