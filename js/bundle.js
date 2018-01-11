/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const xpathhelpers = __webpack_require__(1);
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
    //specialxpath calc if the node is a parent
    getparentXpath: function(node) {
        if (node.hasAttribute("id")) {
            return '//' + node.tagName + '[@id="' + node.id + '"]';
        }
        if (node.hasAttribute("class")) {
            return '//' + node.tagName + '[@class="' + node.getAttribute("class") + '"]';
        }
        var index = $(node).prevAll().length;
        index += 1; //to offset indexing starting with 1 in dom instead of 0
        var old = '/' + node.tagName + '[' + index + ']';
        var new_path = this.getparentXpath(node.parentNode) + old;
        return new_path;
    },
    //get absXpath of any given node
    getabsXPath: function(node) {
        var arr = [];
        Array.from(node.attributes).forEach(attr => {
            if (attr.name != "style") {
                arr.push('//' + node.tagName + '[@' + attr.name + '="' + attr.value + '"]');
            }
        })
        //prev previousElementSibling
        var index = $(node).prevAll().length;
        var parentxpathval =this.getparentXpath(node.parentNode);
        if (index > 0) {
            var old = '/' + node.tagName + '[' + index + ']';
            var new_path = parentxpathval + old + '//following-sibling::' + node.tagName;;
            arr.push(new_path);
        } else {
            index += 1; //to offset indexing starting with 1 in dom instead of 0
            var old1 = '/' + node.tagName + '[' + index + ']';
            var new_path1 = parentxpathval + old1;
            arr.push(new_path1);
        }
        //followingElementSibling
        var index2 = $(node).nextAll().length;
        if (index2 > 0) {
            index2 = $(node).prevAll().length + 2;
            var old2 = '/' + node.tagName + '[' + index + ']';
            var new_path2 = parentxpathval + old2 + '//previous-sibling::' + node.tagName;;
            arr.push(new_path2);
        }
        return arr;
    },
    //get RelativeXpath
    getrelXPath: function(node) {
        if (node === document.body) {
            return '//html/body';
        }
        var index = $(node).prevAll().length;
        index += 1; //to offset indexing starting with 1 in dom instead of 0
        var old = '/' + node.tagName + '[' + index + ']';
        var new_path = this.getrelXPath(node.parentNode) + old;
        return new_path;
    },
    //CssSelector
    getcssSelector: function(el) {
        var names = [];
        while (el.parentNode) {
            if (el.id) {
                names.unshift('#' + el.id);
                break;
            } else {
                if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
                else {
                    for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
                    names.unshift(el.tagName + ":nth-child(" + c + ")");
                }
                el = el.parentNode;
            }
        }
        return names.join(" > ");
    },
    //color function
    colortheelement: function(targetelem, color) {
        $(targetelem).css({
            'border-color': color
        });
        $(targetelem).css({
            'border-style': 'solid'
        });
    },
    //pagename
    getpagename: function() {
        var sPath = window.location.pathname;
        var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
        return sPage;
    },
    //ObjectName
    getobjectName: function(node) {
        if (node.hasAttribute("name")) {
            return node.name;
        } else {
            return "";
        }
    },
    getElementvalue:function(node){
      return $(node).val();
    }
}


/***/ })
/******/ ]);