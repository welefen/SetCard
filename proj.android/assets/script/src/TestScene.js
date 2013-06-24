cc.dumpConfig();

var TestLayer = cc.Layer.extend({
    ctor:function () {
        cc.associateWithNative( this, cc.Layer );
    },
    init:function () {
        var bRet = false;
        if (this._super()) {

            // bg
            this._bgLayer = cc.LayerColor.create(cc.c4(32, 32, 32, 255));
            this._bgLayer.setPosition(cc.p(0, 0));
            this.addChild(this._bgLayer, 0);

            var myLabel = cc.LabelTTF.create('hello world',  'Times New Roman', 32);
            myLabel.setPosition(cc.p(200,200));
            this.addChild(myLabel);

            if(this.setKeypadEnabled){    
                this.setKeypadEnabled(true);
            }

            bRet = true;
        }
        return bRet;
    },
    backClicked:function() {
        cc.log("back button pressed");
        cc.Director.getInstance().end();
    }
});

TestLayer.create = function () {
    var sg = new TestLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

TestLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = TestLayer.create();
    scene.addChild(layer);
    return scene;
};
