/*
 * contant
 */
var SCREEN_WIDTH    = 465;              // スクリーン幅
var SCREEN_HEIGHT   = 465;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分

tm.main(function() {
	var app = tm.display.CanvasApp("#world");

    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    app.background = "#444";

    app.replaceScene(TestScene());

	app.run();
});


tm.define("TestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        var loader = tm.asset.Loader();

        loader.onload = function() {
        	// this.setup2();

        	var spineElement = tm.spine.Element({
	        	frames: "frames_spineboy",
	        	image: "img_spineboy",
	        	anim: "anim_spineboy",
        	}).addChildTo(this).setPosition(SCREEN_CENTER_X, 400);

            spineElement.setMixByName("walk", "jump", 0.2);
            spineElement.setMixByName("jump", "walk", 0.4);

            spineElement.setAnimationByName(0, "walk", true);

			this.onpointingstart = function() {
				spineElement.setAnimationByName(0, "jump", false);
				spineElement.addAnimationByName(0, "walk", true, 0);
			};

            // var hoge = tm.spine.Element({
            //     frames: "frames_spineboy",
            //     image: "img_spineboy",
            //     anim: "anim_spineboy",
            // }).addChildTo(this).setPosition(SCREEN_CENTER_X-100, 400);
            // hoge.setAnimationByName(0, "walk", true);

        }.bind(this);

        loader.load({
        	frames_spineboy: "../assets/spineboy.json",
        	img_spineboy: "../assets/spineboy.png",
        	anim_spineboy: "../assets/spineboy.anim",
        });
    },
});
