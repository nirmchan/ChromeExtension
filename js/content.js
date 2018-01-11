const xpathhelpers = require('./Xpathhelpers.js');
console.log("I am console.js");

//Handled in Background JS instead: initialise only after recorder started from main page

function initialise() {
    //event linstener for clicks
    document.body.addEventListener('click', function(event) {
            console.log(event);
            if (event.target.tagName != "SELECT" && event.target.tagName != "OPTION") {
                xpathhelpers.colortheelement(event.target, 'red');
                      chrome.runtime.sendMessage({
                          from: 'content',
                          subject: 'capturedelement',
                          Url: window.top.location.href,
                          AbsoluteXpath: xpathhelpers.getabsXPath(event.target),
                          Action: event.type,
                          TagName: event.target.tagName,
                          pagename: xpathhelpers.getpagename(),
                          ObjectName: xpathhelpers.getobjectName(event.target),
                          RelativeXpath: xpathhelpers.getrelXPath(event.target),
                          CssSelector: xpathhelpers.getcssSelector(event.target),
                          ValueIfAny: '',
                          IsRequired: 'Y'
                      }, function(response) {
                          console.log("sent element to background.js & got Response");
                          //console.log(AbsoluteXpath,RelativeXpath);
                          if (response.success) {
                              xpathhelpers.colortheelement(event.target, 'green');
                          }
                      });
                  }
            }, false);

        //TODO: Add even listener for blur or keypress

        //TODO: Add event listener to make sure select boxes are captured accurately

        //TODO: Ability to stop or pause recording on page also should be allowed
    }

    $(document).ready(function() {
        console.log("ready!");
        initialise();
    });
