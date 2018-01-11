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
    }
}
