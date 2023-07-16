let version = "20";
let cacheName = "Smart-Recharge-v:" + version;
let sharedData = {};
let appShellFiles = [
    "./src/images/menu.png",
    "./src/images/edit.png",
    "./src/images/tick.png",
    "./src/images/gallery.png",
    "./src/images/contact.png",
    "./src/images/rescan.png",
    "./src/images/flashlight on.png",
    "./src/images/flashlight off.png",
    "./src/images/safaricom.png",
    "./src/images/airtel.png",
    "./src/images/telkom.png", 
    "./src/images/cancel.png", 
    "./src/images/logo icon (16x16).png", 
    "./src/images/logo icon (32x32).png", 
    "./src/images/logo icon (48x48).png", 
    "./src/images/logo icon (96x96).png", 
    "./src/images/logo icon (144x144).png", 
    "./src/images/logo icon (192x192).png", 
    "./src/images/logo icon (256x256).png", 
    "./src/images/logo.png", 
    "./src/images/logo.ico", 
    "./src/app.js",
	"./src/app.css", 
	"./src/version.js",
    "./eruda/eruda.min.js", 
    "./tesseract/tesseract.js", 
    "./index.js",
    "./index.css",
    "./index.html",
    "./manifest.webmanifest", 
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(appShellFiles);
        })
    )
});

self.addEventListener("fetch", (e) => {
	let url = new URL(e.request.url);
	if(e.request.method == "POST" && url.searchParams.has("share-target")) {
		e.respondWith(Response.redirect('./index.html'));
		e.waitUntil(async function () { 
			try {
				let data = await e.request.formData();
				let link = data.get("link") || "";
				let image = data.get("img") || "";
				sharedData = {image, link};
			} catch (error) {
				sharedData = {error}
			} 
		}());
		return;
		
	} 
    e.respondWith(
        caches.match(e.request.url.split("?")[0].replace(/html\/.*$/i, 'html').replace(/smart.recharge\/$/i, (t) => t + "index.html"), {cacheName, ignoreSearch: true}).then( async (res) => {
			if(res && !/version.js.*$/gi.test(e.request.url)) {
            	return res;
            }
            
            return fetch(e.request).then((res2) => {
            	if(res2.status != 200) {
	            	return res || res2;
            	} 
            	
                return caches.open(cacheName).then((cache) => {
                    cache.put(e.request.url.split("?")[0], res2.clone());
                    return res2;
                }).catch((error) => {
					return res2;
				});
            }).catch((error) => {
            	return res || new Response(null, {"status": 200});
            });
		})
    )
});

self.addEventListener("activate", (e) => {
    const keepList = [cacheName];
    
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(keepList.indexOf(key) === -1) {
                    return caches.delete(key);
                } 
            }))
        })
    )
});

self.addEventListener("message", async (e) => {
	if(e.data && e.data.type == "skip-waiting") {
		self.skipWaiting();
	} 
	else if(e.data && e.data.type == "ready") {
		let clients = await self.clients.matchAll({type: "window"});
		for(let client of clients) {
			if(sharedData.link != undefined && sharedData.image != undefined)
				client.postMessage({type: "shared-data", link: sharedData.link, image: sharedData.image});
			else if(sharedData.error) 
				client.postMessage({type: "shared-data", error: sharedData.error});
		} 
			
	} 
});