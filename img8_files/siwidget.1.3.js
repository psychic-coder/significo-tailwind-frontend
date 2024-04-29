(function($){
    var host='https://www.socialintents.com/';
    var saf = /^((?!chrome|android).)*iphone/i.test(navigator.userAgent);
    if (saf){host='https://chat.socialintents.com/';}
    var intentUrl= host+"chatWidget.1.0.jsp";
    
    var pingUrl=host+"api/chat/ping.jsp";var pingStatusUrl=host+"api/chat/pingStatus.jsp";var widgetStatus;var screenWidth=1500;
    var seenTab="false";var lastMsg=0;var hasAddedMT=false;var hasLoadedCW=false;var cpColor="";var chatWidgetStatus="";
    $.fn.tabSlideOut = function(callerSettings) {
        var settings_chat = $.extend({
            tabHandle: '.handle',action: 'click',tabLocation: 'bottom',bottomPos: '200px',marginRight: '25px',marginTop: '60px',speed:100,roundedCorners:'yes',
            perPage:'false',positioning: 'absolute',popupHeight:'',popupWidth:'',backgroundImg:'',pathToTabImage: null,iconClass: null,
            imageHeight: null,tabText:null,tabOfflineText:null,chatStatus:null,type:'offers',tabWidth:null,preview:'false',
            imageWidth: '400px',tabColor:'#4781D9',urlPattern:'',tabType:'',onLoadSlideOut: false                       
        }, callerSettings||{});
        $('body').append("<div id='social-intents-tab-"+settings_chat.type+"' class='social-intents-tab' style='visibility:hidden;'></div><div id='socialintents-"+settings_chat.type+"'></div>");
        if (settings_chat.type === 'chat'){
            intentUrl= host+"chatWidget.1.0.jsp";
        }
        var obj = this;
        siScreenWidth=$(window).width();
        if (settings_chat.tabType=='circle'){
            var html="<style id='si-styles' type='text/css'>";
            html+=".siClosed {transform-origin: right 95% 0; transform: translate(0px, 0px) scale(0.1); opacity: 0; display: none;}";
            html+=".siScale {z-index:999999999!important;display:visible;transform: scale(1);transform-origin: right 95% 0;transition: transform 0.25s ease-in-out 0s, opacity 0.13s linear 0.15s, -webkit-transform 0.30s ease-in-out 0s;opacity:1;}"
            html+=".siNoScroll {position:fixed !important ;overflow: hidden !important;width: 100% !important;height: 100% !important;}";
            html+=".siNotify {font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;display:none;background: #ff1a00;background: -moz-linear-gradient(top,#ff1a00 0,#ff1a00 100%);background: -webkit-linear-gradient(top,#ff1a00 0,#ff1a00 100%);background: linear-gradient(to bottom,#ff1a00 0,#ff1a00 100%);border: 1px solid #fff;border-radius: 50%;box-shadow: 0 1px 1px 0 rgba(0,0,0,.5);color: #fff;filter: progid:dximagetransform.microsoft.gradient(startColorstr='#ff1a00', endColorstr='#ff1a00', GradientType=0);font-size: 10px;font-weight: 700;height: 16px;position: absolute;right: -2px;text-align: center;top: 0px;width: 18px;}";
            
            if (siScreenWidth <=430){
                html+="#siWidget-chat {position: fixed; bottom: 0px; right: 0px; width: 100%; height: 100%; overflow: hidden; display: none; z-index: 9999999; background: none repeat scroll 0% 0% transparent; border: 0px none;}";
                html+=".siInvite {height:190px !important;min-height:190px !important}";
            }
            else{
                html+="#siWidget-chat {position: fixed; right: 25px; height: calc(100% - 150px);bottom: 90px;width: 360px;min-height: 260px;max-height: 590px;-webkit-box-shadow: 0 5px 30px rgba(0,0,0,.15)!important;box-shadow: 0 5px 30px rgba(0,0,0,.15)!important;border-radius: 6px;overflow: hidden!important;overflow: hidden; display: none; z-index: 9999999; background: none 0% 0% repeat scroll transparent; border: 0px none;}";
                html+=".siInvite {height:190px !important;min-height:190px !important}";
            }
            html+="#si-wrapper .silc-btn {border:none;background-color:transparent;bottom:25px;height:55px;width:55px;position:fixed;right: 25px;z-index:99999000;}";
            html+="#si-wrapper.si-livechat .silc-btn-button {display:inherit;background-image:url('data:image/png;base64,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')}";
            html+=".silc-btn-button-close {background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAATlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////+QlxstAAAAGXRSTlMAAggJCxMWMTIzNExscIWGiLDV19na3un9hTvT5wAAAKpJREFUKM990kkOg0AMRNGimSGBJNAJ//4XzaIRYrCp7ZMsT1IZZCerMunJ0pmaT3wy/QDL8whUemB6HoEpk14A7UlDBGKQTN/p6s1eZ2DeJjr5SU9+UWkEqD3duambO7p676k0kDI5NxpuVcUC0Dsa5lS89nXxPMzAVAy2Jw1rf42lad7x6oddXTzEw67G43/k0bpv6+nqnac7P3zd1d+mJl+CvrYmL3WfP5rdGLokt1OvAAAAAElFTkSuQmCC') !important;background-size:20px !important;}";
            html+=".silc-btn, .silc-btn:active, .silc-btn:focus {top:unset !important;}";
            html+="button.silc-btn:focus {outline: 0;}";
            html+="#si-wrapper .silc-btn-button.silc-btn-button-color {background-color: #0E71EB;}#si-wrapper .silc-btn-button, #si-wrapper  {box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.2);}#si-wrapper .silc-btn-button {background-position: 50% center;bottom: 0;right: 0;cursor: pointer;background-repeat: no-repeat;background-size: 27px;border-radius: 50%;height: 55px;width: 55px;position: absolute;}";
            html+="</style><div id='si-wrapper' class='si-wrapper si-livechat'><button style='display: block;' aria-label='Live Chat'  class='silc-btn silc-btn-enabled' id='silc-btn'><div tabindex='0' class='silc-btn-button silc-btn-button-color'></div><div class='siNotify'></div></button></div>";
            var jtab='#social-intents-tab-chat';
            if (!$("#social-intents-tab-chat > .siTabB").length) {
                if (!$("#si-wrapper").length) {
                    $(jtab).append(html);
                }
            }
            if (settings_chat.marginRight){
                $('.siTabT').css({'width':settings_chat.tabWidth,'margin-right':settings_chat.marginRight,'right':0});
                if (siScreenWidth && siScreenWidth <= 430){
                     $('.siTabT').css({'margin-left':'10px'});
                     $('.siWidget-chat').css({'left':'25px'});
                }
            }
            if (settings_chat.tabColor && settings_chat.tabColor.length>0){
                $('.silc-btn-button-color').css({ 
                    'background-color': settings_chat.tabColor
                });
                if ("#0E71EB" != settings_chat.tabColor){
                    $('.silc-btn-button').css({ 
                        'border': settings_chat.tabColor
                    });
                }
            }
        }
        else{
            var html="<style id='si-styles' type='text/css'>";
            html+=".siClosed {transform-origin: right 95% 0; transform: translate(0px, 0px) scale(0.1); opacity: 0; display: none;}";
            html+=".siScale {z-index:999999999!important;display:visible;transform: scale(1);transform-origin: right 95% 0;transition: transform 0.25s ease-in-out 0s, opacity 0.1s linear 0.15s, -webkit-transform 0.30s ease-in-out 0s;opacity:1;}"
            html+=".siNoScroll {position: fixed !important ;overflow: hidden !important;width: 100% !important;height: 100% !important;}";
            html+=".siNotify {font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;display:none;background: #ff1a00;background: -moz-linear-gradient(top,#ff1a00 0,#ff1a00 100%);background: -webkit-linear-gradient(top,#ff1a00 0,#ff1a00 100%);background: linear-gradient(to bottom,#ff1a00 0,#ff1a00 100%);border: 1px solid #fff;border-radius: 50%;box-shadow: 0 1px 1px 0 rgba(0,0,0,.5);color: #fff;filter: progid:dximagetransform.microsoft.gradient(startColorstr='#ff1a00', endColorstr='#ff1a00', GradientType=0);font-size: 10px;font-weight: 700;height: 16px;position: absolute;right: -8px;text-align: center;top: -6px;width: 18px;}";
            
            if (siScreenWidth <=430){
                html+="#siWidget-chat {position: fixed; bottom: 0px; right: 0px; width: 100%; height: 100%; overflow: hidden; display: none; z-index: 9999999; background: none repeat scroll 0% 0% transparent; border: 0px none;}";
                html+=".siInvite {height:190px !important;min-height:190px !important}";
            }
            else{
                html+="#siWidget-chat {position: fixed; right: 25px; height: calc(100% - 150px);bottom: 60px;width: 360px;min-height: 260px;max-height: 590px;-webkit-box-shadow: 0 5px 30px rgba(0,0,0,.15)!important;box-shadow: 0 5px 30px rgba(0,0,0,.15)!important;border-radius: 6px;overflow: hidden!important;overflow: hidden; display: none; z-index: 9999999; background: none 0% 0% repeat scroll transparent; border: 0px none;}";
                html+=".siInvite {height:190px !important;min-height:190px !important}";
            }
            html+="</style>";
            html+="<div class='siTabB' style=''><div class='siButtonB' tabindex='0'>";
            html+="<div class='siButtonText' id='siButtonText-chat'></div><div class='siButtonActions'>";
            html+="<div class='siButtonActionUp fa fa-chevron-up fa-white'></div>";
            html+="<div class='siButtonActionClose fa fa-times fa-white' style='display:none'></div><div class='siNotify'></div>";
            html+="</div></div></div>";
            var jtab='#social-intents-tab-chat';
            if (!$("#social-intents-tab-chat > .siTabB").length) {
                $(jtab).append(html);
            }
            if (settings_chat.marginLeft){
                $('.siTabB').css({'width':settings_chat.tabWidth,'margin-left':settings_chat.marginLeft});
                if (siScreenWidth && siScreenWidth <= 430){
                     $('.siTabB').css({'margin-left':'10px'});
                     $('.siWidget-chat').css({'left':'25px'});
                }
                $('.siWidget-chat').css({'left':settings_chat.marginLeft});
            }
            else if (settings_chat.marginRight){
                $('.siTabB').css({'width':settings_chat.tabWidth,'margin-right':'25px','right':0});
                if (siScreenWidth && siScreenWidth <= 430){
                     $('.siTabB').css({'margin-right':'10px'});
                     $('.siWidget-chat').css({'right':'0px'});
                }
            }
            if (settings_chat.tabColor && settings_chat.tabColor.length>0){
                $('.siButtonB').css({ 
                    'background-color': settings_chat.tabColor
                });
            }
               
        }
        var html="<a id='sibutton' class='sibutton' href='#' data-target='#siWidget-"+settings_chat.type+"' aria-label='Live Chat'> </a>";
        html+="<div class='siClosed' id='siWidget-chat'></div>"
        $('body').append(html);
        $('#siWidget-chat').html('<iframe id="si_frame" scrolling="no" width="100%" height="100%" frameborder="0" allowtransparency="true" ></iframe>');
        var jtab='#social-intents-tab-chat';
        
        $(document).on('keypress', jtab, function(e) {  
            if (e.which == 13) {
                if ($(".silc-btn-button").hasClass("silc-btn-button-close")) {
                    event.preventDefault();
                    event.stopPropagation();
                    var iframe = document.getElementById("si_frame")
                    iframe.contentWindow.postMessage("siCloseChat","*");
                }
                else if ($(".siButtonActionClose").is(':visible')) {
                    event.preventDefault();
                    event.stopPropagation();
                    var iframe = document.getElementById("si_frame")
                    iframe.contentWindow.postMessage("siCloseChat","*");
                }
                else{
                    event.preventDefault();
                    event.stopPropagation();
                    showChatWindow(settings_chat);
                    try {sessionStorage.setItem("si_unread_msg_count",0);}catch (err){}
                    $(".siNotify").hide();
                }
            } 
        });
        
        
        $(document).on('click', jtab, function(event) {  
            if ($(".silc-btn-button").hasClass("silc-btn-button-close")) {
                event.preventDefault();
                event.stopPropagation();
                var iframe = document.getElementById("si_frame")
                iframe.contentWindow.postMessage("siCloseChat","*");
            }
            else if ($(".siButtonActionClose").is(':visible')) {
                event.preventDefault();
                event.stopPropagation();
                var iframe = document.getElementById("si_frame")
                iframe.contentWindow.postMessage("siCloseChat","*");
            }
            else{
                event.preventDefault();
                event.stopPropagation();
                showChatWindow(settings_chat);
                try {sessionStorage.setItem("si_unread_msg_count",0);}catch (err){}
                $(".siNotify").hide();
            }
        });
        
        if ('true' == isCWOpen()){
            showChatWindow(settings_chat);
            try {sessionStorage.setItem("si_unread_msg_count",0);}catch (err){}
            $(".siNotify").hide();
        }
        
        $('#socialintents-tab-close-'+settings_chat.type).click(function(event){
            event.preventDefault();
            event.stopPropagation();
            $('#social-intents-tab-'+settings_chat.type).hide();
        });
        
        $(document).on('click', '.siButtonActionClose-'+settings_chat.type, function(event) {  
            event.preventDefault();
            event.stopPropagation();
            $('#social-intents-tab-'+settings_chat.type).hide();
        });
        
        var pagesVisit=incrementPages();if (pagesVisit === 1) incrementVisits();
        ping(pingUrl,settings_chat);
        };
        function showTab(settings_chat2) {
            var jtab='#social-intents-tab-'+settings_chat.type;
            
            if (settings_chat2.chatStatus==1){
                var jbtn='#siButtonText-'+settings_chat.type;
                $(jbtn).html(settings_chat.tabText);
                
                if ($("#siWidget-chat").hasClass("siScale")) {
                    try{sessionStorage.setItem("si_unread_msg_count",0);}catch (err){}
                    $("#siNotify").hide();
                }
                else {
                    try{
                    var si_unread_msg_count=parseInt(sessionStorage.getItem("si_unread_msg_count"));
                    var si_last_msg=parseInt(sessionStorage.getItem("si_last_msg"));
                    if (si_unread_msg_count > 0 && ((new Date().getTime() - si_last_msg) < 600000))
                    {
                        $('.siNotify').html(si_unread_msg_count);
                        $(".siNotify").show();
                    }
                    }catch (err){}
                }
            }
            else{
                var jbtn='#siButtonText-'+settings_chat.type;
                $(jbtn).html(settings_chat.tabOfflineText);
            }
            
            if (!$("#siWidget-chat") || !$("#siWidget-chat").is(':visible')) {
                $(jtab).css({
                    'visibility':'visible'
                });
                $(jtab).show();
            }
        }
        function ping(pingUrl,settings_chat){
            var widgetSettings;
            try {
                widgetSettings=JSON.parse(sessionStorage.getItem("si_settings_chat-"+settings_chat.widgetId));
            }catch (err){}
            if (widgetSettings)
            {
                if (widgetSettings.cv!=="1" && widgetSettings.hide !=="1" &&
                    widgetSettings.widgetStatus !== "3")
                {
                    doShowTab(widgetSettings,settings_chat);
                }
                chatWidgetStatus=widgetSettings.chatStatus;
            }
            else{
                var now = new Date();
                var p=encodeURIComponent(document.URL);;
                var si_cur_page='';
                        try{
                            si_cur_page=sessionStorage.getItem("si_cur_page");
                        }catch (err){}
                if (si_cur_page && si_cur_page.length > 0) p=si_cur_page;
                var ping=pingUrl+'?wid='+settings_chat.widgetId+'&p='+p+'&t='+now.getTime()+'&cvid='+getCvid()+'&uid='+getId();;
                $.ajax({
                    type: 'GET',url: ping,async: true,cache:false,
                    jsonpCallback:'jsonCallback'+settings_chat.type,contentType: "application/json",
                    dataType: 'jsonp',
                    success: function(json) {
                        //console.dir(json.sites);
                        try{sessionStorage.setItem('si_settings_chat-'+settings_chat.widgetId, JSON.stringify(json));}catch (err){}
                        var widgetSettings;
                        try {
                            widgetSettings=JSON.parse(sessionStorage.getItem("si_settings_chat-"+settings_chat.widgetId));
                            chatWidgetStatus=widgetSettings.chatStatus;
                        }catch (err){}
                        if (widgetSettings.cv!="1" && widgetSettings.hide !=="1"  &&
                             widgetSettings.widgetStatus !== "3")
                        {
                            doShowTab(widgetSettings,settings_chat)
                        }
                    },
                    error: function(e) {
                        console.log(e.message);
                    }
                });
            }
            setTimeout(function() {
                try{sessionStorage.removeItem('si_settings_chat-'+settings_chat.widgetId);}catch (err){}
            }, 30000)
        }
        function pingChatStatus(pingUrl,settings_chat){
            var widgetSettings;
            try {
                widgetSettings=JSON.parse(sessionStorage.getItem("si_settings_chat-"+settings_chat.widgetId));
            }catch (err){}
            if (widgetSettings)
            {
                chatWidgetStatus = widgetSettings.chatStatus;
            }
            else{
                var now = new Date();
                var p=encodeURIComponent(document.URL);;
                var ping=pingUrl+'?wid='+settings_chat.widgetId+'&p='+p+'&t='+now.getTime()+'&cvid='+getCvid()+'&uid='+getId();
                $.ajax({
                    type: 'GET',url: ping,async: false,cache:false,
                    jsonpCallback:'jsonCallbackPing',contentType: "application/json",
                    dataType: 'jsonp',
                    success: function(json) {
                        try{sessionStorage.setItem('si_settings_chat-'+settings_chat.widgetId, JSON.stringify(json));}catch (err){}
                        var widgetSettings;
                        try {
                            widgetSettings=JSON.parse(sessionStorage.getItem("si_settings_chat-"+settings_chat.widgetId));
                            chatWidgetStatus=widgetSettings.chatStatus;
                        }catch (err){}
                        
                    },
                    error: function(e) {
                        console.log(e.message);
                    }
                });
            }
        }
        function showChatWindow(settings_chat, doInvite, doHide, doTriggered) {
            if (typeof SI_API !== "undefined" && typeof(SI_API.onChatOpened) === 'function') { 
                SI_API.onChatOpened();
            }
            var now=new Date();var p=encodeURIComponent(document.URL);var length=512;
            if (p.length > length) {
                p= p.substring(0, length);
            }
            var dref=encodeURIComponent(document.referrer);
            var length=512;
            if (dref.length > length) {
                dref=dref.substring(0, length);
            }
            var widgetStatus=settings_chat.widgetStatus; 
            var si_cur_page='';
            try{
                si_cur_page=sessionStorage.getItem("si_cur_page");
            }catch (err){}
            if (si_cur_page && si_cur_page.length > 0) p=si_cur_page;
            var jwgt = '#siWidget-'+settings_chat.type;
            cpColor=localStorage.getItem(settings_chat.widgetId+"-wixCpColor");
            var curl=intentUrl + '?s='+widgetStatus+'&wid='+settings_chat.widgetId+'&hp='+hasSeenPopup()+'&t='+now.getTime()+'&uid='+getId()+'&v='+getVisits()+'&cp='+encodeURIComponent(cpColor);
            try{
                var siName=sessionStorage.getItem("si_name");
                if (typeof siName !== 'undefined' && siName && siName !== 'undefined')curl+="&si_name="+encodeURIComponent(siName);
                var siEmail=sessionStorage.getItem("si_email");
                if (typeof siEmail !== 'undefined' && siEmail && siEmail !== 'undefined')curl+="&si_email="+encodeURIComponent(siEmail);
                var siPhone=sessionStorage.getItem("si_phone");
                if (typeof siPhone !== 'undefined' && siPhone && siPhone !== 'undefined' && siPhone !== 'null')curl+="&si_phone="+encodeURIComponent(siPhone);
                var siCustom1=sessionStorage.getItem("si_custom1");
                if (typeof siCustom1 !== 'undefined' && siCustom1 && siCustom1 !== 'undefined' && siCustom1 !== 'null')curl+="&si_custom1="+encodeURIComponent(siCustom1);
                var siCustom2=sessionStorage.getItem("si_custom2");
                if (typeof siCustom2 !== 'undefined' && siCustom2 && siCustom2 !== 'undefined' && siCustom2 !== 'null')curl+="&si_custom2="+encodeURIComponent(siCustom2);
                var siCustom3=sessionStorage.getItem("si_custom3");
                if (typeof siCustom3 !== 'undefined' && siCustom3 && siCustom3 !== 'undefined' && siCustom3 !== 'null')curl+="&si_custom3="+encodeURIComponent(siCustom3);
                var siCustom4=sessionStorage.getItem("si_custom4");
                if (typeof siCustom4 !== 'undefined' && siCustom4 && siCustom4 !== 'undefined' && siCustom4 !== 'null')curl+="&si_custom4="+encodeURIComponent(siCustom4);
                var siCustom5=sessionStorage.getItem("si_custom5");
                if (typeof siCustom5 !== 'undefined' && siCustom5 && siCustom5 !== 'undefined' && siCustom1 !== 'null')curl+="&si_custom5="+encodeURIComponent(siCustom5);
                var siCustom6=sessionStorage.getItem("si_custom6");
                if (typeof siCustom6 !== 'undefined' && siCustom6 && siCustom6 !== 'undefined' && siCustom6 !== 'null')curl+="&si_custom6="+encodeURIComponent(siCustom6);
                var siGroup=sessionStorage.getItem("si_group");
                if (typeof siGroup !== 'undefined' && siGroup && siGroup !== 'undefined' && siGroup !== 'null')curl+="&si_group="+encodeURIComponent(siGroup);
                var siQuestion=sessionStorage.getItem("si_question");
                if (typeof siQuestion !== 'undefined' && siQuestion && siQuestion !== 'undefined' && siQuestion !== 'null')curl+="&si_question="+encodeURIComponent(siQuestion);
                var siProactiveMessage=sessionStorage.getItem("si_proactivemessage");
                if (typeof siProactiveMessage !== 'undefined' && siProactiveMessage && siProactiveMessage !== 'undefined' && siProactiveMessage !== 'null')curl+="&si_proactivemessage="+encodeURIComponent(siProactiveMessage);
                var siSetInfo=sessionStorage.getItem("si_setinfo");
                if (typeof siSetInfo !== 'undefined' && siSetInfo && siSetInfo !== 'undefined' && siSetInfo !== 'null')curl+="&si_setinfo="+encodeURIComponent(siSetInfo);
                var siParams=sessionStorage.getItem("si_params");
                if (typeof siParams !== 'undefined' && siParams && siParams !== 'undefined' && siParams !== 'null')curl+="&si_params="+encodeURIComponent(siParams);
                var siEnd=sessionStorage.getItem("si_end");
                if (typeof siEnd !== 'undefined' && siEnd && siEnd !== 'undefined') {
                    console.log("end chat 1");
                    curl+="&si_end="+encodeURIComponent(siEnd);
                    sessionStorage.removeItem("si_end");
                    //sessionStorage.removeItem("si_chatsid_"+settings_chat.widgetId);
                }
                
            }catch (err){}
            if(/iPhone|iPod|Android/.test(window.navigator.userAgent)){
                intentUrl= host+"chatWidget.1.0.jsp";
                try{cpColor=localStorage.getItem(settings_chat.widgetId+"-wixCpColor");}catch (err){}
                curl=intentUrl + '?s='+widgetStatus+'&wid='+settings_chat.widgetId+'&hp='+hasSeenPopup()+'&t='+now.getTime()+'&uid='+getId()+'&v='+getVisits()+'&cp='+encodeURIComponent(cpColor);
                try{
                    var siName=sessionStorage.getItem("si_name");
                    if (typeof siName !== 'undefined' && siName && siName !== 'undefined')curl+="&si_name="+encodeURIComponent(siName);
                    var siEmail=sessionStorage.getItem("si_email");
                    if (typeof siEmail !== 'undefined' && siEmail && siEmail !== 'undefined')curl+="&si_email="+encodeURIComponent(siEmail);
                    var siPhone=sessionStorage.getItem("si_phone");
                    if (typeof siPhone !== 'undefined' && siPhone && siPhone !== 'undefined' && siPhone !== 'null')curl+="&si_phone="+encodeURIComponent(siPhone);
                    var siCustom1=sessionStorage.getItem("si_custom1");
                    if (typeof siCustom1 !== 'undefined' && siCustom1 && siCustom1 !== 'undefined' && siCustom1 !== 'null')curl+="&si_custom1="+encodeURIComponent(siCustom1);
                    var siCustom2=sessionStorage.getItem("si_custom2");
                    if (typeof siCustom2 !== 'undefined' && siCustom2 && siCustom2 !== 'undefined' && siCustom2 !== 'null')curl+="&si_custom2="+encodeURIComponent(siCustom2);
                    var siCustom3=sessionStorage.getItem("si_custom3");
                    if (typeof siCustom3 !== 'undefined' && siCustom3 && siCustom3 !== 'undefined' && siCustom3 !== 'null')curl+="&si_custom3="+encodeURIComponent(siCustom3);
                    var siCustom4=sessionStorage.getItem("si_custom4");
                    if (typeof siCustom4 !== 'undefined' && siCustom4 && siCustom4 !== 'undefined' && siCustom4 !== 'null')curl+="&si_custom4="+encodeURIComponent(siCustom4);
                    var siCustom5=sessionStorage.getItem("si_custom5");
                    if (typeof siCustom5 !== 'undefined' && siCustom5 && siCustom5 !== 'undefined' && siCustom1 !== 'null')curl+="&si_custom5="+encodeURIComponent(siCustom5);
                    var siCustom6=sessionStorage.getItem("si_custom6");
                    if (typeof siCustom6 !== 'undefined' && siCustom6 && siCustom6 !== 'undefined' && siCustom6 !== 'null')curl+="&si_custom6="+encodeURIComponent(siCustom6);
                    var siGroup=sessionStorage.getItem("si_group");
                    if (typeof siGroup !== 'undefined' && siGroup && siGroup !== 'undefined' && siGroup !== 'null')curl+="&si_group="+encodeURIComponent(siGroup);
                    var siQuestion=sessionStorage.getItem("si_question");
                    if (typeof siQuestion !== 'undefined' && siQuestion && siQuestion !== 'undefined' && siQuestion !== 'null')curl+="&si_question="+encodeURIComponent(siQuestion);
                    var siProactiveMessage=sessionStorage.getItem("si_proactivemessage");
                    if (typeof siProactiveMessage !== 'undefined' && siProactiveMessage && siProactiveMessage !== 'undefined' && siProactiveMessage !== 'null')curl+="&si_proactivemessage="+encodeURIComponent(siProactiveMessage);
                    var siSetInfo=sessionStorage.getItem("si_setinfo");
                    if (typeof siSetInfo !== 'undefined' && siSetInfo && siSetInfo !== 'undefined' && siSetInfo !== 'null')curl+="&si_setinfo="+encodeURIComponent(siSetInfo);
                    var siParams=sessionStorage.getItem("si_params");
                    if (typeof siParams !== 'undefined' && siParams && siParams !== 'undefined' && siParams !== 'null')curl+="&si_params="+encodeURIComponent(siParams);
                }catch (err){}
                $('#siWidget-chat').css('max-height','736px');
                if (doInvite){
                    $('#siWidget-chat').addClass("siInvite");
                }
            }
            if (!hasLoadedCW){
                if (doInvite){
                    curl+="&di=true";
                }
                curl+='&p='+p+'&r='+dref;
                $('#si_frame').attr('src',curl);
                $("#si_frame").on("load",function() {
                    $("#siWidget-chat").css({
                        'display':'inherit',
                    });
                    setTimeout(function() {
                        if (!doHide) {
                        $(".silc-btn-button").addClass("silc-btn-button-close");
                        $("#siWidget-chat").addClass("siScale");
                        }
                        if (doInvite){
                            if (!doHide) {
                                $('#siWidget-chat').addClass("siInvite");
                            }
                        }
                        else {
                            if (!doHide) {
                            
                            $('#siWidget-chat').removeClass("siInvite");
                                if(/iPhone|iPod|Android/.test(window.navigator.userAgent)){
                                    setTimeout(function() {
                                        $('body').addClass("siNoScroll");
                                    }, 50)
                                }
                            }
                        }
                        
                        var hsize=$("#siWidget-chat").height();
                        var iframe = document.getElementById("si_frame")
                        hasLoadedCW=true;
                        if (hsize > 80) {
                            setTimeout(function() {
                                iframe.contentWindow.postMessage("siResizeWindow:"+hsize,"*");
                            }, 500);
                            
                        }
                        else
                        {
                            setTimeout(function() {
                                var hsize=$("#siWidget-chat").height();
                                var iframe = document.getElementById("si_frame")
                                iframe.contentWindow.postMessage("siResizeWindow:"+hsize,"*");
                            }, 1000);
                        }
                    }, 50);
                    if (doInvite){
                        setTimeout(function() {
                            var hsize=$("#siWidget-chat").height();
                            var iframe = document.getElementById("si_frame")
                            iframe.contentWindow.postMessage("siResizeWindow:"+hsize,"*");
                            doInvite=false;
                        }, 1500);
                    }
                });
                hasLoadedCW=true;
                setTimeout(function() {
                    hasLoadedCW=false;doInvite=false;
                }, 2*60000);
                
                if(/Android/.test(window.navigator.userAgent)){
                } else {
                    $( window ).resize(function() {
                        var hsize=$("#siWidget-chat").height();
                        var iframe = document.getElementById("si_frame")
                        iframe.contentWindow.postMessage("siResizeWindow:"+hsize,"*");
                    });
                }  
                
            }
            else
            {
                $("#siWidget-chat").css({
                    'display':'inherit'
                });
                setTimeout(function() {
                    if (!doHide) {
                    $(".silc-btn-button").addClass("silc-btn-button-close");
                    $("#siWidget-chat").addClass("siScale");
                    }
                    if (doInvite){
                        $('#siWidget-chat').addClass("siInvite");
                    }
                    else if(/iPhone|iPod|Android/.test(window.navigator.userAgent)){
                        setTimeout(function() {
                            $('body').addClass("siNoScroll");
                        }, 500)
                    }
                }, 0)
                
                //0808
                if (!doInvite){
                setTimeout(function() {
                    var hsize=$("#siWidget-chat").height();
                    var iframe = document.getElementById("si_frame")
                    iframe.contentWindow.postMessage("siResizeWindow:"+hsize,"*");
                }, 500);
                }
                else
                {
                    console.log("doInvite");
                }
            }
            if (typeof doTriggered == 'undefined' || !doTriggered){
                setCWOpen();
            }
            
            if (typeof(openChatFrame) === 'function')
            {
                openChatFrame();
            }
            if (!doHide) {
            setTimeout(function() {
                $(".siButtonActionUp").hide();
                $(".siButtonActionClose").show();
            }, 50)
            setHasSeenPopup();
            }
        };
        function doShowTab(widgetSettings,settings_chat){
            var show=true;
            var criteriaWhen='always';
            widgetStatus=widgetSettings.widgetStatus; 
            settings_chat.chatStatus=widgetSettings.chatStatus;
            if (widgetSettings.widgetStatus==="0" && settings_chat.preview !=='true'){
                try{sessionStorage.setItem("si_hideWidget-"+settings_chat.widgetId,"true");}catch (err){}
            }
            else if (widgetSettings.status==="1"){
                try{sessionStorage.removeItem("si_hideWidget-"+settings_chat.widgetId);}catch (err){}
                var action=widgetSettings.rules[0].action;
                var onPageTime=widgetSettings.rules[0].onPageTime;
                var onLeave=widgetSettings.rules[0].onLeave;
                var onVisit=widgetSettings.rules[0].onVisit;
                var onPage=widgetSettings.rules[0].onPage;
                criteriaWhen=widgetSettings.rules[0].criteriaWhen;
                var cvid=widgetSettings.cvid;
                if (cvid.length > 0) convert(cvid);
                var pages=getPages();
                var visits=getVisits();
                if (visits < onVisit){
                    show=false;
                }
                if (pages < onPage){
                    show=false;
                }
                if (getTimeOnPage() < onPageTime){
                    show=false;
                    setTimeout(function() {
                        doShowTab(widgetSettings,settings_chat);
                    }, 5000)
                }
                else if (onPageTime < 0){
                    show=false;
                }
                var now = new Date();
                if (((onLeave > 0) && !hasAddedMT)) {
                    hasAddedMT=true;
                    $('html').mouseleave(function(e) {
                        var now = new Date().getTime();var p=encodeURIComponent(document.URL);var length=512;
                        if (p.length > length) {
                            p= p.substring(0, length);
                        }
                        var si_cur_page='';
                        try {
                            si_cur_page=sessionStorage.getItem("si_cur_page");
                        }catch (err){}
                        if (si_cur_page && si_cur_page.length > 0) p=si_cur_page;
                        var hw;
                        try{
                            hw=sessionStorage.getItem("si_hideWidget-"+settings_chat.widgetId);
                        }catch (err){}
                        var jwgt='#siWidget-'+settings_chat.type;
                         if (!$(jwgt).is(":visible") && "true" !== hw && (settings_chat.perPage=== "true" || (hasSeenPopup() === "false" || onLeave ===2)))
                         {
                             if (e.clientY < 0)  {
                                 showTab(settings_chat);
                                 showChatWindow(settings_chat);
                             }
                         }
                     });
                }
            }
            else{
                var action=widgetSettings.rules[0].action;
            }
            
            if (show){
                if ("showTab" == action){
                    showTab(settings_chat);
                    try{
                    var sicd_chatstatus=sessionStorage.getItem("sicd_chatstatus");
                    if (sicd_chatstatus == 'active'){
                        setTimeout(function() {
                            showChatWindow(settings_chat,false,true,false);
                        }, 10000)
                    }
                    }catch (err){}
                }
                else if ("showPopupOnly" == action){
                    if ((criteriaWhen === 'always' && hasSeenPopup() === 'false' )  ||
                            (criteriaWhen==='notConverted' && cvid==='' ) ||
                            (criteriaWhen==='noPopupEver' && hasEverSeenPopup() === 'false' )
                    ) {
                        showTab(settings_chat);   
                        if (widgetSettings.chatInvite != ''
                            && widgetSettings.chatStatus==1
                        ) {
                            showChatWindow(settings_chat,true,false,true);
                        }
                        else if (widgetSettings.chatStatus==1){
                            showChatWindow(settings_chat,false,false,true);
                        }
                     }
                     try{
                     var sicd_chatstatus=sessionStorage.getItem("sicd_chatstatus");
                     if (sicd_chatstatus == 'active'){
                        setTimeout(function() {
                            showChatWindow(settings_chat,false,true,false);
                        }, 10000)
                     }
                     }catch (err){}
                }
                else if ("showPopupHideTab" == action){
                    if ((criteriaWhen === 'always' && hasSeenPopup() === 'false' )  ||
                            (criteriaWhen==='notConverted' && cvid==='' ) ||
                            (criteriaWhen==='noPopupEver' && hasEverSeenPopup() === 'false' )
                    ) {
                        if (widgetSettings.chatInvite != ''
                            && widgetSettings.chatStatus==1
                        ) {
                            showChatWindow(settings_chat,true,false,true);
                        }
                        else if (widgetSettings.chatStatus==1){
                            showChatWindow(settings_chat,false,false,true);
                        }
                    }
                    
                }
                else if ("showPopup" == action){
                    if ((criteriaWhen === 'always' && hasSeenPopup() === 'false' )  ||
                                (criteriaWhen==='notConverted' && cvid==='' ) ||
                                (criteriaWhen==='noPopupEver' && hasEverSeenPopup() === 'false' )
                    ) {
                        if (widgetSettings.chatInvite != ''
                            && widgetSettings.chatStatus==1
                        ) {
                            showChatWindow(settings_chat,true,false,true);
                        }
                        else if (widgetSettings.chatStatus==1){
                            showChatWindow(settings_chat,false,false,true);
                        }
                    }
                    showTab(settings_chat);setHasSeenTab();
                    try{
                    var sicd_chatstatus=sessionStorage.getItem("sicd_chatstatus");
                    if (sicd_chatstatus == 'active'){
                        setTimeout(function() {
                            showChatWindow(settings_chat,false,true,false);
                        }, 10000)
                    }
                    }catch (err){}
                }
            }
            else if ("showPopup" == action && hasSeenTab()=='false'){
                showTab(settings_chat);setHasSeenTab();
            }
        }
        function getReferrer(){
            return document.referrer;
        }
        function getUrl(){
            return window.location.pathname;
        }
        function getId(){
            var id=localStorage.getItem("si_gid-"+settings_chat.widgetId);
            if (!id || id.length ==0)
            {
                id=new Date().getTime();
                localStorage.setItem("si_gid-"+settings_chat.widgetId,""+id);
            }
            return id;
        }
        function getPages(){
            var pages=1;
            try{
                pages= sessionStorage.getItem("si_sessionVisits-"+settings_chat.widgetId);
            if (!pages || pages == null || pages=="") {
                pages="1";
            }
            }catch (err){}
            return Number(pages);
        }
        function convert(cvid){
            try{
            localStorage.setItem("si_convert-"+settings_chat.widgetId,"true");
            localStorage.setItem("si_cvid-"+settings_chat.widgetId,cvid);
            }catch (err){}
        }
        function getCvid(){
            try {
            return localStorage.getItem("si_cvid-"+settings_chat.widgetId);
            }catch (err){return '';}
        }   
        function hasConverted(){
            try{
            return localStorage.getItem("si_convert-"+settings_chat.widgetId);
            }catch (err){}
        }
        function incrementPages(){
            var visits="1";
            try{
                visits=sessionStorage.getItem("si_sessionVisits-"+settings_chat.widgetId);
            if (!visits || visits == null || visits=="") {
                visitStart=(new Date()).getTime();visits=1;
            }
            else{
                visits=parseInt(visits)+1;
            }
            sessionStorage.setItem("si_sessionVisits-"+settings_chat.widgetId,visits);
            }catch (err){}
            return parseInt(visits);
        }
        function getVisits(){
            var visits="1";
            try{
                visits= localStorage.getItem("si_totalVisits-"+settings_chat.widgetId);
                if (!visits || visits == null || visits=="") {
                    visits="1";
                }
            }catch (err){}
            return Number(visits);
                
        }
        function incrementVisits(){
            var visits=localStorage.getItem("si_totalVisits-"+settings_chat.widgetId);
            if (!visits || visits == null || visits=="") {
                visits=1;
            }
            else{
                visits=parseInt(visits)+1;
            }
            localStorage.setItem("si_totalVisits-"+settings_chat.widgetId,visits);
            return parseInt(visits);
        }
        function hasSeenTab(){
            return seenTab;
        }
        function setHasSeenTab(){
            seenTab="true";
        }
        function hasSeenPopup(){
            try{
            var hasSeenPopup=sessionStorage.getItem("si_hasSeenPopup-"+settings_chat.widgetId);
            if (hasSeenPopup === null)return "false";
            else return hasSeenPopup;
            }catch (err){return "false";}
        }
        function setHasSeenPopup(){
            try{
            localStorage.setItem("si_hasEverSeenPopup-"+settings_chat.widgetId,"true");
            return sessionStorage.setItem("si_hasSeenPopup-"+settings_chat.widgetId,"true");
            }catch (err){return "false";}
        }
        function isCWOpen(){
            try{
            var iscwopen=sessionStorage.getItem("si_cwopen-"+settings_chat.widgetId);
            if (iscwopen === null)return "false";
            else return iscwopen;
            }catch (err){"false";}
        }
        function setCWOpen(){
            try{
            sessionStorage.setItem("si_cwopen-"+settings_chat.widgetId,"true");
            }catch (err){}
        }
        function setCWClose(){
            try{
            sessionStorage.setItem("si_cwopen-"+settings_chat.widgetId,"false");
            }catch (err){}
        }
        function hasEverSeenPopup(){
            try{
            var hasEverSeenPopup=localStorage.getItem("si_hasEverSeenPopup-"+settings_chat.widgetId);
            if (hasEverSeenPopup === null)return "false";
            else return hasEverSeenPopup;
            }catch (err){return "false";}
        }
        function setHasEverSeenPopup(){
            try{
            return localStorage.setItem("si_hasEverSeenPopup-"+settings_chat.widgetId,"true");
            }catch (err){}
        }
        function hasShared(){
            try{
            var hasShared= sessionStorage.getItem("si_hasShared-"+settings_chat.widgetId);
            if (hasShared === null)return "false";
            else return hasShared;
            }catch (err){return "false";}
        }
        function setShared(){
            try{
            return sessionStorage.setItem("si_hasShared-"+settings_chat.widgetId,"true");
            }catch (err){}
        }
        function getTimeOnPage(){
            var now=(new Date()).getTime();
            var elapsed=(now-pageStartTime)/1000;
            return elapsed;
        }
        function getTimeOnSite(){
            var now=(new Date()).getTime();
            var elapsed=(now-visitStartTime)/1000;
            return elapsed;
        }
        var visitStartTime;
        var pageStartTime=(new Date()).getTime();
       
    $.fn.showTab = function(settings_chat) {
        setHasSeenTab();
        showTab(settings_chat);
    }
    $.fn.hideTab = function(settings_chat) {
        var jtab='.social-intents-tab-'+settings_chat.type;
        $(jtab).css({
            'visibility':'hidden'
        });
        $(jtab).hide();
        $('body').removeClass("siNoScroll");
        $("#siWidget-chat").hide();
        $("#siWidget-chat").removeClass("siScale");
        $(".social-intents-tab").hide();
    }
    $.fn.hidePopup = function(settings_chat) {
        var jwgt='#siWidget-'+settings_chat.type;
        if($(jwgt).is(':visible')){
            $(jwgt).hide();
        }
    }
    $.fn.showPopup = function(settings_chat) {
        var jwgt = '#siWidget-'+settings_chat.type;
        if($(jwgt).is(':visible')===false){
            showChatWindow(settings_chat,false);
            setHasSeenPopup();
        }
    }
    $.fn.setChatInfo = function(name, email, phone, group, question) {
        try{
        sessionStorage.setItem("si_name",name);
        sessionStorage.setItem("si_email",email);
        sessionStorage.setItem("si_phone",phone);
        sessionStorage.setItem("si_group",group);
        sessionStorage.setItem("si_question",question);
        sessionStorage.setItem("si_setinfo","true");
        }catch (err){}
        hasLoadedCW=false;
    }
    $.fn.addParams = function(params) {
        try{
        sessionStorage.setItem("si_params",JSON.stringify(params));
        }catch (err){}
    }
    $.fn.getChatStatus = function() {
        try{
            var now = new Date();
            var ping=pingStatusUrl+'?wid='+settings_chat.widgetId+'&t='+now.getTime();
            pingChatStatus(ping,settings_chat);
            return chatWidgetStatus;
        }catch (err){ alert(err);}
    }
    $.fn.endChat = function() {
        try{
            sessionStorage.setItem("si_end","1");
            
        }catch (err){ alert(err);}
    }
    $.fn.closeChatWindow = function() {
        try{
            var iframe = document.getElementById("si_frame")
            iframe.contentWindow.postMessage("siCloseChat","*");
            
        }catch (err){ alert(err);}
    }
    $.fn.showInvite = function(message) {
        try{
        sessionStorage.setItem("si_proactivemessage",message);
        }catch (err){}
        var jwgt = '#siWidget-'+settings_chat.type;
        if($(jwgt).is(':visible')===false){
            showChatWindow(settings_chat,true,false,true);
            setHasSeenPopup();
        }
    }
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventer(messageEvent,function(e) {
        if ($.type(e.data) === "string" && e.data.indexOf('siCloseWindow') >= 0 ){
            $('body').removeClass("siNoScroll");
            
            if ($("#siWidget-chat").hasClass("siInvite")) {
                $('#siWidget-chat').removeClass("siInvite");
                var hsize=$("#siWidget-chat").height();
                var iframe = document.getElementById("si_frame");
                iframe.contentWindow.postMessage("siResizeWindow:"+hsize,"*");
            }
            
            $("#siWidget-chat").hide();
            $("#siWidget-chat").removeClass("siScale");
            $(".silc-btn-button").removeClass("silc-btn-button-close");
            $("#social-intents-tab-chat").show();
            $(".siButtonActionClose").hide();
            $(".siButtonActionUp").show();
            $(".siTabB").css({'visibility':'visible'});
            setCWClose();
            if (typeof(closeChatFrame) === 'function'){
                closeChatFrame();
            }
            if (typeof(SI_API.onChatClosed) === 'function') { 
                SI_API.onChatClosed();
            }
        }
        else if ($.type(e.data) === "string" && e.data.indexOf('siInviteClick') >= 0 ){
            if(/iPhone|iPod|Android/.test(window.navigator.userAgent)){
                setTimeout(function() {
                    $('body').addClass("siNoScroll");
                }, 50)
            }
            $('#siWidget-chat').removeClass("siInvite");
            var hsize=$("#siWidget-chat").height();
            var iframe = document.getElementById("si_frame");
            iframe.contentWindow.postMessage("siResizeWindow:"+hsize,"*");
        }
        else if ($.type(e.data) === "string" && e.data.indexOf('siNoScroll') >= 0 ){
            $('body').addClass("siNoScroll");
        }
        else if ($.type(e.data) === "string" && e.data.indexOf('siAbsolute') >= 0 ){
             window.scrollTo(0, 0);
        }
        else if ($.type(e.data) === "string" && e.data.indexOf('siBottom') >= 0 ){
            $(window).scrollTop($(document).height());
        }
        else if ($.type(e.data) === "string" && e.data.indexOf('siChatEnded') >= 0 ){
            if (typeof(SI_API.onChatEnded) === 'function') { 
                SI_API.onChatEnded();
            }
            try{
            sessionStorage.setItem("sicd_chatstatus","");
            }catch (err){}
        }
        else if ($.type(e.data) === "string" && e.data.indexOf('siChatStarted') >= 0 ){
            try{
            sessionStorage.setItem("sicd_chatstatus","active");
            }catch (err){}
        }
        else if ($.type(e.data) === "string" && e.data.indexOf('siMsg') >= 0 ){
            if ($("#siWidget-chat").hasClass("siScale")) {
                try{
                sessionStorage.setItem("si_unread_msg_count",0);
                lastMsg=new Date().getTime();
                sessionStorage.setItem("si_last_msg",lastMsg);
                }catch (err){}
                $("#siNotify").hide();
            }
            else {
                try{
                var si_unread_msg_count=parseInt(sessionStorage.getItem("si_unread_msg_count"));
                if (!si_unread_msg_count){si_unread_msg_count=1}
                else {si_unread_msg_count=si_unread_msg_count+1;}
                $('.siNotify').html(si_unread_msg_count);
                $(".siNotify").show();
                sessionStorage.setItem("si_unread_msg_count",si_unread_msg_count);
                lastMsg=new Date().getTime();
                sessionStorage.setItem("si_last_msg",lastMsg);
                }catch (err){}
            }
        }
        
    },false);
   
})(jQuery);
if (typeof socialintents_vars_chat === 'undefined') {
    settings_chat = {
        tabHandle: socialintents_vars2_chat.tabHandle,imageHeight: socialintents_vars2_chat.imageHeight,imageWidth: socialintents_vars2_chat.imageWidth,tabLocation: socialintents_vars2_chat.tabLocation,type:socialintents_vars2_chat.type,action: socialintents_vars2_chat.action,pathToTabImage: socialintents_vars2_chat.pathToTabImage,tabText:socialintents_vars2_chat.tabText,tabOfflineText:socialintents_vars2_chat.tabOfflineText,tabWidth:socialintents_vars2_chat.tabWidth,topPos: socialintents_vars2_chat.topPos,bottomPos: socialintents_vars2_chat.bottomPos,headerTitle: socialintents_vars2_chat.headerTitle,marginLeft: socialintents_vars2_chat.marginLeft,marginRight: socialintents_vars2_chat.marginRight,marginTop: socialintents_vars2_chat.marginTop,marginTopc: socialintents_vars2_chat.marginTopc,widgetId: socialintents_vars2_chat.widgetId,popupHeight: socialintents_vars2_chat.popupHeight,popupWidth: socialintents_vars2_chat.popupWidth,backgroundImg: socialintents_vars2_chat.backgroundImg,tabColor:socialintents_vars2_chat.tabColor,roundedCorners:socialintents_vars2_chat.roundedCorners,perPage:socialintents_vars2_chat.perPage,urlPattern:socialintents_vars2_chat.urlPattern,tabType:socialintents_vars2_chat.tabType,f: socialintents_vars2_chat.f
    };
}
else {
    settings_chat ={
        tabHandle: socialintents_vars_chat.tabHandle,imageHeight: socialintents_vars_chat.imageHeight,imageWidth: socialintents_vars_chat.imageWidth,tabLocation: socialintents_vars_chat.tabLocation,type:socialintents_vars_chat.type,action: socialintents_vars_chat.action,pathToTabImage: socialintents_vars_chat.pathToTabImage,tabText:socialintents_vars_chat.tabText,tabOfflineText:socialintents_vars_chat.tabOfflineText,tabWidth:socialintents_vars_chat.tabWidth,topPos: socialintents_vars_chat.topPos,bottomPos: socialintents_vars_chat.bottomPos,headerTitle: socialintents_vars_chat.headerTitle,marginLeft: socialintents_vars_chat.marginLeft,marginRight: socialintents_vars_chat.marginRight,marginTop: socialintents_vars_chat.marginTop,marginTopc: socialintents_vars_chat.marginTopc,widgetId: socialintents_vars_chat.widgetId,popupHeight: socialintents_vars_chat.popupHeight,popupWidth: socialintents_vars_chat.popupWidth,backgroundImg: socialintents_vars_chat.backgroundImg,tabColor:socialintents_vars_chat.tabColor,perPage:socialintents_vars_chat.perPage,preview:socialintents_vars_chat.preview,urlPattern:socialintents_vars_chat.urlPattern,roundedCorners:socialintents_vars_chat.roundedCorners,tabType:socialintents_vars_chat.tabType,f: socialintents_vars_chat.f
    };
}
jQuery().tabSlideOut(settings_chat);
var si_api = si_api || (function () {
    var instance = null;
    function _ins() {
        this.showPopup=function(mSettings) {
            if (mSettings) jQuery().showPopup(mSettings);
            else jQuery().showPopup(settings_chat);
        }
        this.showTab=function(mSettings) {
            if (mSettings) jQuery().showTab(mSettings);
            else jQuery().showTab(settings_chat);
        }
        this.hideTab=function(mSettings) {
            if (mSettings) jQuery().hideTab(mSettings);
            else jQuery().hideTab(settings_chat);
        }
        this.hidePopup=function(mSettings) {
            if (mSettings) jQuery().hidePopup(mSettings);
            else jQuery().hidePopup(settings_chat);
        }
        this.showInvite=function(message) {
            jQuery().showInvite(message);
        }
        this.setChatInfo=function(name, email, phone, group, question) {
            jQuery().setChatInfo(name, email, phone, group, question);
        }
        this.addParams=function(params) {
            jQuery().addParams(params);
        }
        this.getChatStatus=function() {
            var status= jQuery().getChatStatus();
            return status;
        }
        this.endChat=function() {
            var status= jQuery().endChat();
            return status;
        }
        this.closeChatWindow=function() {
            var status= jQuery().closeChatWindow();
            return status;
        }
    }
    return new function () {
        this.getInstance = function () {
            if (instance == null) {
            instance = new _ins();instance.constructor = null;
            }
            return instance;
        }
    }
})();
var SI_API = si_api.getInstance();
var siInit=false; 
if (typeof(onSIApiReady) === 'function' && !siInit) { 
    onSIApiReady();siInit=true;
}
else if (!siInit) {
    setTimeout(function() {
        if (typeof(onSIApiReady) === 'function' && !siInit) { 
            onSIApiReady();siInit=true;
        }
    }, 2000)
}