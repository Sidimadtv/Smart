const srcs = [
    "menu.png",
    "safaricom.png",
    "airtel.png",
    "telkom.png", 
    "edit.png",
    "tick.png",
    "gallery.png", 
    "contact.png",
    "logo.png", 
    "rescan.png",
    "flashlight on.png",
    "flashlight off.png",
    "cancel.png"
];

const imageProps = [
    "--menu-icon", 
    "--safaricom-icon", 
    "--airtel-icon", 
    "--telkom-icon", 
    "--edit-icon", 
    "--tick-icon", 
    "--gallery-icon", 
    "--contact-icon",
    "--recharge-icon", 
    "--rescan-icon", 
    "--flashlight-on-icon",
    "--flashlight-off-icon",
    "--cancel-icon"
];

const LoadResources = async (i = 0) => {
    let src = "./src/images/" + srcs[i];
    let response = await fetch(src);
    if(response.status == 200) {
        let arrBuff = await response.arrayBuffer();
        if(arrBuff.byteLength > 0) {
            src = await URL.createObjectURL(new Blob([arrBuff], {type: "image/png"}));
            srcs[i] = src;
            document.documentElement.style.setProperty(imageProps[i], `url(${src})`);
            if(i == 3) 
            	setTimeout(LoadingDone, 500);
            
            if(i < srcs.length-1)
                LoadResources(i+1);
        } 
        else {
            Notify.alert({
	        	header: "BUFFER ERROR", 
				message: "Failed to buffer - " + src
			});
        } 
    } 
    else {
        Notify.alert({
        	header: "LOADING ERROR", 
			message: "Failed to load AppShellFiles - " + src + ". Either you have bad network or you have lost internet connection."
		});
    } 
}

const LoadingDone = async () => {
	await Stream.initTesseract();
    await ImageProps.init();
    $(".spinner").style.animationPlayState = "paused";
    $(".load").style.display = "none";
    $(".main").style.display = "grid";
    $(".about").addEventListener("click", About, false);
    $(".contact_picker").addEventListener("click", PickContact, false);
    $("input[type=text]").addEventListener("keyup", Edit.text, false);
    $("input[type=tel]").addEventListener("keyup", Edit.tel, false);
    $$(".main .footer button")[0].addEventListener("click", () => Scan(false), false);
    $$(".main .footer button")[1].addEventListener("click", () => Scan(true), false);
    $$(".other_number .footer button")[0].addEventListener("click", () => Scan(true), false);
    $$(".other_number .footer button")[1].addEventListener("click", () => Scan(true, true), false);
    $$(".visible_footer button")[0].addEventListener("click", Flashlight, false);
    $$(".visible_footer button")[1].addEventListener("click", Home, false);
    $("#image-file").addEventListener("input", Import.image, false);
    $("#image-file").addEventListener("click", Import.click, false);
    $$(".hidden_footer .footer button")[0].addEventListener("click", () => Edit.makeEditable(true), false);
    $$(".hidden_footer .footer button")[1].addEventListener("click", Call, false);
    $$(".hidden_footer .footer button")[2].addEventListener("click", Rescan, false);
    $$(".options button")[0].addEventListener("click", Options.share, false);
    $$(".options button")[1].addEventListener("click", Options.update, false);
    $$(".options button")[2].addEventListener("click", Options.support, false);
    $$(".options button")[3].addEventListener("click", Options.developer, false);
    $$(".options button")[4].addEventListener("click", Options.feedback, false);
    $$(".options button")[5].addEventListener("click", Options.contact, false);
    $$(".options button")[6].addEventListener("click", Options.follow, false);
    $$(".options button")[7].addEventListener("click", Options.moreApps, false);
    $(".about_window .footer button").addEventListener("click", Options.back, false);
    $$(".crop .footer button")[0].addEventListener("click", ImageProps.takeSnap, false);
    $$(".crop .footer button")[1].addEventListener("click", Import.exit, false);
    $$(".recharged .footer button")[0].addEventListener("click", () => Scan(false), false);
    $$(".recharged .footer button")[1].addEventListener("click", Home, false);
    
    
    for(let elem of $$(".crop_container img, .crop_frame, .crop_frame div")) {
        elem.addEventListener("touchstart", Drag.start, false);
        elem.addEventListener("touchmove", Drag.move, false);
    } 
    
    for(let sim of $$("input[type=radio]")) {
        sim.addEventListener("change", ChangeSim, false);
    } 
    Stream.video = $("video");
    Stream.laser = $(".laser");
    Stream.canvas = $$$("canvas");
    CONSTRAINTS.video.height.ideal = parseInt(_$($(".scan"), "grid-template-columns").split(" ")[0]);
    CONSTRAINTS.video.width.ideal = parseInt(_$($(".scan"), "grid-template-rows").split(" ")[1]);
    
    if('contacts' in navigator && navigator.contacts.select) {
        $(".contact_picker").classList.remove("disable", "enable");
        $(".contact_picker").classList.add("enable");
    } 
    
    if(deferredEvent) {
        setTimeout(() => {
            ShowInstallPrompt();
        }, 500);
    } 
    else if(reg.waiting) {
    	InvokeSWUpdateFlow();
    } 
    if(navigator.serviceWorker.controller)
    	navigator.serviceWorker.controller.postMessage({type: "ready"});
    history.pushState(null, "", "");
} 

function reportError(error) {
	console.log(error);
	Notify.popUpNote("ERROR MESSAGE<br><br>An error occurred<br>********<b>Description</b>********<br>" + error.message);
} 

const End = (event) => {
    if(event.animationName === "pop-out") {
        let popUpNote = $("#pop-up-note");
        popUpNote.style.display = "none";
    } 
    else if(event.animationName === "fade-note") {
        event.target.removeAttribute("onanimationend");
        event.target.style.display = "none";
        event.target.classList.remove("fade_note");
    }
} 

const About = () => {
    $(".about_window").style.display = "block";
    $(".main").style.display = "none";
} 

class Options {
    static share = () => {
        if(navigator.canShare) {
            navigator.share({
                title: "Smart Recharge", 
                text: "Hey, i use Smart Recharge to recharge my phone. Try it out\n\n", 
                url: "https://mark-code789.github.io/Smart-Recharge/index.html"
            }).catch( (error) => { 
            	let message = error.toString().split(":");
                if(message[0] != "AbortError") 
                    Notify.popUpNote(`There was an error while sharing.`);
            });
        } 
        else {
            Notify.popUpNote("This browser doesn't support this function.");
        } 
    } 
    static update = () => {
    	if(!navigator.onLine) return Notify.popUpNote("Please connect to an internet and try again.");
		Notify.alertSpecial({
				header: "Checking for update...",
				message: "Please wait as we run the check."
		});
		location.reload();
    } 
    static support = async () => {
    	await Notify.alert({
			header: "SUPPORT LINES",
			message: "<label>If you have been impressed by this work, support me and let's achieve milestone through coding and programming.<br><br>" +
					 "Support line: <b>0798916984</b><br>Name: <b>Mark Etale</b></label>"
		});
    } 
    static developer = () => {
    	location.href = "https://mark-code789.github.io/Portfolio";
    } 
    static feedback = () => {
        window.location.href = "mailto:marxeto8@gmail.com? &subject=Smart Recharge: " + navigator.userAgent;
    } 
    static contact = () => {
        if(navigator.onLine) 
        	window.location.href = "https://wa.me/+254798916984?";
        else
            Notify.popUpNote("You are offline");
    } 
    static follow = async () => {
    	window.location.href = "https://www.facebook.com/Mark-Codes-101930382417960/";
    } 
    static moreApps = async () => {
    	await Notify.alert({
			header: "MORE APPS",
			message: "<span>Mi List App</span><ul><li>Manage your to-do list as well as receive notification reminders when they are due with Mi-List app.<br><a href='https://mark-code789.github.io/Mi-List/'>Try it now!</a></li></ul><br>" +
					 "<span>Checkers App</span><ul><li>Play both online and offline with friends and family or challenge your self against the computer with over 8 levels.<br><a href='https://mark-code789.github.io/Checkers'>Try it now!</a></li></ul>"
		});
    } 
    static back = () => {
        $(".about_window").style.display = "none";
        $(".main").style.display = "grid";
    } 
} 

const PickContact = async () => {
    try {
        let contact = await navigator.contacts.select(['tel']);
        if(contact.length > 0 && contact[0].tel.length > 0) {
            contact = contact[0].tel[0].replace(" ", "");
            Edit.tel(contact);
        } 
        else {
            $("input[type=tel]").focus();
        } 
    } catch (error) {
        $(".contact_picker").classList.remove("enable", "disable");
        $(".contact_picker").classList.add("disable");
        $("input[type=tel]").focus();
    } 
} 

const ChangeSim = e => {
    let elem = e.target;
    $(".main .header h2").innerHTML = elem.value;
    $$(".main .footer button")[1].classList.remove("enable", "disable");
    SIM.carrier = elem.value;
    switch(elem.value) {
        case "Safaricom":
        SIM.code = "*141*";
        SIM.group = 4;
        $$(".main .footer button")[1].classList.add("enable");
        break;
        
        case "Airtel":
        SIM.code = "*130*";
        SIM.group = 5;
        $$(".main .footer button")[1].classList.add("disable");
        break;
        
        case "Telkom":
        SIM.code = "*130*";
        SIM.group = 4;
        $$(".main .footer button")[1].classList.add("disable");
        break;
        
        default:
        SIM.code = "";
        SIM.group = 4;
        $$(".main .footer button")[1].classList.add("disable");
    } 
} 

class Import {
    static image = (e) => {
        let path = e.target.files[0];
        if(path) {
            let cropFrame = $(".crop_frame");
            let image = $(".crop_container img");
            cropFrame.style.width = "160px";
            cropFrame.style.height = "80px";
            cropFrame.style.top = "calc(50% - 40px)";
            cropFrame.style.left = "calc(50% - 80px)";
            image.style.width = "100%";
            image.style.height = "100%";
            image.src = URL.createObjectURL(path);
            $(".crop .footer button:first-of-type").classList.remove("disable");
            $(".scan").style.display = "none";
            $(".crop").style.display = "grid";
            Drag.init = {};
            e.target.value = '';
            Stream.pause();
        } 
    } 
    static exit = (e) => {
        $(".scan").style.display = "grid";
        $(".crop").style.display = "none";
        Stream.start();
    } 
    static click = (e) => {
    	if(Stream.running)
        	Stream.pause();
    } 
} 

const Flashlight = e => {
    if(typeof e != "object") {
        let torch = e;
        e = {target: $(".flashlight")}
        e.target.classList.remove("flashlight_on", "flashlight_off");
        if(torch == true) {
            e.target.classList.add("flashlight_off");
        } 
        else {
            e.target.classList.add("flashlight_on");
        } 
    } 
    
    if(e.target.classList.contains("flashlight_on")) {
        e.target.classList.remove("flashlight_on");
        e.target.classList.add("flashlight_off");
        Stream.flashlight(false);
    }
    else {
        e.target.classList.remove("flashlight_off");
        e.target.classList.add("flashlight_on");
        Stream.flashlight(true);
    } 
} 

const Home = () => {
    $(".main").style.display = "grid";
    $(".scan").style.display = "none";
    $(".recharged").style.display = "none";
    if(Stream.running) Stream.pause();
} 

const Scan = async (anotherNo, cancel) => {
    if(anotherNo) {
        if(_$($(".other_number"), "display") == "grid") {
            if(cancel) {
                $("input[type=tel]").value = "";
                $(".main").style.display = "grid";
                $(".other_number").style.display = "none";
                return;
            } 
            else {
                let num = $("input[type=tel]").value.trim().replace("+254", "0");
                SIM.anotherNo = num;
                $(".other_number").style.display = "none";
            } 
        } 
        else {
            $(".main").style.display = "none";
            $(".other_number").style.display = "grid";
            $("input[type=tel]").focus();
            return;
        } 
    } 
    if(Stream.running) await Stream.pause();
    let res = await Stream.start();
    if(!res.res) {
        Notify.popUpNote(res.error.message);
        return;
    } 
    Flashlight(Stream.torch);
    $(".scan .header h3").innerHTML = "Align the digital code within the frame to scan";
    $(".recharged").style.display = "none";
    $(".main").style.display = "none";
    $(".scan").style.display = "grid";
    $("input[type=text]").style.width = `${$(".width_generator").getBoundingClientRect().width}px`;
}

class Edit {
    static makeEditable = (editable) => {
        if(editable == true) {
            $("input[type=text]").disabled = false;
            $("input[type=text]").setAttribute("onblur", "Edit.makeEditable(false)");
            $("input[type=text]").focus();
        } 
        else if(editable == false) {
            $("input[type=text]").disabled = true;
        } 
    } 
    static text = (e) => {
    	try {
	    	let elem = e == undefined? $("input[type=text]"): e.target;
	        let text = elem.value.replace(/\s+/g, '');
	        let pst = elem.selectionStart;
	        let value = "";
	        for(let i = 0, j = SIM.group; i < text.length; i += SIM.group, j += SIM.group) {
	            let slice = text.slice(i, j);
	            value += slice + (slice.length == SIM.group && text.charAt(j)? ' ': '');
	        } 
			
	        if(elem.value.length < value.length && pst%(SIM.group+1) == 0) pst++;
	        $(".width_generator").innerHTML = value;
	        elem.style.width = `${$(".width_generator").getBoundingClientRect().width}px`;
	        elem.value = value;
	        this.setCaret(elem, pst);
		} catch (error) {
			reportError(error);
		} 
    } 
    static tel = e => {
        let contact = typeof e == "string"? e: e.target.value;
        contact = contact.replace(/\s+/g, "");
        let length = contact.replace("+254", "0").length;
        e = typeof e == "string"? {target: $("input[type=tel]")}: e;
        
        contact = contact.includes("+254") && contact.length > 4? contact.slice(0,4) + " " + contact.slice(4,7) + (contact.replace(" ", "").length > 7? " " + contact.replace(" ", "").slice(7,): ""): 
                  !contact.includes("+254") && contact.length > 4? contact.slice(0,4) + " " + contact.slice(4,): contact;
        e.target.value = contact.includes("+254")? contact.slice(0,15): contact.slice(0,11);
        if(length >= 10) {
            $$(".other_number .footer button")[0].classList.remove("enable", "disable");
            $$(".other_number .footer button")[0].classList.add("enable");
        } 
        else {
            $$(".other_number .footer button")[0].classList.remove("enable", "disable");
            $$(".other_number .footer button")[0].classList.add("disable");
        } 
    } 
    static setCaret = (elem, pst) => {
    	if(elem != null) {
    		if(elem.createTextRange) {
    			let range = elem.createTextRange();
    			range.move('character', pst);
    			range.select();
    		} 
    		else if(elem.selectionStart) {
    			elem.focus();
    			elem.setSelectionRange(pst, pst);
    		} 
    	} 
    } 
} 

const Call = () => {
    let value = $("input[type=text]").value;
    let hash = encodeURIComponent("#");
    if(SIM.anotherNo == null)
        window.location.href = "tel:" + SIM.code + value.replace(" ", "") + ((SIM.carrier == "Other")? "": hash);
    else
        window.location.href = "tel:" + SIM.code + value.replace(" ", "") + "*" + SIM.anotherNo + hash;
    
    $("input[type=text]").value = "";
    $(".hidden_footer").classList.remove("show", "hide");
    $(".hidden_footer").classList.add("hide");
    $(".recharged").style.display = "block";
}

const Rescan = async () => {
	if(Stream.running) await Stream.pause();
    let res = await Stream.start();
    if(!res.res) {
        Notify.popUpNote(res.error.message);
        return;
    } 
    Flashlight(Stream.torch);
    $(".scan .header h3").innerHTML = "Align the digital code within the frame to scan";
    $(".hidden_footer").classList.remove("show", "hide");
    $(".hidden_footer").classList.add("hide");
    setTimeout(() => {$(".hidden_footer").classList.remove("hide");}, 500);
} 

const SIM = {
    carrier: "Safaricom", 
    code: "*141*", 
    group: 4,
    anotherNo: null
}

const CONSTRAINTS = {
    video: {
        width: {
            max: window.innerHeight
        }, 
        height: {
            max: window.innerWidth
        },
        facingMode: 'environment', 
        focusMode: 'continuous'
    } 
}

class Stream {
    static stream;
    static video;
    static laser;
    static canvas;
    static snapshot;
    static track;
    static capabilities;
    static worker;
    static timeout;
    static torch = false;
    static started = false;
    static ready = false;
    static called = false;
    static start = async () => {
        try {
        	if(!this.ready) {
        		this.called = true;
        		return {error: new Error("Initializing Scanner...<br>Please wait..."), res: false};
        	} 
            this.stream = await navigator.mediaDevices.getUserMedia(CONSTRAINTS);
            this.laser.style.animationPlayState = "running";
            this.running = true;
            this.video.srcObject = this.stream;
            this.track = await this.stream.getVideoTracks()[0];
            this.video.setAttribute("onloadedmetadata", "Stream.getCapabilities()");
            $(".flashlight").classList.add("disable");
            this.timeout = setTimeout(this.takeSnapshot, 3000);
            return {res: true};
        } catch (error) {
            reportError(error);
            return {error: new Error("Can't compete action. Access to camera denied."), res: false};
        } 
    } 
    static pause = async () => {
    	try {
	        this.running = false;
	        await this.video.pause();
	        await this.track.stop();
	        this.laser.style.animationPlayState = "paused";
	        clearTimeout(this.timeout);
	        $(".flashlight").classList.remove("flashlight_on");
	        $(".flashlight").classList.add("flashlight_off");
		} 
		catch (error) {
			reportError(error);
		} 
    } 
    static getCapabilities = async () => {
    	try {
	        await setTimeout(_ => {}, 500);
	        this.capabilities = await this.track.getCapabilities();
	        if(this.capabilities.torch) {
	            $(".flashlight").classList.remove("disable");
	            $(".flashlight").classList.add("enable");
	        } 
		} 
		catch (error) {
			reportError(error);
		} 
    } 
    static takeSnapshot = async () => {
    	try {
	        $(".scan .header h3").innerHTML = "scanning";
	        let scannerFrame = $(".scanner_frame");
	        let width = parseInt(_$(scannerFrame, "width"));
	        let height = parseInt(_$(scannerFrame, "height"));
	        let left = _$$(scannerFrame, scannerFrame.parentNode).left;
	        let top = _$$(scannerFrame, scannerFrame.parentNode).top;
	        this.canvas.width = width;
	        this.canvas.height = height;
	        let ctx = this.canvas.getContext("2d");
			ctx.filter = this.torch? "": "brightness(130%) contrast(100%)";
	        ctx.drawImage(this.video, left, top, width, height, 0, 0, width, height);
	        this.snapshot = this.canvas.toDataURL("image/png");
	        let res = await this.recognize(this.snapshot);
			if(!res && this.running) 
				this.takeSnapshot();
		} catch (error) {
			reportError(error);
		} 
    } 
    static initTesseract = async () => {
        try {
            let {createWorker} = Tesseract;
			this.worker = createWorker({
				workerPath: "./tesseract/worker.js",
				corePath: "./tesseract/core.wasm.js",
				langPath: "./tesseract/lang"
			});
            await this.worker.load();
            await this.worker.loadLanguage('eng');
            await this.worker.initialize('eng');
            await this.worker.setParameters({tessedit_char_whitelist: '0123456789'});
            this.ready = true;
            if(this.called)
            	await Scan(false);
        } catch (error) {
            reportError(error);
        } 
    } 
    static recognize = async (img, importWindow, retake) => {
    	try {
	        let res = await this.worker.recognize(img);
	        let texts = res.data.text.split("\n");
	        let text = "";
	        for(let t of texts) {
	            if(t.length > text.length)
	                text = t;
	        }
			
	        if(text.length > 7) {
				if(this.running) this.pause();
	            try {
	                navigator.vibrate(150);
	            } catch (error) {}
	            
	            if(importWindow) {
	                $(".crop").style.display = "none";
	                $(".scan").style.display = "grid";
	                $(".crop .footer button").classList.remove("disable");
	                $(".crop h3").innerHTML = "Pinch to zoom. Drag to move";
	                img = $("img");
	                img.style.height = "100%";
	                img.style.width = "100%";
	                img.style.top = "0";
	                img.style.left = "0";
	                let frame = $(".crop_frame");
	                frame.style.height = "80px";
	                frame.style.width = "160px";
	                frame.style.top = "calc(50% - 40px)";
	                frame.style.left = "calc(50% - 80px)";
					Notify.cancel();
	            } 
	            $(".scan .header h3").innerHTML = "Please confirm the top up code.";
	            $("input[type=text]").value = text;
	            $(".width_generator").innerHTML = text;
	        	$("input[type=text]").style.width = `${$(".width_generator").getBoundingClientRect().width}px`;
	            await Edit.text();
	            $(".hidden_footer").classList.remove("show", "hide");
	            $(".hidden_footer").classList.add("show");
				return true;
	        } 
	        else {
	            if(importWindow) {
	                if(retake) {
						return false;
	                } else {
	                    await this.recognize(img, importWindow, true);
	                } 
	            } 
	            else {
	                return false;
	            } 
	        } 
		} 
		catch (error) {
			reportError(error);
		} 
    } 
    static flashlight = async (on) => {
    	try {
	        if(on) {
	            await this.track.applyConstraints({
					advanced: [{
						fillLightMode: 'flash', 
						torch: true, 
					}] 
				});
	        } else {
	            await this.pause();
	            await this.start();
	        } 
			this.torch = on;
		} 
		catch (error) {
			reportError(error);
		} 
    } 
}

class Drag {
    static init = {};
    
    static start = e => {
        if(e.touches.length == 2) {
            this.init[e.target.tagName + "-" + e.target.className] = e.touches;
        } 
        else if(e.touches.length == 1) {
        	this.init[e.target.tagName + "-" + e.target.className] = this.init[e.target.tagName + "-" + e.target.className] || {};
            this.init[e.target.tagName + "-" + e.target.className].X = e.touches[0].clientX;
            this.init[e.target.tagName + "-" + e.target.className].Y = e.touches[0].clientY;
        } 
    } 
    
    static move = e => {
        e.preventDefault();
        let parent = _$$($(".crop_container"));
        if(e.touches.length == 1) {
        	let init = this.init[e.target.tagName + "-" + e.target.className];
            let changeX = e.touches[0].clientX - init.X;
            let changeY = e.touches[0].clientY - init.Y;
            if(e.target.className == "crop_frame" || e.target == $(".crop_container img")) {
                
                let top = _$(e.target, "top", true) + changeY;
                let left = _$(e.target, "left", true) + changeX;
                
                if(e.target.className == "crop_frame" && top >= 0 && top + _$(e.target, "height", true) <= parent.height && left >= 0 && left + _$(e.target, "width", true) <= parent.width) {
                    e.target.style.left = `${left}px`;
                    e.target.style.top = `${top}px`;
                }
                else if(e.target == $(".crop_container img")) {
                    e.target.style.left = `${left}px`;
                    e.target.style.top = `${top}px`;
                } 
            } 
            else if(e.target.className == "top" || e.target.className == "bottom") {
                let frame = $(".crop_frame");
                let oldHeight = _$(frame, "height", true);
                let height = 0;
                if(e.target.className == "top") 
                   height = oldHeight - changeY;
               else
                   height = oldHeight + changeY;
               
               if(height > 40 && e.touches[0].clientY >= parent.top && e.touches[0].clientY <= parent.bottom) {
                   if(e.target.className == "top") {
                       frame.style.top = `${_$(frame, "top", true) + changeY}px`;
                   } 
                   frame.style.height = `${height}px`;
               } 
            } 
            else if(e.target.classList.contains("left") || e.target.classList.contains("right")) {
                let frame = $(".crop_frame");
                let oldWidth = _$(frame, "width", true);
                let width = 0;
                if(e.target.className == "left") 
                    width = oldWidth - changeX;
                else
                    width = oldWidth + changeX;
                if(width > 100 && e.touches[0].clientX >= parent.left && e.touches[0].clientX <= parent.right) {
                    if(e.target.className == "left") 
                    frame.style.left = `${_$(frame, "left", true) + changeX}px`;
                    frame.style.width = `${width}px`;
                } 
            } 
            this.init[e.target.tagName + "-" + e.target.className].X = e.touches[0].clientX;
            this.init[e.target.tagName + "-" + e.target.className].Y = e.touches[0].clientY;
        } 
        else if(e.touches.length == 2) {
            let img = e.target != $(".crop_container img")? $(".crop_container img"): e.target;
            let init = this.init[e.target.tagName + "-" + e.target.className];
            let changeX1 = Math.abs(e.touches[0].clientX - init[0].clientX);
            let changeX2 = Math.abs(e.touches[1].clientX - init[1].clientX);
            let changeY1 = Math.abs(e.touches[0].clientY - init[0].clientY);
            let changeY2 = Math.abs(e.touches[1].clientY - init[1].clientY);
            let change = Math.max(changeX1, changeX2, changeY1, changeY2);
            let d1 = Math.hypot(init[0].clientX - init[1].clientX, init[0].clientY - init[1].clientY);
            let d2 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
            change = d1 > d2? change*-1: change;
            let height = _$(img, "height", true) + change;
            let width = _$(img, "width", true) + change;
            if(width > 200 && width < (Math.min(window.innerHeight, window.innerWidth)*2)) {
                img.style.top = `${_$(img, "top", true) + (change * -0.5)}px`;
                img.style.left = `${_$(img, "left", true) + (change * -0.5)}px`;
                img.style.height = `${height}px`;
                img.style.width = `${width}px`;
                this.init[e.target.tagName + "-" + e.target.className] = e.touches;
            } 
        } 
    } 
}

class ImageProps {
    static cvs;
    static img;
    static frame;
    static init = () => {
    	try {
	        this.cvs = $$$("canvas");
	        this.frame = $(".crop_frame");
	        this.img = $(".crop_container img");
		} 
		catch (error) {
			reportError(error);
		} 
    } 
    static getProps = () => {
    	try {
	        let aspectRatio = this.img.naturalWidth / this.img.naturalHeight;
	        let w1, h1;
	        
	        if(window.innerWidth < window.innerHeight) {
	            w1 = _$(this.img, "width", true);
	            h1 = w1 * Math.pow(aspectRatio, -1);
	        } 
	        else {
	            h1 = _$(this.img, "height", true)
	            w1 = h1 * aspectRatio;
	        } 
	        let x1 = _$(this.img, "left", true) + ((_$(this.img, "width", true)/2) - (w1/2));
	        let y1 = _$(this.img, "top", true) + ((_$(this.img, "height", true)/2) - (h1/2));
	        let h2 = _$(this.frame, "height", true);
	        let w2 = _$(this.frame, "width", true);
	        let x2 = _$(this.frame, "left", true);
	        let y2 = _$(this.frame, "top", true);
	        let x = this.img.naturalWidth * (x2-x1) / w1;
	        let y = this.img.naturalHeight * (y2-y1) / h1;
	        let h = h2 * this.img.naturalHeight / h1;
	        let w = w2 * this.img.naturalWidth / w1;
	        return {x1, y1, w1, h1, x2, y2, w2, h2, x, y, w, h};
		} 
		catch (error) {
			reportError(error);
		} 
    } 
    static takeSnap = async (e) => {
    	try {
	        let props = this.getProps();
	        this.cvs.height = props.h2;
	        this.cvs.width = props.w2;
	        let ctx = this.cvs.getContext('2d');
	        ctx.drawImage(this.img, props.x, props.y, props.w, props.h, 0, 0, props.w2, props.h2);
	        ctx.filter = "invert(1)";
	        let snap = this.cvs.toDataURL("image/png");
	        $(".crop h3").innerHTML = "scanning";
	        e.target.classList.add("disable");
			Notify.alertSpecial({
				header: "Scanning image...",
				message: "Please wait"
			});
	        let res = await Stream.recognize(snap, $(".crop"));
			if(!res) {
				Notify.cancel();
                Notify.popUpNote("Please ensure you crop the image to only expose the digital code.");
                $(".crop .footer button").classList.remove("disable");
            } 
		} 
		catch (error) {
			reportError(error);
		} 
    } 
} 

const NotificationClick = (elem) => {
	Notify.buttonAction(elem);
} 

class Notify {
	static popUpNote = (data) => {
		let popUpNote = $("#pop-up-note");
        popUpNote.innerHTML = data;
        popUpNote.style.display = "block";
        popUpNote.classList.remove("pop");
        void popUpNote.offsetWidth;
        popUpNote.classList.add("pop");
	} 
	static reset = () => {
		this.note_window = $("#notification-window"), 
        this.note_main = $("#note"), 
        this.note_image = $(".note_img"), 
        this.note_head = $(".note_header"), 
        this.note_body = $(".note_body"), 
        this.note_footer = $(".note_footer"), 
        this.note_buttons = this.note_footer.children,
        this.note_close_button = $("#note .close_btn");
         
        this.note_window.classList.remove("fade_note");
        this.note_window.style.justifyContent = "center";
        this.note_main.style.gridTemplateRows = "auto auto auto";
        this.note_main.style.gridTemplateColumns = "60px auto 25px";
        this.note_main.style.gridRowGap = "5px";
        this.note_main.style.padding = "10px";
        this.note_image.src = srcs[8];
        this.note_image.style.padding = "5px";
        this.note_image.style.objectFit = "contain";
        this.note_head.style.fontWeight = "900";
        this.note_body.style.display = "block";
        this.note_window.removeAttribute("onclick");
        this.note_close_button.style.display = "block";
        
        if(this.sleep)
        	this.sleep.end();
        else
        	this.sleep = new Sleep();
	} 

    static alert = async (data) => {
    	await this.reset();
    	this.note_head.innerHTML = data.header || "";
        this.note_body.innerHTML = data.message || "";
        this.note_buttons[0].style.display = "none";
        this.note_buttons[1].style.display = "none";
        this.note_buttons[2].style.display = "inline-block";
        this.note_buttons[2].textContent = "OK";
        this.note_buttons[2].setAttribute("value", "OK");
        this.note_window.setAttribute("onclick", "Notify.cancel()");
        this.note_close_button.setAttribute("value", "OK");
        this.note_close_button.style.pointerEvents = "auto";
		
        this.note_window.style.display = "flex";
        await this.sleep.start();
        return this.action;
    }
	static popUpAlert = async (data) => {
		await this.reset();
    	this.note_head.innerHTML = data.header || "";
        this.note_body.innerHTML = data.message || "";
        this.note_window.style.justifyContent = "flex-start";
        this.note_main.style.gridTemplateColumns = "100px auto";
        this.note_main.style.gridTemplateRows = "auto";
        this.note_main.style.padding = "5px";
        this.note_main.style.gridRowGap = "0px";
        this.note_image.style.padding = "0px 10px 0px 0px";
        this.note_close_button.style.display = "none";
        this.note_head.style.fontWeight = "500";
        this.note_body.style.display = "none";
        this.note_buttons[0].style.display = "none";
        this.note_buttons[1].style.display = "none";
        this.note_buttons[2].style.display = "none";
        let delay = data.delay || 1000;
        setTimeout(this.cancel, delay);
       
		this.note_window.style.display = "flex";
    } 
	static alertSpecial = async (data) => {
		await this.reset();
    	this.note_head.innerHTML = data.header || "";
        this.note_body.innerHTML = data.message || "";
        this.note_buttons[0].style.display = "none";
        this.note_buttons[1].style.display = "none";
        this.note_buttons[2].style.display = "none";
        this.note_close_button.style.pointerEvents = "none";
       
		this.note_window.style.display = "flex";
    } 
	static confirm = async (data) => {
		await this.reset();
    	this.note_head.innerHTML = data.header || "";
        this.note_body.innerHTML = data.message || "";
        this.note_buttons[0].style.display = "none";
        this.note_buttons[1].style.display = "inline-block";
        this.note_buttons[2].style.display = "inline-block";
        this.note_buttons[1].textContent = data.type.split("/")[0];
        this.note_buttons[2].textContent = data.type.split("/")[1];
        this.note_buttons[1].setAttribute("value", data.type.split("/")[0]);
        this.note_buttons[2].setAttribute("value", data.type.split("/")[1]);
        this.note_close_button.setAttribute("value", data.type.split("/")[0]);
        this.note_close_button.style.pointerEvents = "auto";
       
		this.note_window.style.display = "flex";
        await this.sleep.start();
        return this.action;
	}
    static other = async (data) => {
    	await this.reset();
    	this.note_head.innerHTML = data.header || "";
        this.note_body.innerHTML = data.message || "";
        this.note_buttons[0].style.display = "inline-block";
        this.note_buttons[1].style.display = "inline-block";
        this.note_buttons[2].style.display = "inline-block";
        this.note_buttons[0].innerHTML = data.type.split("/")[0];
        this.note_buttons[1].innerHTML = data.type.split("/")[1];
        this.note_buttons[2].innerHTML = data.type.split("/")[2];
        this.note_buttons[0].setAttribute("value", data.type.split("/")[0]);
        this.note_buttons[1].setAttribute("value", data.type.split("/")[1]);
        this.note_buttons[2].setAttribute("value", data.type.split("/")[2]);
        this.note_close_button.setAttribute("value", data.type.split("/")[0]);
        this.note_close_button.style.pointerEvents = "auto";
       
		this.note_window.style.display = "flex";
        await this.sleep.start();
        return this.action;
    }
   
    static buttonAction = async (elem) => {
    	this.action = elem.getAttribute("value");
    	this.sleep.end();
    	this.cancel();
    }
   
	static cancel = async () => {
		this.note_window = $("#notification-window");
	    this.note_window.classList.remove("fade_note");
	    void this.note_window.offsetWidth;
	    this.note_window.setAttribute("onanimationend", "End(event)");
	    this.note_window.classList.add("fade_note");
	} 
} 

class Sleep {
	i = 0;
	j = 1_000;
	running = false;
	start = () => {
		let self = this;
		this.i = 0;
		this.j = 1_000;
		return new Promise((resolve, reject) => {
			self.runinng = true;
			const it = setInterval(() => {
				self.i+=0.001;
				if(self.i >= self.j) {
					self.i = 0;
					self.j = 1_000;
					self.runinng = false;
					clearInterval(it);
					resolve("Done");
				} 
			}, 1);
		});
	} 
	end = () => {
		this.i = this.j;
	} 
	wait = async (sec) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve("Done");
			}, sec * 1000);
		});
	} 
} 

window.onpopstate = function (state) {
	if(_$($(".main"), 'display') == 'grid') {
		Notify.popUpNote("Press again to exit.");
		setTimeout(() => {
			history.pushState(null, "", "");
		}, 4000);
		return;
	} 
	else if($(".hidden_footer").classList.contains("show")) {
		Rescan();
	} 
	else if(_$($(".about_window"), 'display') == 'block') {
		Options.back();
	} 
	else if(_$($(".other_number"), 'display') == 'grid') {
		Scan(true, true);
	} 
	else if(_$($(".scan"), 'display') == 'grid') {
		Home();
	} 
	else if(_$($(".recharged"), 'display') == 'block') {
		Home();
	} 
	else if(_$($(".crop"), 'display') == 'grid') {
		Import.exit();
	} 
	history.pushState(null, "", "");
} 