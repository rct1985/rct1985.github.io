

var MXLayerLoading = cc.Scene.extend({
	_interval : null,
	_label : null,
	_className:"MXLayerLoading",
	/**
	 * Contructor of cc.LoaderScene
	 * @returns {boolean}
	 */
	init : function(){
		var self = this;

		var size = cc.winSize;
		var logoWidth = 160;
		var logoHeight = 200;
		// bg
		var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(255, 255, 255, 255));
		self.addChild(bgLayer, 0);
		
		//添加一个文本框显示
		var spIcon=new cc.Sprite("res/UI/icon152.png");
		spIcon.x=size.width*0.5;
		spIcon.y=700;
		this.addChild(spIcon);

		var spStudio=new cc.Sprite("res/UI/pStudio.png");
		spStudio.x=size.width*0.5;
		spStudio.y=400;
		this.addChild(spStudio);

		

		//image move to CCSceneFile.js
		var fontSize = 24, lblHeight =  -logoHeight / 2 + 100;
//		if(cc._loaderImage){
//			//loading logo
//			cc.loader.loadImg(cc._loaderImage, {isCrossOrigin : false }, function(err, img){
//				logoWidth = img.width;
//				logoHeight = img.height;
//				self._initStage(img, cc.visibleRect.center);
//			});
//			fontSize = 14;
//			lblHeight = -logoHeight / 2 - 10;
//		}
		//loading percent
		var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", fontSize);
		label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
		label.setColor(cc.color(180, 180, 180));
		bgLayer.addChild(this._label, 10);
		return true;
	},

	_initStage: function (img, centerPos) {
		var self = this;
		var texture2d = self._texture2d = new cc.Texture2D();
		texture2d.initWithElement(img);
		texture2d.handleLoadedTexture();
		var logo = self._logo = new cc.Sprite(texture2d);
		logo.setScale(cc.contentScaleFactor());
		logo.x = centerPos.x;
		logo.y = centerPos.y;
		self._bgLayer.addChild(logo, 10);
	},
	/**
	 * custom onEnter
	 */
	 onEnter: function () {
		 var self = this;
		 cc.Node.prototype.onEnter.call(self);
		 self.schedule(self._startLoading, 0.3);
	 },
	 /**
	  * custom onExit
	  */
	 onExit: function () {
		 cc.Node.prototype.onExit.call(this);
		 var tmpStr = "Loading... 0%";
		 this._label.setString(tmpStr);
	 },

	 /**
	  * init with resources
	  * @param {Array} resources
	  * @param {Function|String} cb
	  */
	 initWithResources: function (resources, cb) {
		 if(cc.isString(resources))
			 resources = [resources];
		 this.resources = resources || [];
		 this.cb = cb;
	 },

	 _startLoading: function () {
		 var self = this;
		 self.unschedule(self._startLoading);
		 var res = self.resources;
		 cc.loader.load(res,
				 function (result, count, loadedCount) {
			 var percent = (loadedCount / count * 100) | 0;
			 percent = Math.min(percent, 100);
			 self._label.setString("Loading... " + percent + "%");
		 }, function () {
			 if (self.cb)
				 self.cb();
		 });
	 }
});
/**
 * <p>cc.LoaderScene.preload can present a loaderScene with download progress.</p>
 * <p>when all the resource are downloaded it will invoke call function</p>
 * @param resources
 * @param cb
 * @returns {cc.LoaderScene|*}
 * @example
 * //Example
 * cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new HelloWorldScene());
    }, this);
 */
MXLayerLoading.preload = function(resources, cb){
	var _cc = cc;
	if(!this._instance) {
		this._instance = new MXLayerLoading();
		this._instance.init();
	}
	this._instance.initWithResources(resources, cb);

	cc.director.runScene(this._instance);
	return this._instance;
};
