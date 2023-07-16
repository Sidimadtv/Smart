class Updates {
	static version = "6.2.3.20";
	static updatesLog = new Map([
		["6.2.3.19", ["Added support line option.", "Added more app option.", "Added more options in the menu", "Fixed some bugs."]], 
		["6.2.3.20", ["Fixed some bugs."]], 
	]);
	static getDescription = (version) => {
		let versionDescription = "<ul>";
		if(!version) {
			for(let [key, value] of this.updatesLog.entries()) {
				if(key >= currentAppVersion) {
					versionDescription += `<li>Version: ${key}</li><ul>${value.map(desc => "<li>" + desc + "</li>").join("")}</ul>`;
				} 
			} 
		} 
		else {
			let value = this.updatesLog.get(version);
			value = !value? this.updatesLog.get(Array.from(this.updatesLog.keys())[0]): value;
			versionDescription += value.map(desc => "<li>" + desc + "</li>").join("");
		} 
		versionDescription += "</ul>";
		return versionDescription;
	} 
}