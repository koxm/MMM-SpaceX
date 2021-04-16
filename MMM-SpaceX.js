Module.register("MMM-SpaceX", {

	// Default module config.
	defaults: {
		updateInterval: 60 * 60 * 1000,
		animationSpeed: 1000,
		lang: config.language,
		records: 5,
		modus: "upcoming",
		showExtraInfo: false,
		showColumnHeader: false,
		initialLoadDelay: 2500,
		retryDelay: 2500,
		headerText: "SpaceX Flight Data",
		apiBase: "https://api.spacexdata.com/v4/launches/query",
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
		return ["MMM-SpaceX.css"];
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
		var wrapper = document.createElement("div");

		var shortDesc = true;
		switch (this.data.position) {
			case "top_bar":
			case "bottom_bar":
			case "middle_center":
				shortDesc = false;
				break;
		}

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		try {
			var table = document.createElement("table");
			table.className = this.config.tableClass;

			if (this.config.showColumnHeader) {
				table.appendChild(this.getTableHeaderRow());
			}

			this.spacex.forEach((spacex) => {

				var launch = document.createElement("tr");
				table.appendChild(launch);

				var logo = "";
				var payloadData = [
					{
						customers: [ "???" ],
						type: "???",
						orbit: "???"
					}
				]

				if(spacex.payloads[0]) {
					payloadData = spacex.payloads[0];
				}

				var cust = payloadData.customers.join(', ');

				if (cust.includes("SpaceX")) {
					logo = this.config.spacexlogo;
				} else if (cust.includes("NASA")) {
					logo = this.config.nasalogo;
				} else {
					logo = this.config.anderslogo;
				}

				var customerIcon = document.createElement("td");
				customerIcon.innerHTML = "<img alt='' style='width:1em; height:1em;' src='" + logo + "' />";
				launch.appendChild(customerIcon);

				var customer = document.createElement("td");
				if (cust.length > 12 && shortDesc === true) {
					customer.innerHTML = cust.slice(0, 12) + "...";
				} else {
					customer.innerHTML = cust;
				}
				launch.appendChild(customer);

				var missionIcon = document.createElement("td");
				missionIcon.innerHTML = "<img alt='' style='width:1em; height:1em;' src='" + spacex.links.patch.small + "' />";
				launch.appendChild(missionIcon);

				var mission = document.createElement("td");
				if (spacex.name.length > 12 && shortDesc === true) {
					mission.innerHTML = spacex.name.slice(0, 12) + "...";
				} else {
					mission.innerHTML = spacex.name;
				}

				launch.appendChild(mission);

				if (this.config.showExtraInfo) {
					var launchSite = document.createElement("td");
					launchSite.innerHTML = spacex.launchpad ? spacex.launchpad.name : "???";
					launch.appendChild(launchSite);

					var payload = document.createElement("td");
					payload.innerHTML = payloadData.type;
					launch.appendChild(payload);

					var orbit = document.createElement("td");
					orbit.innerHTML = payloadData.orbit;
					launch.appendChild(orbit);
				}

				var launchDate = document.createElement("td");
				var unixLaunchDate = new Date(spacex.date_unix * 1000);
				launchDate.innerHTML = unixLaunchDate.toUTCString().slice(5, 16);
				launch.appendChild(launchDate);

				var rocket = document.createElement("td");
				rocket.innerHTML = spacex.rocket ? spacex.rocket.name : "???";
				launch.appendChild(rocket);
			});
		} catch(e) {
			wrapper.innerHTML = e.stack;
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		return table;
	},

	// Override getHeader method.
	getHeader: function () {
		this.data.header = this.config.headerText + " - " + this.config.modus.toUpperCase() + " LAUNCHES";
		return this.data.header;
	},

	// Requests new data from SpaceX Api.
	updateSpaceXData: function () {
		var self = this;
		var retry = true;

		var data = JSON.stringify({
			query: {
				upcoming: true
			},
			options: {
				populate: [
					{
						path: "payloads",
						select: {
							customers: 1,
							name: 1,
							type: 1,
							orbit: 1
						}
					},
					{
						path: "launchpad",
						select: {
							name: 1
						}
					},
					{
						path: "rocket",
						select: {
							name: 1
						}
					}
				],
				limit: this.config.records,
				sort: {
					flight_number: this.config.modus === "upcoming" ? "asc" : "desc"
				},
				select: {
					"links.patch": 1,
					date_unix: 1,
					name: 1
				}
			}
		});

		var apiRequest = new XMLHttpRequest();
		apiRequest.open("POST", this.config.apiBase, true);
		apiRequest.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processSpaceX(JSON.parse(this.response || this.responseText));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					retry = true;
				} else {
					Log.error(self.name + ": Could not load SpaceX data.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};

		apiRequest.setRequestHeader("Content-Type", "application/json");
		apiRequest.send(data);
	},

	// processSpaceX
	processSpaceX: function (data) {
		this.spacex = data.docs;
		this.show(this.config.animationSpeed, { lockString: this.identifier });
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

	// Schedule next update.
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

	getTableHeaderRow: function () {
		var thDummy = document.createElement("th");
		thDummy.appendChild(document.createTextNode(" "));
		var thCustomer = document.createElement("th");
		thCustomer.appendChild(document.createTextNode("Agency"));
		var thMission = document.createElement("th");
		thMission.appendChild(document.createTextNode("Mission Name"));
		var thLaunchSite = document.createElement("th");
		thLaunchSite.appendChild(document.createTextNode("Launch Site"));
		var thPayload = document.createElement("th");
		thPayload.appendChild(document.createTextNode("Payload"));
		var thOrbit = document.createElement("th");
		thOrbit.appendChild(document.createTextNode("Orbit"));
		var thLaunchDate = document.createElement("th");
		thLaunchDate.appendChild(document.createTextNode("Launch Date"));
		var thRocket = document.createElement("th");
		thRocket.appendChild(document.createTextNode("Rocket"));

		var thead = document.createElement("thead");
		thead.appendChild(document.createElement("th"));
		thead.appendChild(thDummy);
		thead.appendChild(thCustomer);
		thead.appendChild(thDummy);
		thead.appendChild(thMission);
		if (this.config.showExtraInfo) {
			thead.appendChild(thLaunchSite);
			thead.appendChild(thPayload);
			thead.appendChild(thOrbit);
		}
		thead.appendChild(thLaunchDate);
		thead.appendChild(thRocket);

		return thead;
	},
});
