/**
    HTML5桌面消息( Notification: https://developer.mozilla.org/zh-CN/docs/Web/API/notification )

    WebNotify.callback = function( ){ };    // showMsg callback
    WebNotify.onclick  = function( ){ };    // 消息点击事件
    WebNotify.onshow   = function( ){ };    // 消息显示事件
    WebNotify.onerror  = function( ){ };    // 消息发送失败
    WebNotify.onclose  = function( ){ };    // 消息关闭/消失事件
    
    WebNotify.showMsg("this is title", {
        
        dir: 文字的方向;它的值可以是 auto(自动), ltr(从左到右), or rtl(从右到左)
        lang: 指定通知中所使用的语言.这个字符串必须在 BCP 47 language tag 文档中是有效的.
        body: 通知中额外显示的字符串
        tag: 赋予通知一个ID，以便在必要的时候对通知进行刷新、替换或移除.
        icon: 一个图片的URL，将被用于显示通知的图标.
    });       // 发送消息

    注: Chrome 浏览器需要放在web服务器上才能正常使用, 例如: http://127.0.0.1:1055/webnotify/webnotify.html
**/
"use strict";
;(function( root, factory ){
    console.log( root, factory );
   if(typeof exports === "object"){
        module.exports.WebNotify = new factory( );
    }else {
        root.WebNotify = new factory( );
    }
}(
    this,
    function( ){
        let self = this;

        /**
        * 各种回调
        **/
        this.callback = function( ){ };
        this.onclick  = function( ){ };
        this.onshow   = function( ){ };
        this.onerror  = function( ){ };
        this.onclose  = function( ){ };

        /**
         * 申请权限
        **/
        this.getPermission=function( Fn_Callback ){
            if(Notification && Notification.permission !== "granted"){
                Notification.requestPermission( Fn_Callback );
            }
        };

        /**
         * 推送消息
        **/
        this.showMsg=function( title_in , options_in ){
            let nowTime = new Date( ).toLocaleTimeString( );
            let options = options_in;
            let title = title_in ;

            if( !Notification ){
                throw new Error("Your browser does not support Notification objects.");
            }
            if(Notification.permission === "granted"){
                doSendMsg( title +"  "+ nowTime, options );
            }else if( Notification.permission !== "denied" ){
                self.getPermission( function( Tx_Status ){
                    if( Tx_Status === "denied" ){
                        throw new Error("Can't get permission", Tx_Status);
                    }
                    doSendMsg( title +"  "+ nowTime, options );
                });

            }
        };

        /**
         * 执行发送消息动作
        **/
        function doSendMsg( Tx_Title, OB_Options ){
            let OB_Notification = new Notification( Tx_Title, OB_Options ); 
            OB_Notification.onclick = self.onclick;
            OB_Notification.onshow  = self.onshow;
            OB_Notification.onerror = self.onerror;
            OB_Notification.onclose = self.onclose;
            if( self.callback ){ self.callback( OB_Notification ); }
        };

    }
));