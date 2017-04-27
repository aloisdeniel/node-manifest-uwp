var assert = require('assert');
var path = require('path');
var UWPManifest = require('..');

var uwp = new UWPManifest();
uwp.load({ file: path.join(__dirname, "Package.appxmanifest") }, function(err){
    uwp.version = "2.5.6.7";
    uwp.bundleIdentifier = "com.test.sample";
    uwp.displayName = "Sample";
    console.log(uwp.icons)
    uwp.save({ file: path.join(__dirname, "Package.Updated.appxmanifest") }, function(err) {
        console.log("DONE");
    })
})