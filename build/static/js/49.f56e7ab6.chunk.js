(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{718:function(e,t,n){!function(e){"use strict";e.defineMode("elm",function(){function e(e,t,n){return t(n),n(e,t)}var t=/[a-z]/,n=/[A-Z]/,r=/[a-zA-Z0-9_]/,i=/[0-9]/,o=/[0-9A-Fa-f]/,u=/[-&*+.\\/<>=?^|:]/,a=/[(),[\]{}]/,f=/[ \v\f]/;function s(){return function(x,d){if(x.eatWhile(f))return null;var h=x.next();if(a.test(h))return"{"===h&&x.eat("-")?e(x,d,function e(t){return 0==t?s():function(n,r){for(;!n.eol();){var i=n.next();if("{"==i&&n.eat("-"))++t;else if("-"==i&&n.eat("}")&&0===--t)return r(s()),"comment"}return r(e(t)),"comment"}}(1)):"["===h&&x.match("glsl|")?e(x,d,m):"builtin";if("'"===h)return e(x,d,p);if('"'===h)return x.eat('"')?x.eat('"')?e(x,d,l):"string":e(x,d,c);if(n.test(h))return x.eatWhile(r),"variable-2";if(t.test(h)){var k=1===x.pos;return x.eatWhile(r),k?"def":"variable"}if(i.test(h)){if("0"===h){if(x.eat(/[xX]/))return x.eatWhile(o),"number"}else x.eatWhile(i);return x.eat(".")&&x.eatWhile(i),x.eat(/[eE]/)&&(x.eat(/[-+]/),x.eatWhile(i)),"number"}return u.test(h)?"-"===h&&x.eat("-")?(x.skipToEnd(),"comment"):(x.eatWhile(u),"keyword"):"_"===h?"keyword":"error"}}function l(e,t){for(;!e.eol();){var n=e.next();if('"'===n&&e.eat('"')&&e.eat('"'))return t(s()),"string"}return"string"}function c(e,t){for(;e.skipTo('\\"');)e.next(),e.next();return e.skipTo('"')?(e.next(),t(s()),"string"):(e.skipToEnd(),t(s()),"error")}function p(e,t){for(;e.skipTo("\\'");)e.next(),e.next();return e.skipTo("'")?(e.next(),t(s()),"string"):(e.skipToEnd(),t(s()),"error")}function m(e,t){for(;!e.eol();){var n=e.next();if("|"===n&&e.eat("]"))return t(s()),"string"}return"string"}var x={case:1,of:1,as:1,if:1,then:1,else:1,let:1,in:1,type:1,alias:1,module:1,where:1,import:1,exposing:1,port:1};return{startState:function(){return{f:s()}},copyState:function(e){return{f:e.f}},token:function(e,t){var n=t.f(e,function(e){t.f=e}),r=e.current();return x.hasOwnProperty(r)?"keyword":n}}}),e.defineMIME("text/x-elm","elm")}(n(36))}}]);