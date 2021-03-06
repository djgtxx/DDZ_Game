
var CardUI = cc.Sprite.extend({

	_numSprite1 	: null,
	_numSprite2 	: null,
	_colorSprite1	: null,
	_colorSprite2 	: null,

	_id 			: null,

	_isSelected		: null,

	ctor : function(cardData,isSmall){
		if(!cardData){
			var a= 0;
		}
		if(isSmall){
			this._super(res.card_panel_small);
		}else{
			this._super(res.card_panel);
		}

		this._init(cardData);

		this._initCardUI(cardData,isSmall);
		this._initEvent();
	},

	getID : function(){
		return this._id;
	},

	isSelected : function(){
		return this._isSelected;
	},

	_init : function(cardData){
		this.setTag(cardData.soleID);
		this._id = cardData.soleID;
		this._isSelected = false;
	},

	_setColor : function(value){
		this.setColor(cc.color(value,value,value));
		
		if(this._numSprite1){
			this._numSprite1.setColor(cc.color(value,value,value));
		}
		if(this._numSprite2){
			this._numSprite2.setColor(cc.color(value,value,value));
		}
		if(this._colorSprite1){
			this._colorSprite1.setColor(cc.color(value,value,value));
		}
		if(this._colorSprite2){
			this._colorSprite2.setColor(cc.color(value,value,value));
		}
	},

	_initCardUI : function(card, isSmall){
		var size = this.getContentSize();
		var funcName = isSmall ? "ForSmall" : "";

		var cardRect = CardUtil['getCardRect'+funcName](card.color,card.numID)
		var cardFileName = CardUtil['getCardFileName'+funcName](card.color);
		var sp = new cc.Sprite(cardFileName,cardRect);
		sp.setAnchorPoint(0,1);
		sp.setPosition(3,size.height - 7);
		this.addChild(sp);
		this._numSprite1 = sp;
		if(!isSmall){
			var sp1 = new cc.Sprite(cardFileName,cardRect);
			sp1.setRotation(180);
			sp1.setPosition(size.width - sp1.getContentSize().width / 2 - 3,sp1.getContentSize().height / 2 + 7);
			this.addChild(sp1);
			this._numSprite2 = sp1;
		}

		var colorUIFileName = CardUtil['getCardColorFileName'+funcName](card.color);
		if(colorUIFileName){
			var colorUIRect = CardUtil['getCardColorRect'+funcName](card.color);
			var colorSp = new cc.Sprite(colorUIFileName,colorUIRect);
			colorSp.setAnchorPoint(0,1);
			colorSp.setPosition(5,sp.getPositionY() - sp.getContentSize().height);
			this._colorSprite1	= colorSp,
			this.addChild(colorSp);

			if(!isSmall){
				var colorSp1 = new cc.Sprite(colorUIFileName,colorUIRect);
				colorSp1.setRotation(180);
				colorSp1.setPosition(size.width - colorSp1.getContentSize().width / 2 - 3,sp1.getContentSize().height + colorSp1.getContentSize().height / 2 + 7);
				this._colorSprite2 	= colorSp1,
				this.addChild(colorSp1);
			}
		}
	},

	_initEvent : function(){
		var _this = this;

		var listener = cc.EventListener.create({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches : true,
			onTouchBegan : function(touch,event){
				var target = event.getCurrentTarget();
				var locationInNode = target.convertToNodeSpace(touch.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0,0,s.width,s.height);
				if(cc.rectContainsPoint(rect,locationInNode)){
					_this._setColor(50);
					return true;
				}
				return false;
			},
			onTouchMoved : function(touch,event){

			},
			onTouchEnded : function(touch,event){
				_this._setColor(255);
				if(_this._isSelected){
					_this._unselectCard();
				}else{
					_this._selectCard();
				}
			}
		});

		cc.eventManager.addListener(listener,this);
	},

	_selectCard : function(){
		this._isSelected = true;

		this.runAction(cc.moveBy(0.1,0,30));

		console.log("选中牌");
		Game_Event_Center.DispatchEvent(EventType.ET_SELECTED_CARD);
		// this.setPositionY(this.getPositionY() + 30);
	},

	_unselectCard : function(){
		this._isSelected = false;

		this.runAction(cc.moveBy(0.1,0,-30));

		console.log("取消选中");
		Game_Event_Center.DispatchEvent(EventType.ET_UNSELECTED_CARD);
		// this.setPositionY(this.getPositionY() - 30);
	}
});