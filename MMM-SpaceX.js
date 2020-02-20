Module.register("MMM-SpaceX", {

	// Default module config.
	defaults: {
		updateInterval: 60 * 60 * 1000,
		animationSpeed: 1000,
		lang: config.language,
		records: 5,
		modus: "past",
		showLaunchSite: false,
		initialLoadDelay: 2500,
		retryDelay: 2500,
		headerText: "SpaceX Flight Data",
		apiBase: "https://api.spacexdata.com/v3",
		tableClass: "small",
		spacexlogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/SpaceX-Logo-Xonly.svg/1280px-SpaceX-Logo-Xonly.svg.png",
		nasalogo: "https://tinyurl.com/s2ddgbr",
		anderslogo: "https://i.pinimg.com/originals/7d/44/1f/7d441fa1467d5e2e92d6b2622455c586.png",
	},

	// Define required scripts.
	getScripts: function () {
		return ["moment.js"];
	},

	// Define required stylescripts.
	getStyles: function () {
		return ["MMM-SpaceX.css", "font-awesome.css"];
	},

	// Define start sequence.
	start: function () {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);

		this.spacex = [];
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);

		this.updateTimer = null;

	},

	// Override dom generator.
	getDom: function () {
		var i = 0;
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var table = document.createElement("table");
		table.className = this.config.tableClass;

		for (var s in this.spacex) {
			var spacex = this.spacex[s];

			var launch = document.createElement("tr");
			table.appendChild(launch);

			var logo = "";
			if (spacex.rocket.second_stage.payloads[0].customers[0].includes("SpaceX")) {
				logo = this.config.spacexlogo;
			} else if (spacex.rocket.second_stage.payloads[0].customers[0].includes("NASA")) {
				logo = this.config.nasalogo;
			} else {
				logo = this.config.anderslogo;
			}

			var customerIcon = document.createElement("td");
			customerIcon.innerHTML = "<img style='width:1em; height:1em;' src='" + logo + "' />";
			launch.appendChild(customerIcon);

			var customer = document.createElement("td");
			customer.innerHTML = spacex.rocket.second_stage.payloads[0].customers[0];
			launch.appendChild(customer);

			var missionIcon = document.createElement("td");
			missionIcon.innerHTML = "<img style='width:1em; height:1em;' src='" + spacex.links.mission_patch_small + "' />";
			launch.appendChild(missionIcon);

			var mission = document.createElement("td");
			if (spacex.mission_name.length > 12) {
				mission.innerHTML = spacex.mission_name.slice(0, 12) + "...";
			} else {
				mission.innerHTML = spacex.mission_name;
			}
			launch.appendChild(mission);

			var launchDate = document.createElement("td");
			var unixLaunchDate = new Date(spacex.launch_date_unix * 1000);
			var localLaunchDate = unixLaunchDate.toUTCString().slice(5, 16);
			launchDate.innerHTML = localLaunchDate;
			launch.appendChild(launchDate);

			var rocket = document.createElement("td");
			rocket.innerHTML = spacex.rocket.rocket_name;
			launch.appendChild(rocket);

			if (this.config.showLaunchSite) {
				var launchSiteRow = document.createElement("tr");
				table.appendChild(launchSiteRow);

				var launchSite = document.createElement("td");
				launchSite.colSpan = 6;
				launchSite.className = "lastRow";
				launchSite.innerHTML = spacex.launch_site.site_name_long;
				launchSiteRow.appendChild(launchSite);
			}
		}

		return table;
	},

	// Override getHeader method.
	getHeader: function () {
		this.data.header = this.config.headerText + ": " + this.config.modus.toUpperCase() + " LAUNCHES";
		return this.data.header;
	},

	// Requests new data from SpaceX Api.
	updateSpaceXData: function () {
		var endpoint = "";
		var sort = "";
		if (this.config.modus === "upcoming") {
			endpoint = "launches/upcoming";
		} else if (this.config.modus === "past") {
			endpoint = "launches/past";
			sort = "desc"
		}

		var url = this.config.apiBase + "/" + endpoint + "?limit=" + this.config.records + "&order=" + sort;
		var self = this;
		var retry = true;

		var apiRequest = new XMLHttpRequest();
		apiRequest.open("GET", url, true);
		apiRequest.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
					console.log("MICHELKOX: API Call gelukt: " + url);
					self.processSpaceX(JSON.parse(this.response));
				}
				else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					retry = true;
				}
				else {
					Log.error(self.name + ": Could not load SpaceX data.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		apiRequest.send();
	},

	/* processSpaceX(data)
	 * Uses the received data to set the various values.
	 */
	processSpaceX: function (data) {
		this.spacex = data;

		this.show(this.config.animationSpeed, { lockString: this.identifier });
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function (delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(function () {
			self.updateSpaceXData();
		}, nextLoad);
	},
});
