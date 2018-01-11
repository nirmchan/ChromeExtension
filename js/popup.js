console.log("i am popup js");
  var  stepsobj=[
      //{index:"1",TagName:"TagName", pagename:"PageName",ObjectName:"ObjectName", RelativeXpath:"RelativeXpath",AbsoluteXpath: "AbsoluteXpath",CssSelector: "CssSelector",Action:"Action",ValueIfAny:"ValueIfAny",IsRequired:"IsRequired?"}
  ];
var index=1;
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function updatetable(){
  //first clear all the tbody contents
   var tbody=getElementByXpath("//table[@id='dataTables-example']/tbody");
   tbody.remove();//removes existing view first
   tbody=document.createElement('tbody');
   getElementByXpath("//table[@id='dataTables-example']").appendChild(tbody);//append tbody again
   //write for each code
         stepsobj.forEach(function(step){
           var row=tbody.insertRow(index-1);
           var cell=row.insertCell(0);
           step.index=index;
           cell.innerHTML= step.index;
           cell=row.insertCell(1);
           cell.innerHTML=step.TagName;
           cell=row.insertCell(2);
           cell.innerHTML=step.pagename;
           cell=row.insertCell(3);
           cell.innerHTML=step.ObjectName;
           cell=row.insertCell(4);
           cell.innerHTML=step.RelativeXpath;
           cell=row.insertCell(5);
           cell.innerHTML=step.AbsoluteXpath;
           cell=row.insertCell(6);
           cell.innerHTML=step.CssSelector;
           cell=row.insertCell(7);
           cell.innerHTML=step.Action;
           cell=row.insertCell(8);
           cell.innerHTML=step.ValueIfAny;
           cell=row.insertCell(9);
           cell.innerHTML=step.IsRequired;
           index+=1;
   });
 }
 // function getdatafromcontent(){
 //    return new Promise(function(success){
 //      chrome.runtime.sendMessage({from: 'popup', subject: 'getdata'},function(response){
 //        return response;
 //      });
 //    });
 //
 // }

 var simpleApp = angular.module('simpleApp', ["ngSanitize", "ngCsv"]);

   simpleApp.controller('mainctrl', function($scope) {
   //  var olympicWinners = [];
     $scope.filename = "test";
     $scope.getHeader = function () {return ["#", "TagName", "PageName", "ObjectName", "RelativeXpath", "AbsoluteXpath", "CssSelector","Action","ValueIfAny","IsRequired?","Url"]};
     //$scope.stepsobj =stepsobj;
     // $scope.loaddata=getdatafromcontent().then(function(){
     //   $scope.stepsobj =response;
     // });
     $scope.loaddata=function(){
          index=1;
          chrome.runtime.sendMessage({from: 'popup', subject: 'getdata'}, function(response) {
                         $scope.stepsobj =response;
                         console.log(response);
                       });
         }

      // $scope.resetdata=function(){
      //    $scope.stepsobj.forEach(step1){
      //     var temp=step1.AbsoluteXpath[0];
      //     step1.AbsoluteXpath=[];
      //     step1.AbsoluteXpath=temp;
      //   }
      // }
     // $http.get("olympicWinners.json")
     //     .then(function(res){
     //         olympicWinners = res.data;
     //         // double the size several times (plunker complained till I trimmed down olympicWinners.json)
     //         olympicWinners = olympicWinners.concat(olympicWinners);
     //         olympicWinners = olympicWinners.concat(olympicWinners); // comment this line to get the export working
     //         olympicWinners = olympicWinners.concat(olympicWinners);
     //         $scope.getArray = olympicWinners;
     //     });
   });

// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('view').addEventListener('click',
//           function(){
//               //reiniitalise index
//               index=1;
//               chrome.runtime.sendMessage({from: 'popup', subject: 'getdata'}, function(response) {
//                   console.log("result:" + response);
//                   //update DOM
//                   stepsobj=response;
//                   console.log(stepsobj);
//                 //  updatetable();//update view
//                 });
//          },false);
// });
