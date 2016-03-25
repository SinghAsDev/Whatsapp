// ==UserScript==
// @name         Whatsapp spammer
// @namespace    http://whatsapp.com/
// @version      0.1
// @description  teach whatsapp spammers a lesson!
// @author       Ashish Singh
// @match        https://web.whatsapp.com
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @connect      foxnews.com
// ==/UserScript==
'use strict';

// Your code here...
$(document).ready(function() {
    // Open foxnews and get tampermonkey script will start sending latest news here
    var myPopup = window.open('http://www.foxnews.com','myWindow');
    var loopInterval = 10000
    
    setInterval(function(){
        var message = 'LATEST_NEWS_REQ';
        console.log('Sending req for latest news.');
        myPopup.postMessage(message,'http://www.foxnews.com'); //send the message and target URI
    },loopInterval);
    
    var latest_news = Array();
    window.addEventListener('message',function(event) {
        if(event.origin !== 'http://www.foxnews.com') return;
        console.log('received response:  ',event.data);
        latest_news.push(event.data);
    },false);
    
    // Screw with whatsapp page
    function dispatch(target, eventType, char) {
        var evt = document.createEvent("TextEvent");    
        evt.initTextEvent (eventType, true, true, window, char, 0, "en-US");
        target.focus();
        target.dispatchEvent(evt);
    }
    function spam(){
        if (latest_news.length > 0) {
            var text_input = document.getElementsByClassName("input")[1]; // Grabs the input field
            var cur_news = latest_news.pop();
            dispatch(text_input, "textInput", cur_news['news'] + " .. " + cur_news['link']); // Msg to be texted 
            var input = document.getElementsByClassName("icon btn-icon icon-send"); //Grabs the send button
            input[0].click(); // Clicks the send button
        }
    }
    setInterval(function(){
        spam();
    },loopInterval);
})