# MMM-SpaceX

This is a module for [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This module will show all recent or future launches bases on the SpaceX API. I'm still working on expanding the module with additional information and options. If you have nice ideas, then you should certainly pass them on.

## Installation
1. Navigate to your MagicMirror's modules folder, and run the following command: `git clone https://github.com/koxm/MMM-SpaceX.git`
2. Add the module and a valid configuration to your `config/config.js` file

## Using the module

This is an example configuration for your `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: "MMM-SpaceX",
            position: "middle_center",
            config: {
                records: 8,
                modus: "past",
                showExtraInfo: false,
		showColumnHeader: true,
	    }
	},
    ]
}
```

## Configuration options

| Option            | Description
|-------------------|--------------------------------------------
| `records`         | *Optional* - The number of lines you want to show <br>*Default:* 5
| `modus`           | *Optional* - 'past' for past launches, 'upcoming' for future launches <br>*Default:* past
| `showExtraInfo`   | *Optional* - Do you want to show the launchsite (true) or not (false) <br>*Default:* false
| `showColumnHeader`| *Optional* - Choose if you want to see columnheadings <br>*Default:* false

## Good to know
1. In small mode, the columns are as follows: Agency, Mission, Launche Date and Rocket. The extra info option gives you the Launch Site, Payload and Orbit extra on screen.

2. There are a few abbreviations used to save space on the screen, especially in the case of a small region. The following abbreviations are useful to know:
- VLEO = [Very Low Earth Orbit](https://en.wikipedia.org/wiki/Low_Earth_orbit)
- SO   = [Sub Orbital](https://en.wikipedia.org/wiki/Sub-orbital_spaceflight)
- GEO  = [Geostationary Orbit](https://en.wikipedia.org/wiki/Geostationary_orbit)
- GTO  = [Geostationary Transfer Orbit](https://en.wikipedia.org/wiki/Geostationary_transfer_orbit)
- SSO  = [Sun-synchronous Orbit](https://en.wikipedia.org/wiki/Sun-synchronous_orbit)
- ISS  = [International Space Station](https://en.wikipedia.org/wiki/International_Space_Station) Low Earth Orbit

3. The launch sites have also been abbreviated. Some examples below.
- CCAFS SLC 40 = Cape Canaveral Air Force Station Space Launch Complex 40
- KSC LC 39A   = Kennedy Space Center Historic Launch Complex 39A
- VAFB SLC 3W  = Vandenberg Air Force Base Space Launch Complex 3W
- VAFB SLC 4E  = Vandenberg Air Force Base Space Launch Complex 4E
- STLS         = SpaceX South Texas Launch Site
- Kwajalein Atoll = Kwajalein Atoll Omelek Island

## Screenshot

This is a screenshot with extra info on false. Looks best on a left or right region. 
![Screenshot](https://github.com/koxm/MMM-SpaceX/blob/master/Screenshot%201.png)

This is a screenshot with extra info on true. Looks better on a wider region, for example middle_center of bottom_bar.
![Screenshot](https://github.com/koxm/MMM-SpaceX/blob/master/Screenshot%202.png)
