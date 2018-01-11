console.log("i am popup js");
var stepsobj = [];
var index = 1;
//TODO: Rewrite in Vue Js
//TODO: Style using Bulma js
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var simpleApp = angular.module('simpleApp', ["ngSanitize", "ngCsv"]);

simpleApp.controller('mainctrl', function($scope) {
    $scope.filename = "test";
    $scope.getHeader = function() {
        return ["#", "TagName", "PageName", "ObjectName", "RelativeXpath", "AbsoluteXpath", "CssSelector", "Action", "ValueIfAny", "IsRequired?", "Url"]
    };
    $scope.loaddata = function() {
        index = 1;
        chrome.runtime.sendMessage({
            from: 'popup',
            subject: 'getdata'
        }, function(response) {
            $scope.stepsobj = response;
            console.log(response);
        });
    }
});
//TODO: need to fix this section for button start and stop
// $(document).ready(function() {
//   //event handler for start and stop
//   $('img.start','img.pause').click(function(){
//       //TODOdone:send message to background to start
//       chrome.runtime.sendMessage({
//           from: 'popup',
//           subject: 'enable/disable'
//       }, function(response) {
//           console.log(response.statusofrecorder);
//       });
//
//       if (!$(this).hasClass('start')) {
//           $(this).attr('src', '/img/starticon.png');
//           $(this).addClass('start');
//
//       } else  {
//           $(this).attr('src', '/img/pauseicon.png');
//           $(this).removeClass('start');
//             $(this).addClass('pause');
//       }
//   });
