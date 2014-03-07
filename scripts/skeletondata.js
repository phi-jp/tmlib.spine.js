/*
 * skeletondata.js
 */


spine.SkeletonJson.prototype.readAttachment = function (skin, name, map) {
    /*jshint -W069*/
    name = map["name"] || name;

    var type = spine.AttachmentType[map["type"] || "region"];

    if (type == spine.AttachmentType.region) {
        var attachment = new spine.RegionAttachment();
        attachment.x = (map["x"] || 0) * this.scale;
        attachment.y = (map["y"] || 0) * this.scale;
        attachment.scaleX = map["scaleX"] || 1;
        attachment.scaleY = map["scaleY"] || 1;
        attachment.rotation = map["rotation"] || 0;
        attachment.width = (map["width"] || 32) * this.scale;
        attachment.height = (map["height"] || 32) * this.scale;
        attachment.updateOffset();

        attachment.rendererObject = {};
        attachment.rendererObject.name = name;
        attachment.rendererObject.scale = {};
        attachment.rendererObject.scale.x = attachment.scaleX;
        attachment.rendererObject.scale.y = attachment.scaleY;
        attachment.rendererObject.rotation = -attachment.rotation * Math.PI / 180;
        return attachment;
    }

        throw "Unknown attachment type: " + type;
};


tm.asset.Loader.register("anim", function(path) {
	return tm.spine.SkeletonData(path);
});


tm.define("tm.spine.SkeletonData", {
	superClass: "tm.event.EventDispatcher",

	loaded: false,

	init: function(path) {
		this.superInit();

		this.load(path);
	},

	load: function(path) {
		console.log(path);
		tm.util.Ajax.load({
			url:path,
			dataType: "json",
			success: function(data) {
				this.parse(data);
				this.loaded = true;

				this.fire(tm.event.Event("load"));
			}.bind(this)
		});

	},

	parse: function(data) {
    	var spineJsonParser = new spine.SkeletonJson();
    	this.data = spineJsonParser.readSkeletonData(data);
	}
});

