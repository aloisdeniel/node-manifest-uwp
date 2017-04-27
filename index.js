var fs = require('fs');
var path = require('path');
var XML = require('xmlobject');
var parseVersion = require('parse-version');

var nsuap = "http://schemas.microsoft.com/appx/manifest/uap/windows10";

function extractImagesFromAttributes(node) {
    var attributes = [ "Image", "Square150x150Logo", "Square44x44Logo", "Wide310x150Logo", "Square310x310Logo", "Square71x71Logo" ];
    var result = [];
    attributes.forEach(function(name) {
        var img = node.getAttribute(name);
        if(img) result.push(img);
    }, this);
    return result;
}

class Manifest{
    constructor(){
        this._xml = null;
    }

    // #region Properties

    get version() { 
        var v = this._xml.firstChild("Identity").getAttribute("Version");
        return parseVersion(v); 
    }
    set version(v) 
    { 
        var version = parseVersion(v); 
        this._xml.firstChild("Identity").setAttribute("Version", version.major + "." + version.minor + "." + version.patch + "." + version.build)
    }
    
    get bundleIdentifier() { return this._xml.firstChild("Identity").getAttribute("Name"); }
    set bundleIdentifier(v) { this._xml.firstChild("Identity").setAttribute("Name", v);  }

    get displayName() { return this._xml.firstChild("Properties").firstChild("DisplayName").getText(); }
    set displayName(v) { 
        this._xml.firstChild("Properties").firstChild("DisplayName").setText(v);
        
        //Tiles
        var apps = this._xml.firstChild ("Applications").findChildren("Application"); 
        apps.forEach(app => {
            var visualElements = app.firstChild(nsuap, "VisualElements");
            visualElements.setAttribute("DisplayName",v);
            visualElements.setAttribute("Description",v);  
        });
    }

    get icons(){ 
        var apps = this._xml.firstChild ("Applications").findChildren("Application");
        var result = [];
        apps.forEach(app => {
            var visualElements = app.firstChild(nsuap, "VisualElements");
            if(visualElements) {
                result = result.concat(extractImagesFromAttributes(visualElements));
                visualElements.nodes.forEach(function(n) {
                        result = result.concat(extractImagesFromAttributes(n));
                }, this);
            }
            
        }, this);
        return result.filter(f => path.extname(f) === ".png").map(f => path.join(this._dir, f.replace("\\","/")));
    }

    // # region Loading

    load(args, cb) {
        var manifest = "Package.appxmanifest";
        if(args.file){
            manifest = args.file;
            this._dir = path.dirname(manifest);
        }
        var manifestContent = args.content || fs.readFileSync(manifest, 'utf8');
        var _this = this;
        XML.deserialize(manifestContent, function(err, plist) {
            if (err) return cb(err); 
            _this._xml = plist;
            cb(null,_this);
        });
    }

    save(args, cb) {
        var output = args.file;
        var _this = this;
        this._xml.serialize(function(err,xml){
            if (err) return cb(err); 
            try {
                fs.writeFileSync(output, xml, 'utf8');
                cb(null,_this);
            } catch (error) {
                cb(err);
            }
        }) 
    }
}

module.exports = Manifest;