/*
 * element.js
 */

tm.define("tm.spine.Element", {
	superClass: "tm.display.CanvasElement",

	init: function(param) {
		this.superInit();

		this.setup(param);
	},

	setup: function(param) {
    	var skeletonData = tm.asset.Manager.get(param.anim).data;

    	this.skeleton = new spine.Skeleton(skeletonData);
    	this.skeleton.updateWorldTransform();

	    this.stateData = new spine.AnimationStateData(skeletonData);
	    this.state = new spine.AnimationState(this.stateData);

	    this.slotContainers = [];

	    for (var i = 0, n = this.skeleton.drawOrder.length; i < n; i++) {
	        var slot = this.skeleton.drawOrder[i];
	        var attachment = slot.attachment;
	        var slotContainer = new tm.display.CanvasElement();
	        this.slotContainers.push(slotContainer);
	        this.addChild(slotContainer);
	        if (!(attachment instanceof spine.RegionAttachment)) {
	            continue;
	        }
	        var spriteName = attachment.rendererObject.name;
	        var sprite = this.createSprite(slot, attachment.rendererObject);
	        slot.currentSprite = sprite;
	        slot.currentSpriteName = spriteName;
	        slotContainer.addChild(sprite);
	    }

		this.onenterframe = function() {
		    this.updateTransform();
		};
	},

	setMixByName: function(fromName, toName, duration) {
		this.stateData.setMixByName(fromName, toName, duration);
	},

	setAnimationByName: function(trackIndex, animationName, loop) {
		this.state.setAnimationByName(trackIndex, animationName, loop);
	},

	addAnimationByName: function(trackIndex, animationName, loop, delay) {
		this.state.addAnimationByName(trackIndex, animationName, loop, delay);
	},

    createSprite: function (slot, descriptor) {
    	var frames = tm.asset.Manager.get("frames_spineboy").data.frames;
	    var frame = frames[descriptor.name].frame;
    	var sprite = tm.display.Sprite("img_spineboy");
	    sprite.scale = descriptor.scale;
	    sprite.rotation = descriptor.rotation*180/Math.PI;

	    sprite.srcRect.x = frame.x;
	    sprite.srcRect.y = frame.y;
	    sprite.srcRect.width = frame.w;
	    sprite.srcRect.height = frame.h;

	    sprite.width =frame.w;
	    sprite.height=frame.h;

	    slot.sprites = slot.sprites || {};
	    slot.sprites[descriptor.name] = sprite;

	    return sprite;
    },

    updateTransform: function() {
	    this.lastTime = this.lastTime || Date.now();
	    var timeDelta = (Date.now() - this.lastTime) * 0.001;
	    this.lastTime = Date.now();
	    this.state.update(timeDelta);
	    this.state.apply(this.skeleton);
	    this.skeleton.updateWorldTransform();

	    var drawOrder = this.skeleton.drawOrder;
	    for (var i = 0, n = drawOrder.length; i < n; i++) {
	        var slot = drawOrder[i];
	        var attachment = slot.attachment;
	        var slotContainer = this.slotContainers[i];
	        if (!(attachment instanceof spine.RegionAttachment)) {
	            slotContainer.visible = false;
	            continue;
	        }

	        if (attachment.rendererObject) {
	            if (!slot.currentSpriteName || slot.currentSpriteName != attachment.name) {
	                var spriteName = attachment.rendererObject.name;
	                if (slot.currentSprite !== undefined) {
	                    slot.currentSprite.visible = false;
	                }
	                slot.sprites = slot.sprites || {};
	                if (slot.sprites[spriteName] !== undefined) {
	                    slot.sprites[spriteName].visible = true;
	                } else {
	                    var sprite = this.createSprite(slot, attachment.rendererObject);
	                    slotContainer.addChild(sprite);
	                }
	                slot.currentSprite = slot.sprites[spriteName];
	                slot.currentSpriteName = spriteName;
	            }
	        }
	        slotContainer.visible = true;

	        var bone = slot.bone;

	        slotContainer.position.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
	        slotContainer.position.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
	        slotContainer.position.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
	        slotContainer.position.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
	        slotContainer.position.y*= -1;
	        slotContainer.scale.x = bone.worldScaleX;
	        slotContainer.scale.y = bone.worldScaleY;

	        slotContainer.rotation = -(slot.bone.worldRotation);
	    }
    },

});

