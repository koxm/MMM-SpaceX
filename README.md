# MMM-SpaceX

This is a module for [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This module will show all recent of future launches bases on the SpaceX API. 

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
	    }
	},
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `records`        | *Optional* - The number of lines you want to show <br>*Default:* 5
| `modus`          | *Optional* - 'past' for past launches, 'upcoming' for future launches <br>*Default:* past
| `showExtraInfo`  | *Optional* - Do you want to show the launchsite (true) or not (false) <br>*Default:* false

## Good to know
1. There are a few abbreviations used to save space on the screen, especially in the case of a small region. The following abbreviations are useful to know:
- VLEO = [Very Low Earth Orbit](https://en.wikipedia.org/wiki/Low_Earth_orbit)
- SO   = [Sub Orbital](https://en.wikipedia.org/wiki/Sub-orbital_spaceflight)
- GEO  = [Geostationary Orbit](https://en.wikipedia.org/wiki/Geostationary_orbit)
- GTO  = [Geostationary Transfer Orbit](https://en.wikipedia.org/wiki/Geostationary_transfer_orbit)
- SSO  = [Sun-synchronous Orbit](https://en.wikipedia.org/wiki/Sun-synchronous_orbit)
- ISS  = [International Space Station](https://en.wikipedia.org/wiki/International_Space_Station)
2. Add the module and a valid configuration to your `config/config.js` file

## Screenshot

This is a simple screenshot

![Screenshot](https://github.com/koxm/MMM-SpaceX/blob/master/Screenshot%201.png)
