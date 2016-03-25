// ==UserScript==
// @name         Get latest news from Fox News
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get latest news and post to whatsapp tab.
// @author       Ashish Singh
// @match        http://www.foxnews.com/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

'use strict';

var ifNotExists = function(list, item) {
    for (i = 0; i < list.length; i++) {
        if (list[i]["news"] == item) {
            return false;
        }
    }
    return true;
}

$(document).ready(function() {
	var lis = document.getElementById('latest').getElementsByTagName('li')
	var news = Array()
	for(i = 0; i < lis.length; i++) {
        var cur_time = (new Date()).getTime()
		var item = lis[i].firstChild.firstChild.innerHTML;
        var link = lis[i].firstChild.getAttribute("href");
		if (typeof(item) != "undefined") {
            if (ifNotExists(news, item)) {
                news.push({'ts':cur_time, 'news':item, 'link': link});
            }
		} else {
            var item = lis[i].firstChild.innerHTML;
            if (ifNotExists(news, item)) {
                news.push({'ts':cur_time, 'news':item, 'link': link})
            }
		}
	}
    
    
    window.addEventListener('message',function(event) {
        if(event.origin !== 'https://web.whatsapp.com') return;
        var msg = event.data;
        console.log('Message received:  ' + msg, event);
        if (msg == 'LATEST_NEWS_REQ') {
            while (news.length > 0) {
                event.source.postMessage(news.pop(), event.origin);
            }
        }
    },false);
})