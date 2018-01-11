var values=[];
var indextracker=1;
console.log("I am background js");
$(document).ready(function(){
      //code for popping up the extension in new window
      chrome.browserAction.onClicked.addListener(function(tab){
                chrome.windows.create({
                    'url': 'index.html', 'type': 'normal'},function(window){  console.log('hi');
                });
          });

      chrome.runtime.onMessage.addListener(function (msg, sender, response) {
        // First, validate the message's structure
                if ((msg.from === 'popup') && (msg.subject === 'getdata')) {
                    console.log("i got message from popup");
                    console.log(values);
                    response(values);
                }
      });
          chrome.runtime.onMessage.addListener(function (msg, sender, response) {
              if ((msg.from === 'content') && (msg.subject === 'capturedelement')){
                    console.log(msg.absxpath,msg.Action);
                    values.push({index:indextracker,Url:msg.Url,TagName:msg.TagName,pagename:msg.pagename,ObjectName:msg.ObjectName,RelativeXpath:msg.RelativeXpath,
                                  AbsoluteXpath:msg.AbsoluteXpath,CssSelector:msg.CssSelector,Action:msg.Action,ValueIfAny:msg.ValueIfAny,
                                  IsRequired:msg.IsRequired});
                    indextracker+=1;
                     response({success:true});
              }
       });
});
<!--commetntss>
