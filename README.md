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
                showLaunchSite: false,
	    }
	},
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `records`        | *Optional* The number of lines you want to show
| `modus`          | *Optional* Past for past launches, Upcoming for future launches
| `showLaunchSite` | *Optional* Do you want to show the launchsite (true) or not<br>*Default:* true

## Screenshot

Simple screenshot

https://github.com/koxm/MMM-SpaceX/blob/master/Screenshot%201.png
