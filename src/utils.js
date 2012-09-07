// funcao para facilitar inclusao de metodos
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
    }
};

Number.method('integer', function (  ) {
    return Math[this < 0 ? 'ceiling' : 'floor'](this);
});

String.method('trim', function (  ) {
    return this.replace(/^\s+|\s+$/g, '');
});

// This is the deentityify method. It calls the string
// replace method, looking for substrings that start
// with '&' and end with ';'. If the characters in
// between are in the entity table, then replace the
// entity with the character from the table.
String.method('deentityify', function () {
    var entity = {
        quot: '"',
        lt:   '<',
        gt:   '>'
    };
    return function () {
        return this.replace(/&([^&;]+);/g,
        function (a, b) {
            var r = entity[b];
            return typeof r === 'string' ? r : a;
        }
    );
    };
}());

// Return the string.entityify method, which
// returns the result of calling the replace method.
// Its replaceValue function returns the result of
// looking a character up in an object. This use of
// an object usually outperforms switch statements.
String.method('entityify', function () {
    var character = {
        '<' : '&lt;',
        '>' : '&gt;',
        '&' : '&amp;',
        '"' : '&quot;'
    };
    return function () {
        return this.replace(/[<>&"]/g, function (c) {
            return character[c];
        });
    };
}());

//curry eh uma forma de chamar uma funcao com argumentos pre-definidos
Function.method('curry', function () {
    var slice = Array.prototype.slice,
    args = slice.apply(arguments),
    that = this;
    return function () {
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});




var isNumber = function (value) {
    return typeof value === 'number' && isFinite(value);
};

//diferencia objetos e arrays de null
var isObjectOrArray = function (value) {
    return value && typeof value === 'object';
};

var isArray = function (value) {
    // lembrar que arguments nao eh array e retorna false
    return Object.prototype.toString.apply(value) === '[object Array]';
};

var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
// exemplo de uso do parse_url
//var result = parse_url.exec("http://www.ora.com:80/goodparts?q&asdf=qer#!fragment");
//var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
//for (var i = 0; i < names.length; i += 1) {
//    console.log(names[i] + " : ", result[i]);
//}
var parse_number = /^-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?$/i;

var sortNumbersAndStrings = function (a, b) {
    if (a === b) {
        return 0;
    }
    if (typeof a === typeof b) {
        if (a < b) {
            return -1;
        } else {
            return 1;
        }
    }
    if (typeof a < typeof b) {
        return -1;
    } else {
        return 1;
    }
};
// exemplo:
//var m = ['aa', 'bb', 'a', 4, 8, 15, 16, 23, 42];
//m.sort(sortNumbersAndStrings);

// sortArrayOfObjectsBy takes a member name string and returns
// a comparison function that can be used to sort an
// array of objects that contain that member.
var sortArrayOfObjectsBy = function (name) {
    return function (o, p) {
        var a, b;
        if (typeof o === 'object' && typeof p === 'object' && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                if (a < b) {
                    return -1;
                } else {
                    return 1;
                }
            }
            if (typeof a < typeof b) {
                return -1;
            } else {
                return 1;
            }
        } else {
            throw {
                name: 'Error',
                message: 'Expected an object when sorting by ' + name
            };
        }
    };
};
// exemplo:
//var s = [
//    {first: 'Joe',   last: 'Besser'},
//    {first: 'Moe',   last: 'Howard'},
//    {first: 'Joe',   last: 'DeRita'},
//    {first: 'Shemp', last: 'Howard'},
//    {first: 'Larry', last: 'Fine'},
//    {first: 'Curly', last: 'Howard'}
//];
//s.sort(sortArrayOfObjectsBy('first'));

// sortArrayOfObjectsByTwoKeys takes a member name string and an
// optional minor comparison function and returns
// a comparison function that can be used to sort an
// array of objects that contain that member. The
// minor comparison function is used to break ties
// when the o[name] and p[name] are equal.
var sortArrayOfObjectsByTwoKeys = function (name, minor) {
    return function (o, p) {
        var a, b;
        if (o && p && typeof o === 'object' && typeof p === 'object') {
            a = o[name];
            b = p[name];
            if (a === b) {
                return typeof minor === 'function' ? minor(o, p) : 0;
            }
            if (typeof a === typeof b) {
                if (a < b) {
                    return -1;
                } else {
                    return 1;
                }
            }
            if (typeof a < typeof b) {
                return -1;
            } else {
                return 1;
            }
        } else {
            throw {
                name: 'Error',
                message: 'Expected an object when sorting by ' + name
            };
        }
    };
};
//exemplo:
//s.sort(sortArrayOfObjectsByTwoKeys('last', sortArrayOfObjectsByTwoKeys('first')));


// funcao para tentar carregar imagem,
// executar somente quando a imagem terminar de carregar
// e tratar erro se a imagem nao carregar
function carregarImg(imgsrc) {
    var img = new Image();

    img.onload = function () { //a imagem foi encontrada e terminou de carregar
        var $img = $(img);
        //parece ser necessario adicionar um attr() para a $img ser identificada no DOM
        $img.attr('class', 'foo').hide().appendTo('#bar');
        $img.show();
    };

    img.onerror = function () {
        //imgErro(); //chamar uma funcao para tratar erro
    };

    img.src = imgsrc; //neste momento acontece a requisicao da imagem
}


// http://www.adequatelygood.com/2011/4/Replacing-setTimeout-Globally
window.setTimeout = window.setTimeout;


// https://gist.github.com/315916
// everyone's new favorite closure pattern:
(function(window, document, undefined) {
    //...
})(this, document);


//http://www.dustindiaz.com/top-ten-javascript
Array.prototype.inArray = function (value) {
    var i;
	for (i=0; i < this.length; i++) {
		if (this[i] === value) {
			return true;
		}
	}
	return false;
};

//http://www.dustindiaz.com/rock-solid-addevent/
function addEvent( obj, type, fn ) {
    if (obj.addEventListener) {
		obj.addEventListener( type, fn, false );
		EventCache.add(obj, type, fn);
	}
	else if (obj.attachEvent) {
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
		obj.attachEvent( "on"+type, obj[type+fn] );
		EventCache.add(obj, type, fn);
	}
	else {
		obj["on"+type] = obj["e"+type+fn];
	}
}

var EventCache = function(){
	var listEvents = [];
	return {
		listEvents : listEvents,
		add : function(node, sEventName, fHandler){
			listEvents.push(arguments);
		},
		flush : function(){
			var i, item;
			for(i = listEvents.length - 1; i >= 0; i = i - 1){
				item = listEvents[i];
				if(item[0].removeEventListener){
					item[0].removeEventListener(item[1], item[2], item[3]);
				};
				if(item[1].substring(0, 2) != "on"){
					item[1] = "on" + item[1];
				};
				if(item[0].detachEvent){
					item[0].detachEvent(item[1], item[2]);
				};
				item[0][item[1]] = null;
			};
		}
	};
}();
addEvent(window,'unload',EventCache.flush);





//http://www.learncomputer.com/javascript-tricks-you-may-not-know/
function count() {
  if (typeof count.i == 'undefined') {
    count.i = 0;
  }
  return count.i++;
}
//prefiro usar isNumber
//http://jsfiddle.net/codexico/ePQ9D/
function count() {
    return isNumber(count.i) ? ++count.i : count.i = 0;
}
//only one function to count all the vars
function countvar(name) {
    return isNumber(countvar[name]) ? ++countvar[name] : countvar[name] = 0;
}