// ==UserScript==
// @name        xq139
// @namespace   xq139
// @description xq139
// @include     http://xq.139life.com/*
// @include     http://www.139life.com/header.php?url=xq139
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1
// ==/UserScript==
(function () {
    var hasOwn = Object.prototype.hasOwnProperty;
    var toString = Object.prototype.toString;
    var href = window.location.href;
	var parser = new DOMParser();
	function _toString (obj) {
		return Object.prototype.toString.call(obj);
	}
	var UTIL = {
		type: function(obj) {
            return toString.call(obj).slice(8, -1);
        },
		setCookie: function (sName, sValue, sDomain, sPath, oExpires, bSecure) {
			var sCookie = sName + "=" + encodeURIComponent(sValue);
			if (oExpires) {
				if (typeof(oExpires) == "string") {
					var de = new Date();
					de.setTime(new Date().getTime() + parseInt(oExpires));
					oExpires = de.toGMTString();
				} else {
					oExpires = oExpires.toGMTString();
				}
				sCookie += "; expires=" + oExpires;
			}
			if (sPath) {sCookie += "; path=" + sPath;}
			if (sDomain) {sCookie += "; domain=" + sDomain;}
			if (bSecure) {sCookie += "; secure";}
			document.cookie = sCookie;
		},
		removeCookieAll: function () {
			document.cookie.split('; ').forEach(function (str) {
				UTIL.removeCookie(str.split('=')[0]);
			})
		},
		removeCookie: function (sName, sPath, sDomain, bSecure) {
			this.setCookie(sName, "", new Date(0), sPath, sDomain, bSecure);
		},
		getCookie: function (sName) {
			var sRE = "(?:; )?" + sName + "=([^;]*);?";
			var oRE = new RegExp(sRE);			
			var match = document["cookie"].match(oRE);
			if (match) {
				return match[1] || '';
			} else {
				return null;
			}
		},
		extend: function () {
			var deep = false, 
			target = arguments[0] || {}, 
			i = 1,
			len = arguments.length,
			name, obj, copy, src, clone;
			if (typeof target === "boolean") {
				deep = arguments[0];
				target = arguments[1] || {};
				i = 2;
			}			
			for ( ; i < len; i++ ) {
				obj = arguments[ i ];
				for (name in obj) {
					if (hasOwn.call(obj, name) == true) { 
						copy = obj[ name ];
						src = target[ name ];
						if (typeof copy == 'undefined') {
							continue;
						}
						if (deep == false) {
							target[ name ] = copy;
						} else {
							if (_toString(copy) == "[object Object]" ) {
								clone =  src && _toString(src) == "[object Object]" ? src : {}
								target[ name ] = _extend(true, clone, copy);
							} else if (_toString(copy) ==  "[object Array]") {
								clone =  src && _toString(src) == "[object Array]" ? src : []
								target[ name ] = _extend(true, clone, copy);
							} else {
								target[ name ] = copy;
							}
						}
					}
				}
			}
			return target;
		},
		hrefIndexOf: function (str) {
			return href.indexOf(str) > -1;
		},
		makeAry: function (list) {
			return [].slice.call(list ,0);
		},
		load: function (url) {
			setTimeout(function () {
				window.location.href = url;
			}, config.loadTime);
		},
		url2Obj: function (url) {
			var match = url.match(/[^\?+]+\?(.*?)(#.*)?$/);
			var obj = {};
			if (!!match) {
				match[1].split('&').forEach(function (str) {
					var tmp = str.split('=');
					if (tmp.length > 0) {
						obj[tmp.shift()] = tmp.join('');
					}
				});
			}
			return obj;
		},
		type2HTML: function (key, value, opt) {
			var html = [];
			var name = '<span style="width:250px;float:left;text-align:right;">'+(opt.name||key)+':</span>';
			var vals = opt.vals||[];
			var type = opt.type||'input';
			if (type == "input") {
				return name+'<input type="text" name="'+key+'" value="'+(UTIL.type(value)=='Array'?value.join(','):value)+'"/>';
			} else if (type == "radio" || type == "checkbox") {
				//console.log(vals);
				vals.forEach(function (val, i) {
					//console.log(val, i);
					if (type == "radio") {
						html.push('<input type="'+type+'" value="'+i+'" name="'+key+'" '+(value==i?'checked':'')+'/>'+val);
					} else {
						html.push('<input type="'+type+'" value="'+i+'" name="'+key+'" '+(value.indexOf(i)!=-1?'checked':'')+'/>'+val);
					}
					
				});
				return name+html.join('');
			} else if (type == 'textarea' ) {
				var val = [];
				value.forEach(function (v) {
					val.push(v.join(','));
				})
				return name+'<textarea id="'+key+'" name="'+key+'" style="width: 300px; height: 200px;">'+val.join('\n')+'</textarea>'
			}
		},
		obj2Html: function (obj, opt) {
			opt || (opt ={});
			var html = [];
			for (var i in obj) {
				if (hasOwn.call(obj, i)) {
					html.push('<div>'+UTIL.type2HTML(i, obj[i], opt[i]||{})+'</div>');
				}
			}
			return html.join('');
		},
		iframeLoad : function(url, callback) {
			var frame = document.createElement("iframe");
			if(!!url) {
				frame.src = url;
			}
			frame.style.cssText = "position:absolute;left:-100000px;width:1px;height:1px;";
			if(!!callback) {
				frame.addEventListener('load', callback, false);
			}
			document.body.appendChild(frame);
			return frame;
		},
		meaasge: (function () {
			var mess;
			return function () {
				if (!!mess) return mess;
				mess = {
					send :  function(data) {
						this.proxy.postMessage(data, '*');
					},
					get : function(data) {
						return data;
					}
				}
				window.addEventListener("message", function(e) {
					mess.get(e.data);
				}, false);
				return mess;
			}
		})()
	};
	
	(function () {
		function addRandom (url) {
			let ary = url.split('?'), tmp = '_wgu=' + new Date().valueOf() + '&';
			ary[1] = tmp + (ary[1] || '');
			return ary.join('?');
		}
		
		var DEFAULT_OPTIONS = {
			state: 'init',
			listener: {},
			method: 'GET',
			cache: true,
			headers: {},
			body: '',
			timeout: 10000
		}
		
		function Ajax (opts) {
			if (!(this instanceof Ajax)) {
				return new Ajax(opts);
			} else {
				this.xhr = this._getXHR();
				this.timerId = 0;
				this.set(opts);
				let types = ["load","error","progress"];
				let ajax = this; 
				for (let i = 0; i < 3; i++) {
					let type = types[i];
					this.xhr.addEventListener(type, function () {
						//console.log(type);
						if (type == "load" || type == "error") {
							//console.log('clearTimeout',ajax.timerId);
							clearTimeout(ajax.timerId);
						}
						if (!!ajax.listener[type]) {
							ajax.listener[type].call(ajax);
						}
					}, true);
				}
			}
		}
		
		Ajax.prototype={
			_getBody: function (params) {
				//console.log(_toString(params));
				if (_toString(params) == "[object String]") {
					return params;
				} else if (_toString(params) == "[object Object]") {
					let re = [];
					for (var i in params) {
						re.push(i + '=' + params[i]);
					}
					return re.join('&');
				} else { //[]
					let re = [];
					for (let i = 0, len = params.length; i < len; i++) {
						if (_toString(params) == "[object Object]") {
							re.push(arguments.callee(params[i]));
						} else {
							re.push(params[i]);
						}
					}
					return re.join('&');
				}
			},
			_getXHR: function () {
				return new unsafeWindow.XMLHttpRequest();
			},
			set: function (opts) {
				UTIL.extend(this, DEFAULT_OPTIONS, opts);
				return this;
			},
			post: function (ajax) {
				ajax = ajax || this;
				let xhr = ajax.xhr;
				!!ajax.listener.create && ajax.listener.create.call(ajax);
				ajax.method = ajax.method.toUpperCase();
				if (ajax.method.split('_')[0] == 'GET') {
					xhr.open('GET', (!ajax.cache ? addRandom(ajax.url): ajax.url), true);
				} else {
					xhr.open(ajax.method.split('_')[0], ajax.url, true);
				}
				
				ajax.body = ajax._getBody(ajax.body);//进行简单的参数处理
				for (var i in ajax.headers) {
					xhr.setRequestHeader(i, ajax.headers[i]||' ');
				}
				
				ajax.state = 'post';
				if (ajax.method == "POST") {
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.send(ajax.body);
				} else if (ajax.method == "GET") {
					xhr.send('');
				} else {
					xhr.send(ajax.body);
				}
				
				if (!!ajax.timeout) {
					ajax.timerId = setTimeout(ajax.reload, ajax.timeout, ajax);		
				}
				return this;
			},
			reload: function (ajax) {
				//console.log('reload');
				ajax = ajax || this;
				ajax.state = 'reload';
				if (!!ajax.listener.reload) {
					if (ajax.listener.reload.call(ajax) == true) {
						return;
					}
				}
				if (ajax.xhr.readyState < 3) {
					ajax.xhr.abort();
					ajax.post();
				}
			}
		}
		UTIL.Ajax = Ajax;
	})();
	
	var config = JSON.parse(GM_getValue('XQ139_CONFIG')||'{}');
	config = UTIL.extend({
		mode: 0,
		loadTime: 1000,
		answerTime: 6000,
		answerText: ['OK','继续加油'],
		notanswers: [],
		wxanswers: [],
		userInfos:[],
		nowUserId:'',
		answerUserInfos: []
	},config);
	if (UTIL.hrefIndexOf('xq139config=xq139config')) {
		document.documentElement.innerHTML = UTIL.obj2Html(config, {
			loadTime:{name: '页面跳转时间(毫秒)'},
			answerTime:{name: '答题时间(毫秒)'},
			answerText:{name: '答题随机内容'},
			notanswers:{name: '无法回答ID'},
			mode:{name: '答题模式',type: 'radio',vals: ['正常补答','换号补答','无限答题','换号无限']},
			wxanswers:{name: '无限答题ID'},
			userInfos:{name: '帐号信息(电话,密码)',type:'textarea'},
			nowUserId:{name: '当前登录账户(不要自己修改)'},
			answerUserInfos:{name: '已答帐号信息(电话,密码)',type:'textarea'}
		});
		
		document.onchange = function (event) {
			var ele = event.target, key = ele.getAttribute('name');
			if (ele.nodeName == 'INPUT'&& ele.type=="text") {
				if (UTIL.type(config[key])=='Array') {
					config[key] = ele.value.split(/，|,/);
				} else {
					config[key] = ele.value;
				}
			} else if (ele.nodeName == 'INPUT'&&ele.type=="radio") {
				var val = [];
				UTIL.makeAry(document.getElementsByName(key)).forEach(function (ele){
					if (ele.checked == true) {
						config[key] = ele.value*1;
						return true;
					}
				})
			} else if (ele.nodeName == 'INPUT'&& ele.type=="checkbox") {
				var val = [];
				UTIL.makeAry(document.getElementsByName(key)).forEach(function (ele){
					if (ele.checked == true) {
						val.push(ele.value*1);
					}
				});
				config[key] = val;
			} else if (ele.nodeName == 'TEXTAREA') {
				var val = [];
				ele.value.split('\n').forEach(function (v) {
					val.push(v.split(/，|,/));
				});
				config[key] = val;
			}
			GM_setValue('XQ139_CONFIG',JSON.stringify(config));
		}
		return;
	};
	
	if (document.querySelector('h1')&&document.querySelector('h1').innerHTML.indexOf('事务操作失败')!=-1) {
		setTimeout(function () {
			window.location.href = "http://xq.139life.com/frontSurvey/list.jsp";
		}, 2000);
		return;
	}
	
	if (UTIL.hrefIndexOf('http://xq.139life.com/login.jsp?sId=')) {
		var _oldAjax = unsafeWindow.jQuery.ajax;
		unsafeWindow.jQuery.ajax = function (opt) {
			if (opt.url=="login_control.jsp" && opt.data.indexOf('method=sysUser&userName=')!=-1) {
				var oldSuccess = opt.success;
				opt.success= function (respData) {
					if (respData.replace(/\r/g, "").replace(/\n/g, "") == 1) {
						var obj = UTIL.url2Obj('.?'+opt.data);
						config.nowUserId = obj.userName;
						GM_setValue('XQ139_CONFIG',JSON.stringify(config));
					}
					oldSuccess.call(this, respData);
				}
			}
			_oldAjax.call(unsafeWindow.jQuery, opt);
		}
	}
	//http://www.139life.com/loginapi.php?a=logout&referer=
	if (UTIL.hrefIndexOf('www.139life.com/header.php?url=xq139')) {
		var mess = UTIL.meaasge();
		mess.proxy = window.parent;
		mess.get = function (str) {
			//console.log(str);
			var ary = str.split(',');
			if (ary[0]=='login') {
				var [username,password] = config.userInfos[ary[1]];
				UTIL.Ajax({
					timeout: 60*1000,
					step: 1,
					listener: {
						create: function () {
							if (this.step == 1) {
								this.method = 'GET';
								this.url =  'http://www.139life.com/loginapi.php?a=logout&referer=';
								this.body = '';
							} else if (this.step == 2) {
								//console.log(window.location.href);
								this.method = 'POST';
								this.url =  'http://www.139life.com/member.php?mod=logging&action=login&loginsubmit=yes';
								this.body = 'username='+username+'&password='+password;
							}
						},
						load: function () {
							var xhr = this.xhr;
							if (xhr.readyState==4) {
								if (this.step == 2) {
									var doc = parser.parseFromString(xhr.responseText, "text/html");
									UTIL.makeAry(doc.querySelectorAll('script')).forEach(function (script) {
										if (script.src.match(/^http:\/\/xq.139life.com\/api\/uc/)) {
											mess.send('login,'+script.src);
											return true;
										}
									});
								}
								if (this.step < 2) {
									this.step ++;
									setTimeout(this.post, 100, this);
								}
							}
						},
						reload: function () {
							if (this.step == 2) {
								alert('论坛登录失败');
								return true;
							}
						}
					}
				}).post();
			}
		}
	}
	
	
	UTIL.login = function () {
		if (config.userInfos.length>0){
			UTIL.removeCookieAll();
			var mess = UTIL.meaasge();
			var farme = document.querySelector('#wgu_xqlogin');
			if (!farme) {
				farme = UTIL.iframeLoad('http://www.139life.com/header.php?url=xq139', function () {
					mess.proxy = farme.contentWindow;
					mess.send('login,0');
				});
				farme.id = 'wgu_xqlogin';
				mess.get = function (str) {
					var ary = str.split(',');
					if (ary[0]=='login') {
						UTIL.Ajax({
							timeout: 20*1000,
							url: ary[1],
							listener: {
								load: function () {
									var xhr = this.xhr;
									if (xhr.readyState==4) {
										config.nowUserId = config.userInfos[0][0];
										GM_setValue('XQ139_CONFIG',JSON.stringify(config));
										UTIL.load('http://xq.139life.com/frontSurvey/list.jsp?orderBy=5&trade_id=&type=1');
									}
								}
							}
						}).post();
					}
				}
			} else {
				mess.send('login,0');
			}
		} else {
			alert('无帐号信息');
		}
	}	
	
	if (!UTIL.hrefIndexOf('http://xq.139life.com/login.jsp')&&document.querySelector('a')&&document.querySelector('a').href.indexOf('/login.jsp')!=-1) {
		if (config.mode == 1 || config.mode == 3) {
			UTIL.login();
			return;
		} else {
			alert('请先登录');
			return;
		}
	}
	if (UTIL.hrefIndexOf('http://xq.139life.com/frontSurvey/list.jsp?orderBy=5&')){
		if (config.mode == 2|| config.mode == 3) {//无限答题
			if(config.wxanswers.length == 0) {
				alert('请增加无限答题题号');
				return;
			}
			UTIL.load('http://xq.139life.com/frontSurvey/answer.jsp?subjectId='+config.wxanswers[0]+'&sId='+UTIL.getCookie('JSESSIONID')+'&trade_id=');
			return; 
		}
		
		var hasAnswer = false;
		UTIL.makeAry(document.querySelectorAll('.cs_list li')).forEach(function (li) {
			var spans = li.querySelectorAll('.fontstyle01');
			if (spans[spans.length-1].textContent == '未参与') {
				var url = li.querySelector('a').href;
				var obj = UTIL.url2Obj(url);
				if (config.notanswers.indexOf(obj.subjectId)==-1) {
					UTIL.load(li.querySelector('a').href);
					hasAnswer = true;
				}
				return true
			}
		});
		if (hasAnswer == false) {//该号已答完,换号登录，reload
			//console.log(config);
			if (config.mode == 1) {//换号
				if (config.nowUserId == config.userInfos[0][0]) {
					config.answerUserInfos.push(config.userInfos.shift());
					GM_setValue('XQ139_CONFIG',JSON.stringify(config));
				}
				UTIL.login();
			}
		}
	} else if (UTIL.hrefIndexOf('http://xq.139life.com/frontSurvey/list.jsp')||UTIL.hrefIndexOf('http://xq.139life.com/index.jsp')) {
		UTIL.load('http://xq.139life.com/frontSurvey/list.jsp?orderBy=5&trade_id=&type=1');
	} else if (UTIL.hrefIndexOf('http://xq.139life.com/frontSurvey/answer.jsp?subjectId=')) {
		unsafeWindow.alert =  function () {};
		var url = document.querySelector('.zksdt').href;
		if (url.indexOf('javascript:tishi2(')!=-1 ) {
			if (url.indexOf('%E8%AF%A5%E8%B0%83%E6%9F%A5%E5%8F%AA%E8%83%BD%E5%8F%82%E4%B8')==-1) {//该调查只能参与一次
				var obj = UTIL.url2Obj(href);
				if (url.indexOf('%E8%B0%83%E6%9F%A5%E5%B7%B2%E6%88%AA%E6%AD%A2')!=-1&& (config.mode ==2||config.mode ==3)) {//已截止
					config.wxanswers.splice(config.wxanswers.indexOf(obj.subjectId),1);
				} else if (config.notanswers.indexOf(obj.subjectId) == -1) {
					config.notanswers.push(obj.subjectId);
				}
				GM_setValue('XQ139_CONFIG',JSON.stringify(config));
			}
			UTIL.load('http://xq.139life.com/frontSurvey/list.jsp?orderBy=5&trade_id=&type=1');
		} else {
			document.querySelector('.zksdt').click();
		}
	} else if (UTIL.hrefIndexOf('http://xq.139life.com/frontSurvey/standard_ed.jsp?subjectId=')) {
		function click (flag) {
			var inputs = [];
			
			var aryLinks;
			if (document.querySelector('#questionInfo .piclow')) {
				aryLinks = UTIL.makeAry(document.querySelectorAll('#questionInfo .piclow tr'));
			} else {
				aryLinks = UTIL.makeAry(document.querySelectorAll('#questionInfo .timua'));
			}
			aryLinks.filter(function (link) {
				var ipts = link.querySelectorAll('input');
				if (ipts.length == 1) {
					inputs.push(ipts[0]);
					return true;
				} else {
					return false;
				}
			});
			if (inputs.length == 0) {
				inputs = UTIL.makeAry(document.querySelectorAll('#questionInfo .zaa03d input'))
			}
			if (inputs.length > 0) {
				if (inputs[0].type == 'radio') {
					inputs[Math.random( )*inputs.length>>0].click();
				} else if (inputs[0].type == 'checkbox') {
					var limt = 2;
					if (!!document.getElementById("limitNum")) {
						limt = document.getElementById("limitNum").value*1||2;	
					}
					var ischeck = 0;
					inputs.forEach(function (input) {
						if (Math.random( )>0.6&&ischeck<limt) {
							input.parentNode.click();
							ischeck++;
						}
					});
					if (ischeck == 0) {
						inputs[Math.random( )*inputs.length>>0].parentNode.click();
						ischeck++;
					}
				} else if (inputs[0].type == 'text') {
					inputs.forEach(function (input) {
						input.value = 1;
					});
				}
			} else {//写内容
				var textarea = document.querySelector('#questionInfo textarea');
				if (!!textarea) {
					var txt = config.answerText;
					textarea.value = txt[Math.random( )*txt.length>>0];
				}
			}
			setTimeout(function () {
				var links = document.querySelectorAll('.zksdt');
				links[links.length-1].click();
			}, flag==true?1000:config.answerTime);
		}
		var _oldAjax = unsafeWindow.jQuery.ajax;
		unsafeWindow.jQuery.ajax = function (opt) {
			if (opt.url=="answer_control.jsp" && opt.data.indexOf('method=getQuestion&subjectId=')!=-1) {
				var oldSuccess = opt.success;
				opt.success= function (respData) {
					if (respData.replace(/\s+/g,'')=='') {
						_oldAjax.call(unsafeWindow.jQuery, opt);
					} else {
						try {
							oldSuccess.call(this, respData);
							click();
						}catch(e) {
							UTIL.load('http://xq.139life.com/frontSurvey/list.jsp?orderBy=5&trade_id=&type=1');
						}
					}
				};
				opt.error = function(){
					UTIL.load('http://xq.139life.com/frontSurvey/list.jsp?orderBy=5&trade_id=&type=1');
				}
			} else if (opt.url=="answer_control.jsp" && opt.data.indexOf('method=submitQuestion&subjectId=')!=-1) {
				var oldSuccess = opt.success;
				opt.success= function (respData) {
					if (respData.replace(/\s+/g,'')=='') {
						_oldAjax.call(unsafeWindow.jQuery, opt);
					} else {
						try {
							oldSuccess.call(this, respData);
						}catch(e) {}
						//click();
					}
				};
				opt.error = function(){
					UTIL.load('http://xq.139life.com/frontSurvey/list.jsp?orderBy=5&trade_id=&type=1');
				}
			}
			_oldAjax.call(unsafeWindow.jQuery, opt);
		}
	} else if (UTIL.hrefIndexOf('http://xq.139life.com/frontSurvey/regular_ed.jsp?subjectId=')) {
		var divs = UTIL.makeAry(document.querySelectorAll('form div')).filter(function (div) {
			return div.id.indexOf('question')==0;
		});
		divs.forEach(function (div) {
			var inputs = [];
			UTIL.makeAry(div.querySelectorAll('a')).forEach(function (link) {
				var ipts = link.querySelectorAll('input');
				if (ipts.length == 1) {
					inputs.push(ipts[0]);
					return true;
				} else {
					return false;
				}
			});
			if (inputs[0].type == 'radio') {
					inputs[Math.random( )*inputs.length>>0].click();
			} else if (inputs[0].type == 'checkbox') {
				var limt = 2;
				if (!!document.getElementById("limitNum")) {
					limt = document.getElementById("limitNum").value*1||2;	
				}
				var ischeck = 0;
				inputs.forEach(function (input) {
					if (Math.random( )>0.6&&ischeck<limt) {
						input.click();
						ischeck++;
					}
				});
				if (ischeck == 0) {
					inputs[Math.random( )*inputs.length>>0].click();
					ischeck++;
				}
			} else if (inputs[0].type == 'text') {
				inputs.forEach(function (input) {
					input.value = 1;
				});
			}
		})
		setTimeout(function () {
			var links = document.querySelectorAll('.zksdt');
			links[links.length-1].click();
		}, 4000*divs.length);
	} else if (UTIL.hrefIndexOf('http://xq.139life.com/frontSurvey/success.jsp')) {
		if (config.mode == 2 || config.mode == 3) {//无限答题
			if(config.wxanswers.length == 0) {
				alert('请增加无限答题题号');
			}
			var subjectId = unsafeWindow.getComment.toString().match(/subjectId=(\d+)/)[1];
			var index = config.wxanswers.indexOf(subjectId);
			var success = document.querySelector('.za03').textContent.indexOf('话费')!=-1;
			if (index == config.wxanswers.length -1&&config.mode == 3 && success) {//换号
				console.log('话费成功，换号');
				if (config.nowUserId == config.userInfos[0][0]) {
					config.answerUserInfos.push(config.userInfos.shift());
					GM_setValue('XQ139_CONFIG',JSON.stringify(config));
				}
				UTIL.login();
			} else if (success&&config.wxanswers.length==1&&config.mode == 2){
				alert('获得话费，自行换号');
			} else {
				UTIL.load('http://xq.139life.com/frontSurvey/answer.jsp?subjectId='+config.wxanswers[(++index)%config.wxanswers.length])+'&sId='+UTIL.getCookie('JSESSIONID')+'&trade_id=';
			}
		} else {
			window.location.href = 'http://xq.139life.com/frontSurvey/list.jsp?orderBy=5&trade_id=&type=1';
		}
	}
})();