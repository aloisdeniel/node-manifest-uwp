# manifest-uwp

Update your Windows Universal application manifest (version, bundle idenfifier, ...).

## Install

```sh
$ npm install --save manifest-uwp
```

## Quickstart

```js
var path = require('path');
var UWPManifest = require('manifest-uwp');

var uwp = new UWPManifest();
uwp.load({ file: path.join(__dirname, "Package.appxmanifest") }, function(err){
    uwp.version = "2.5.6.7";
    uwp.bundleIdentifier = "com.test.sample";
    uwp.displayName = "Sample";
    uwp.save({ file: path.join(__dirname, "Package.Updated.appxmanifest") }, function(err) {
        console.log("DONE");
    })
})
```

## Other manifests

* [iOS](https://github.com/aloisdeniel/node-manifest-ios)
* [Android](https://github.com/aloisdeniel/node-manifest-android)

## Copyright and license

MIT © [Aloïs Deniel](http://aloisdeniel.github.io)