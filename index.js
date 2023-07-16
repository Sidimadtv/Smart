'use strict' 
const ShowInstallPrompt = () => {
	$(".install_prompt").style.display = "block";
    $(".install_prompt").classList.remove("hide_install_prompt");
    $(".install_prompt").classList.add("show_install_prompt");
} 

const HideInstallPrompt = () => {
    $(".install_prompt").classList.remove("show_install_prompt");
    $(".install_prompt").classList.add("hide_install_prompt");
    setTimeout(() => {$(".install_prompt").style.display = "none"}, 600);
} 

const InstallApp = async () => {
    HideInstallPrompt();
    deferredEvent.prompt();
    const {outcome} = await deferredEvent.userChoice;
    deferredEvent = null;
} 
window._$ = function (elem, property, float) {
    if(float) 
        return parseFloat(window.getComputedStyle(elem, null).getPropertyValue(property));
    return window.getComputedStyle(elem, null).getPropertyValue(property);
} 
window._$$ = function (child, parent) {
    child = child.getBoundingClientRect();
    if(parent) {
        let childTop = child.top;
        let childLeft = child.left;
        parent = parent.getBoundingClientRect();
        let parentTop = parent.top;
        let parentLeft = parent.left;
        let top = childTop - parentTop;
        let left = childLeft - parentLeft;
        return {top, left, width: child.width, height: child.height};
    } 
    else {
        return child;
    } 
} 
window.$ = function (elem) {
    return document.querySelector(elem);
} 

window.$$ = function (elem) {
    return document.querySelectorAll(elem);
}

window.$$$ = function (type, data = []) {
    if(!Array.isArray(data)) {
		throw new Error("Data object passed is not an array. At $$$ line: 658");
	} 
    let elem = document.createElement(type);
    for(let i = 0; i < data.length; i+=2) {
    	if(/^(innerHTML|textContent)$/gi.test(data[i]))
    		elem[data[i]] = data[i+1];
    	else
    		elem.setAttribute(data[i], data[i+1]);
    } 
    return elem;
} 
Element.prototype.$ = function (elem) {
	return this.querySelector(elem);
} 
Element.prototype.$$ = function (elem) {
	return this.querySelectorAll(elem);
} 

var reg;
var currentAppVersion = "6.2.3.20";
var deferredEvent;
var storage = null;
try {
    storage = localStorage;
} catch (error) {}

function pageComplete () {
	$(".install_prompt .head h3").textContent = "Version Info: V" + currentAppVersion;
	$(".load .load_footer h3").textContent = "Version Info: V" + currentAppVersion;
	$(".about_window .head h3").textContent = "Version Info: V" + currentAppVersion;
	

    const head = document.head;
    const SheetLink = $$$("link", ["rel", "stylesheet", "href", "./src/app.css"]);
	const JsLink1 = $$$("script", ["src", "./src/app.js"]);
	const JsLink2 = $$$("script", ["src", "./src/version.js"]);
	const JsLink3 = $$$("script", ["src", "./tesseract/tesseract.js"]);

	SheetLink.onload = (event) => LoadedExternalFiles.run(event);
	JsLink1.onload = (event) => LoadedExternalFiles.run(event);
	JsLink2.onload = (event) => LoadedExternalFiles.run(event);
	JsLink3.onload = (event) => LoadedExternalFiles.run(event);
	
	head.appendChild(SheetLink);
    head.appendChild(JsLink1);
    head.appendChild(JsLink2);
    head.appendChild(JsLink3);
} 

class LoadedExternalFiles {
	static total = 4;
	static n = 0;
	static run = async (event) => {
		this.n++;
		if(this.n == this.total) {
			LoadResources();
		} 
	} 
	static error = (error) => {
		alert("LOADING ERROR \n\n Failed to load AppShells files. Please check your internet connection and try again.");
	} 
} 

const Message = async (e) => {
	if(e.data.type == "shared-data") {
		if(e.data.error) {
			Notify.popUpNote("Unacceptable file format.");
		} 
		else {
			let link = e.data.link;
			let image = e.data.image;
			let path = image? URL.createObjectURL(image): link;
			if(link.length && !/(png|jpg|jpeg|bmp|pbm)$/.test(link))
				return Notify.popUpNote("Unacceptable file format.");
			let cropFrame = $(".crop_frame");
            let img = $(".crop_container img");
            cropFrame.style.width = "160px";
            cropFrame.style.height = "80px";
            cropFrame.style.top = "calc(50% - 40px)";
            cropFrame.style.left = "calc(50% - 80px)";
            img.style.width = "100%";
            img.style.height = "100%";
            img.src = path;
            Drag.init = {};
            $(".crop .footer button:first-of-type").classList.remove("disable");
	        $(".scan").style.display = "none";
	        $(".crop").style.display = "grid";
	        if(Stream.started) Stream.pause();
		} 
	} 
} 

const InvokeSWUpdateFlow = async () => {
	if(_$($(".install_prompt"), "display") == "block") return;
	let versionDescription = await Updates.getDescription();
	let version = Updates.version;
	let action = await Notify.confirm({ 
		header: "APP UPDATE", 
		message: "<label style='display: block; text-align: left;'>Thank you for using Mi-List.<br>There is a new version of this app. All you need is to refresh.<br>New version: " + version + "</label><span>What's New?</span>" + versionDescription + "<label style='display: block; text-align: left;'>Do you want to update?</label>", 
		type: "Later/Update"
	});
	
	if(action == "Update") {
		Notify.alertSpecial({
				header: "Updating Smart-Recharge...",
				message: "Please Wait as we update the app. This may take a few seconds depending n the speed of your bandwidth."
		});
		
		await reg.waiting.postMessage({type: "skip-waiting"});
	} 
	else {
		Notify.popUpNote("App update declined.");
		if(deferredEvent)
			ShowInstallPrompt();
	} 
} 

const FinishInstalling = async () => {
	if(reg.waiting) {
		if(_$($(".load"), "display") == "none") {
			await navigator.serviceWorker.ready
			if(reg.waiting)
				InvokeSWUpdateFlow();
		} 
	} 
} 

window.addEventListener("error", (error) => {
	event.preventDefault();
	console.log(error.message + " \n\tat " + error.filename + ": " + error.lineno + ":" + error.colno);
	let option = confirm("ERROR MESSAGE\n\nThere was an unexpected error. We recommend you refresh the page. If this error persists even after refreshing, please contact via:\n\nTel: +254 798 916984\nWhatsApp: +254 798 916984\nEmail: markcodes789@gmail.com\n\nPress OK to refresh.");
	if(option) 
		location.reload();
});

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    if(deferredEvent == "passed") {
    	deferredEvent = e;
    	try {
    		setTimeout(ShowInstallPrompt, 1);
		} catch (error) {
			reportError(error);
		} 
	} 
    else {
		deferredEvent = e;
	}
});

window.addEventListener("load", async () => {
	if("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
        if("serviceWorker" in navigator) {
        	navigator.serviceWorker.onmessage = Message;
			reg = await navigator.serviceWorker.register("./sw.js");
			reg.addEventListener("updatefound", async () => {
				if(reg.installing) {
					reg.installing.addEventListener("statechange", () => {
						FinishInstalling();
					});
				} 
			});
			
			let refreshing = false;
			navigator.serviceWorker.addEventListener("controllerchange", (e) => {
				if(!refreshing) {
					location.reload();
					refreshing = true;
				} 
			});
			
			pageComplete();
		} 
		else {
        	alert("OFFLINE REGISTRATION FAILURE\n\nCan't Register an offline version of this app because your browser don't support this capability. However you can still access it only while online. If you however really need the offline version, try: \n\n1. Update your browser. or\n2. try another browser, preferably chrome.");
            pageComplete();
        }
	} 
	else {
		alert("This app is not compatible with your current browser. Try another browser preferably chrome.");
		window.close();
	} 
});