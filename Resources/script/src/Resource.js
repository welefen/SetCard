;(function(){
    var dirImg = "image/";
    var dirAudio = "audio/";
    /**
     * 资源
     * @type {Object}
     */
    R = {
        img_bg: dirImg + "bg.jpg",
        img_card_bg: dirImg + "card_bg.png",
        img_card_select_bg:  dirImg + "card_select_bg.png",
        img_card_hover_bg: dirImg + "card_hover_bg.png",
        img_nav_bg: dirImg + "nav_bg.png",
        img_cover: dirImg + "cover.png",
        img_btn_item_bg: dirImg + "btn_item_bg.png",
        img_restart: dirImg + "restart.png",
        img_finish_bg: dirImg + "finish_bg.png",
        img_logo1: dirImg + "logo1.png",
        img_help: dirImg + "help.png",

        img_cards: dirImg + "cards.png",
        img_btn: dirImg + "btn.png",
        img_icon: dirImg + "icon.png",
        img_num: dirImg + "num.png",
        img_num1: dirImg + "num1.png",
        img_num2: dirImg + "num2.png",
        img_num3: dirImg + "num3.png",
        img_txt: dirImg + "txt.png",
        
        plist_cards: dirImg + "cards.plist",
        plist_num: dirImg + "num.plist",
        plist_num1: dirImg + "num1.plist",
        plist_num2: dirImg + "num2.plist",
        plist_num3: dirImg + "num3.plist",
        plist_icon: dirImg + "icon.plist",
        plist_btn: dirImg + "btn.plist",
        plist_txt: dirImg + "txt.plist",


        audio_btn: dirAudio + "btn_click.ogg",
        audio_sub_btn: dirAudio + "submenu_click.ogg",
        audio_bg: dirAudio + "bg_music.ogg",
        audio_play_bg: dirAudio + "play_bg.mp3",
        audio_unit_complete: dirAudio + "unit_complete.ogg",
        audio_wrong_numer: dirAudio + "wrong_number.ogg",
        audio_clap: dirAudio + "clap.ogg",
    }
    g_resources = [];
    var types = {
        "png": "image",
        "jpg": "image",
        "jpeg": "image",
        "gif": "image",
        "mp3": "sound",
        "ogg": "sound",
        "plist": "plist",
    }
    for(var name in R){
        var value = R[name];
        var type = '';
        value.replace(/\.(\w+)$/g, function(a, b){
            type = types[b]||b;
        })
        g_resources.push({
            type: type,
            src: value
        })
    }
})();