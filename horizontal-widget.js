var EcwidCategoryWidget = function () {

	if("document" in self){if(!("classList" in document.createElement("_"))){(function(j){"use strict";if(!("Element" in j)){return}var a="classList",f="prototype",m=j.Element[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.getAttribute("class")||""),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.setAttribute("class",this.toString())}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(){var s=arguments,r=0,p=s.length,q,o=false;do{q=s[r]+"";if(g(this,q)===-1){this.push(q);o=true}}while(++r<p);if(o){this._updateClassName()}};e.remove=function(){var t=arguments,s=0,p=t.length,r,o=false,q;do{r=t[s]+"";q=g(this,r);while(q!==-1){this.splice(q,1);o=true;q=g(this,r)}}while(++s<p);if(o){this._updateClassName()}};e.toggle=function(p,q){p+="";var o=this.contains(p),r=o?q!==true&&"remove":q!==false&&"add";if(r){this[r](p)}if(q===true||q===false){return q}else{return !o}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))}else{(function(){var b=document.createElement("_");b.classList.add("c1","c2");if(!b.classList.contains("c2")){var c=function(e){var d=DOMTokenList.prototype[e];DOMTokenList.prototype[e]=function(h){var g,f=arguments.length;for(g=0;g<f;g++){h=arguments[g];d.call(this,h)}}};c("add");c("remove")}b.classList.toggle("c3",false);if(b.classList.contains("c3")){var a=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(d,e){if(1 in arguments&&!this.contains(d)===!e){return e}else{return a.call(this,d)}}}b=null}())}};
	Element.prototype.findParent = function (classItem) {
		var element = this;
		while (element && element.classList && !element.classList.contains(classItem)) {
			element = element.parentNode;
			if (element === document) return false;
		}
		return element;
	};

	Element.prototype.removeElement = function () {
		if (this && this.parentNode) {
			this.parentNode.removeChild(this);
		}
	};

	Element.prototype.prependChild = function (element) {
		this.insertBefore(element, this.firstChild);
	};

	Element.prototype.changeClass = function (oldClass, newClass) {
		this.classList.remove(oldClass);
		this.classList.add(newClass);
	};

	Element.prototype.toggleClass = function (currentClass) {
		this.classList.toggle(currentClass)
	};

	Element.prototype.findChilds = function (element) {
		return Array.prototype.slice.call(this.querySelectorAll(element));
	};

	Element.prototype.innerWidth = function() {
		var styleName = ['border-left-width', 'border-right-width', 'padding-left', 'padding-right'],
			widthElement = 0,
			element = this;
		styleName.forEach(function (property) {
			widthElement += parseInt(getComputedStyle(element)[property]);
		});
		return this.getBoundingClientRect().width - widthElement;
	};

	Element.prototype.addMany = function(classes) {
		var element = this;
		classes = classes.split(' ');
		classes.forEach(function(elementClass) {
			element.classList.add(elementClass);
		});
	};

	Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function(selector) {
			var matches = (this.document || this.ownerDocument).querySelectorAll(selector),
				i = matches.length;
			while (--i >= 0 && matches.item(i) !== this) {}
			return i > -1;
		};

	Element.prototype.closest = function closest(selector) {
		var element = this;
		while (element) {
			if (element.matches(selector)) return element;
			else element = element.parentElement;
		}
		return null;
	};

	var clickEvent = ('ontouchstart' in window ? 'touchend' : 'click');

	var message = function(label, defaultValue) {
		var messageBundles = (window.Ecwid && window.Ecwid.MessageBundles) ? window.Ecwid.MessageBundles : {},
			bundle = messageBundles['ru.cdev.xnext.client'] ? messageBundles['ru.cdev.xnext.client'] : {},
			bundle2 = window.ecwidMessages ? window.ecwidMessages : {};
		for (var attrname in bundle2) {
			bundle[attrname] = bundle2[attrname];
		}
		return bundle[label] || defaultValue;
	};
	var image = function(img, defaultValue) {
		var images = window.widgetImage ? window.widgetImage : {};
		return images[img] || defaultValue;
	};
	var catId,
		getData = {},
		containerWidth,
		menuOverlay,
		data,
		state,
		mobileWidth = 480,
		minWidth = 320,
		activeCatId,
		saved = {},
		dragging = false;

	var text = {
		back : message('StarterSite.back', 'Back'),
		menu : message('StarterSite.menu', 'Menu'),
		more : message('StarterSite.more', '{1} more')
	};

	var svg = {
		arrowBack : image('arrowBack', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 451.847 451.847" style="enable-background:new 0 0 451.847 451.847;" xml:space="preserve"><path d="M97.141,225.92c0-8.095,3.091-16.192,9.259-22.366L300.689,9.27c12.359-12.359,32.397-12.359,44.751,0 c12.354,12.354,12.354,32.388,0,44.748L173.525,225.92l171.903,171.909c12.354,12.354,12.354,32.391,0,44.744 c-12.354,12.365-32.386,12.365-44.745,0l-194.29-194.281C100.226,242.115,97.141,234.018,97.141,225.92z"/></svg>'),
		arrowRight : image('arrowRight', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="horizontal-arrow-right" x="0px" y="0px" viewBox="0 0 451.846 451.847" style="enable-background:new 0 0 451.846 451.847;" xml:space="preserve"> <path d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744 L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284 c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z"/></svg>'),
		arrowBottom : image('arrowBottom', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="horizontal-arrow-bottom" x="0px" y="0px" viewBox="0 0 451.847 451.847" style="enable-background:new 0 0 451.847 451.847;" xml:space="preserve"> <path d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751 c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0 c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z"/> </svg>'),
		menu : image('menu', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 250.579 250.579" style="enable-background:new 0 0 250.579 250.579;" xml:space="preserve"> <path style="fill-rule:evenodd;clip-rule:evenodd;" d="M22.373,76.068h205.832c12.356,0,22.374-10.017,22.374-22.373 c0-12.356-10.017-22.373-22.374-22.373H22.373C10.017,31.323,0,41.339,0,53.696C0,66.052,10.017,76.068,22.373,76.068z M228.205,102.916H22.373C10.017,102.916,0,112.933,0,125.289c0,12.357,10.017,22.373,22.373,22.373h205.832 c12.356,0,22.374-10.016,22.374-22.373C250.579,112.933,240.561,102.916,228.205,102.916z M228.205,174.51H22.373 C10.017,174.51,0,184.526,0,196.883c0,12.356,10.017,22.373,22.373,22.373h205.832c12.356,0,22.374-10.017,22.374-22.373 C250.579,184.526,240.561,174.51,228.205,174.51z"/> </svg>')
	};

	var buildCategory = function (items, sub, subList) {
		var list = '';
		var storeUrl;

		if(storeUrl = container.getAttribute('data-storeUrl')) {
			if(container.getAttribute('data-storeUrl') == 'default' && window.Ecwid && window.Ecwid.getStoreConfiguration()) {
				storeUrl = window.Ecwid.getStoreConfiguration().url ? window.Ecwid.getStoreConfiguration().url : '';
				storeUrl = (storeUrl == 'http://') ? '' : storeUrl;
			}
		} else {
			storeUrl = '';
		}
		if (document.querySelector('base') && (storeUrl == '')) {
			var loc = window.location;
			storeUrl = loc.href.replace(loc.hash, '');
		}
		var itemClass = sub ? 'horizontal-menu-subParent' : 'horizontal-menu-parent';
		list += '<ul class="' + itemClass + '">';
		list += subList ? subList : '';
		var isCleanUrls = !!(window.ec && window.ec.config && window.ec.config.storefrontUrls && window.ec.config.storefrontUrls.cleanUrls && !isCustomWidgetClickHandler());
		var baseUrl = (window.ec.config.baseUrl) ? window.ec.config.baseUrl + '/' : '';
		var isQueryBasedCleanUrls = !!(window.ec && window.ec.config && window.ec.config.storefrontUrls && window.ec.config.storefrontUrls.queryBasedCleanUrls);
		var prefixUrl = (isQueryBasedCleanUrls) ? baseUrl + '?store-page=' : baseUrl;

		items.forEach(function (item) {
			if (item.name) {
				let nameForUrl = (item.nameForUrl) ? item.nameForUrl : item.name
				var link = (isCleanUrls) ? prefixUrl + nameForUrl.replace(/ /g, '-') + '-c' + item.id : storeUrl + item.link;
				var arrow = item.sub && !(container.getAttribute('data-children-no') != null) ? svg.arrowBottom + svg.arrowRight : '';
				var itemParentClass = item.sub && !(container.getAttribute('data-children-no') != null) ? ' horizontal-menu-item--parent' : '';
				var itemLevelClass = (item.dataLevel == 1) ? ' horizontal-menu-item--levelTop' : ' horizontal-menu-item--levelChild';
				list += '<li id="horizontal-category-' + item.id + '" class="horizontal-menu-item' + itemParentClass + itemLevelClass + '"><a href="' + link + '" title="' + item.name + '"' + '" data-catid="' + item.id + '">' + '<span>' + item.name + '</span>' + arrow + '</a>';
				if (item.sub && !(container.getAttribute('data-children-no') != null)) {
					subList = '<li class="horizontal-menu-item horizontal-menu-item--back"><a>'+ svg.arrowBack + text.back + '</a></li>';
					subList += '<li class="horizontal-menu-item horizontal-menu-item--title"><a href="' + link + '" + title="' + item.name + '"' + '" data-catid="' + item.id + '">' + '<span>' + item.name  + '</span>' + '</a></li>';
					list += buildCategory(item.sub, 1, subList);
				}
				list += '</li>';
			}
		});
		list += '</ul>';

		return list;
	};

	var animationMenu = function(nav, item, func, direction) {
		var items = nav.findChilds(item),
			mainList = nav.querySelector('.horizontal-menu-parent'),
			cloneElement;
		var animationEvent = function() {
			var element = document.createElement('animation'),
				animationEvent = 'webkitAnimationEnd';
			if(getComputedStyle(element)['animation'] !== undefined) {
				animationEvent = 'animationend';
			}
			return animationEvent;
		};

		var animate = function(e) {
			if (!dragging) {
				e.preventDefault();
				e.stopPropagation();
				nav.toggleClass('horizontal-menu--animate');
				var target = e.target;
				cloneElement = func(target);
				nav.appendChild(cloneElement);

				mainList.toggleClass('horizontal-animate--' + direction);
			}
		};
		items.forEach(function (el) {
			el.addEventListener(clickEvent, animate, false);
		});
		mainList.addEventListener(animationEvent(),function() {
			if (cloneElement) {
				cloneElement.removeElement();
			}
			mainList.classList.remove('horizontal-animate--' + direction);
			nav.classList.remove('horizontal-menu--animate');
		},false);
	};

	var backLink = function(nav) {
		animationMenu(nav, '.horizontal-menu-item--back > a', function (target) {
			var cloneElement;

			if (target.findParent('horizontal-subview') != nav) {
				target.findParent('horizontal-subviewopen').toggleClass('horizontal-subviewopen');
				target.findParent('horizontal-subview').changeClass('horizontal-subview', 'horizontal-subviewopen');
				cloneElement = target.findParent('horizontal-menu-subParent').cloneNode(true);
			} else {
				target.findParent('horizontal-subview').toggleClass('horizontal-subview');
				cloneElement = target.findParent('horizontal-menu-parent').cloneNode(true);
			}

			cloneElement.toggleClass('horizontal-animate--back');

			return cloneElement;
		}, 'back');
	};

	var forwardLink = function(nav) {
		animationMenu(nav, '.horizontal-menu-item--parent > a', function (target) {
			var cloneElement,
				lastChild;

			cloneElement = nav.querySelector('.horizontal-menu-parent').cloneNode(true);
			cloneElement.addMany('horizontal-animate--forward horizontal-menu-subParent');

			lastChild = nav.querySelector('.horizontal-subviewopen');
			if(lastChild) {
				lastChild.changeClass('horizontal-subviewopen','horizontal-subview');
			}

			target.findParent('horizontal-menu-item').toggleClass('horizontal-subviewopen');
			nav.querySelector('.horizontal-menu-parent').classList.add('horizontal-subview');

			return cloneElement;
		}, 'forward');
	};

	var insertMenuButton = function(container, nav) {
		var menuButton = container.querySelector('.horizontal-menu-button');
		var nav = document.querySelector('.horizontal-menu--mobile');
		if (!menuButton) {
			menuButton = document.createElement('div');
			menuButton.classList.add('horizontal-menu-button');
			menuButton.innerHTML = svg.menu + '<span class="horizontal-menu-button-text">'+ text.menu +'</span>';
			container.prependChild(menuButton);
			menuButton.addEventListener(clickEvent, function() {
				menuOverlay.toggleClass('horizontal-overlay--show');
				menuOverlay.addEventListener('touchend', function(e){
					e.preventDefault();
					dragging = false;
					hideMenu();
				}, false);
				menuOverlay.addEventListener('touchmove', function(e){
					e.preventDefault();
				}, false);
				nav.toggleClass('horizontal-menu--mobileShow');
				stopBodyScrolling(true);
			}, false);
		}

		var hideMenu = function() {
			if (state == 'mobile' && !dragging) {
				menuOverlay.classList.remove('horizontal-overlay--show');
				nav.classList.remove('horizontal-menu--mobileShow');
				stopBodyScrolling(false);
			}
		};
		nav.addEventListener(clickEvent, hideMenu, false);
		menuOverlay.addEventListener(clickEvent, hideMenu, false);
	};

	var insertOverlay = function() {
		if (!menuOverlay) {
			menuOverlay = document.createElement('div');
			menuOverlay.classList.add('horizontal-overlay');
			document.body.appendChild(menuOverlay);
		}
	};

	var hoverItem = function(container, nav) {
		var items = container.findChilds('.horizontal-menu-item');
		var changeClass = function(e) {
			var target = e.target;
			target.toggleClass('horizontal-menu-item--hover');
		};
		var hideMenu = function() {
			nav.findChilds('.horizontal-menu-item').forEach(function(el) {
				el.classList.remove('horizontal-menu-item--hover');
				el.classList.remove('horizontal-menu-item--tap');
			});
			nav.findChilds('.horizontal-menu-subParent').forEach(function(el) {
				el.classList.remove('horizontal-menu-subParent--right');
				el.classList.remove('horizontal-menu-subParent--left');
			});
		};
		var link = function(e) {
			var target = e.target;
			e.stopPropagation();
			var parent = target.findParent('horizontal-menu-item');
			if(!parent.classList.contains('horizontal-menu-item--tap') && parent.classList.contains('horizontal-menu-item--parent')) {
				e.preventDefault();
				if(parent.parentNode.classList.contains('horizontal-menu-parent')) {
					hideMenu();
				}
				parent.parentNode.findChilds('.horizontal-menu-item').forEach(function(el) {
					el.classList.remove('horizontal-menu-item--hover');
					el.classList.remove('horizontal-menu-item--tap');
				});
				target.findParent('horizontal-menu-item').toggleClass('horizontal-menu-item--hover');
				target.findParent('horizontal-menu-item').classList.add('horizontal-menu-item--tap');
				return;
			}
			if (!dragging) {
				target.findParent('horizontal-menu-item').classList.remove('horizontal-menu-item--tap');
				setTimeout(hideMenu, 500);
			}
		};
		var hide = function() {
			var start = window.pageYOffset;
			dragging = false;
			var scroll = function() {
				var end = window.pageYOffset;
				if(start == end) {
					hideMenu();
				}
				document.body.removeEventListener('touchend', scroll, false);
			};
			document.body.addEventListener('touchend', scroll, false);
		};
		items.forEach(function(el) {
			if (clickEvent == 'click') {
				el.addEventListener('mouseenter', changeClass, false);
				el.addEventListener('mouseleave', changeClass, false);
			}
			if (clickEvent == 'touchend') {
				document.body.addEventListener('touchstart', hide, false);
				el.addEventListener('touchend', link, false);
				el.addEventListener('touchmove', function(){
					dragging = true;
				}, false);
			}
		});
	};

	var childPosition = function(container, nav) {
		var items = container.findChilds('.horizontal-menu-item--parent');

		var setPosition = function(item) {
			var target = item,
				sibling = target.nextSibling,
				position = target.getBoundingClientRect(),
				positionSibling = sibling.getBoundingClientRect(),
				menuPosition = nav.getBoundingClientRect();

			if (position.right + positionSibling.width > menuPosition.right) {
				sibling.classList.add('horizontal-menu-subParent--left');
				sibling.style.maxWidth = sibling.getBoundingClientRect().right - nav.getBoundingClientRect().left + 'px';
			} else {
				sibling.classList.add('horizontal-menu-subParent--right');
				sibling.style.maxWidth = nav.getBoundingClientRect().right - sibling.getBoundingClientRect().left + 'px';
			}

		};
		var clickFunc = function(e) {
			var target = e.target.querySelector('a');
			setPosition(target);
			dragging = false;
		};
		var touchFunc = function(e) {
			var target = e.target.findParent('horizontal-menu-item').querySelector('a');
			setPosition(target);
		};

		items.forEach(function(el) {
			if (clickEvent == 'click') {
				el.addEventListener('mouseenter', clickFunc, false);
				el.addEventListener('mouseleave', clickFunc, false);
			}
			if (clickEvent == 'touchend') {
				el.addEventListener('touchend', touchFunc, false);
			}
		});

	};

	var mobileRender = function(container, nav) {
		if (!document.querySelector('.horizontal-menu--mobile'))
			document.body.appendChild(nav);
		container.changeClass('horizontal-desktop','horizontal-mobile');
		nav.changeClass('horizontal-menu--desktop','horizontal-menu--mobile');
		nav.addEventListener('touchmove', function(e){
			dragging = true;
			e.stopPropagation();
		}, false);
		nav.addEventListener('touchstart', function(e){
			dragging = false;
			e.stopPropagation();
		}, false);
		forwardLink(nav);
		backLink(nav);
	};

	var stopBodyScrolling = function(bool){
		if (bool) {
			saved['body.overflow'] = document.body.style.overflow;
			saved['html.overflow'] = document.documentElement.style.overflow;
			document.body.style.overflow = 'hidden';
			document.documentElement.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = saved['body.overflow'];
			document.documentElement.style.overflow = saved['html.overflow']
		}
	};

	var hideItemDropDownContainer = document.createElement('ul');
	hideItemDropDownContainer.addMany('horizontal-menu-parent horizontal-menu-parent--dropDown');

	var desktopRender = function(container, nav) {
		menuOverlay.classList.remove('horizontal-overlay--show');
		var mobileNav = document.querySelector('.horizontal-menu--mobile');
		if (mobileNav) {
			document.body.removeChild(mobileNav);
		}
		var menuButton = container.querySelector('.horizontal-menu-button');
		if (menuButton) {
			container.removeChild(menuButton);
		}

		container.appendChild(nav);
		container.changeClass('horizontal-mobile','horizontal-desktop');
		nav.changeClass('horizontal-menu--mobile','horizontal-menu--desktop');

		var items,
			listInnerWidth = nav.innerWidth(),
			hideItemDropDownCount,
			listItemsWidth = 0,
			hideItemDropDown,
			hideItemDropDownTitle,
			hideItemDropDownContent,
			needDropDown = false;

		hideItemDropDown = document.createElement('li');
		hideItemDropDown.addMany('horizontal-menu-item horizontal-menu-item--parent horizontal-menu-item--levelTop');
		hideItemDropDownTitle = document.createElement('a');
		hideItemDropDownContent = document.createElement('ul');
		hideItemDropDownContent.classList.add('horizontal-menu-subParent');

		hideItemDropDown.appendChild(hideItemDropDownTitle);
		hideItemDropDown.appendChild(hideItemDropDownContent);
		hideItemDropDownContainer.appendChild(hideItemDropDown);

		var renderDropDown = function(nav) {
			listItemsWidth = 0;
			listInnerWidth = nav.innerWidth() - hideItemDropDownContainer.getBoundingClientRect().width;
			items.forEach(hideItems);
			nav.appendChild(hideItemDropDownContainer);
		};

		items = nav.findChilds('.horizontal-menu-item--levelTop');
		var hideItems = function(el) {
			listItemsWidth += el.getBoundingClientRect().width;
			if (listItemsWidth > listInnerWidth) {
				needDropDown = true;
				hideItemDropDownContent.appendChild(el);
				hideItemDropDownCount = hideItemDropDownContent.childElementCount;
				if(container.getAttribute('data-children-no') != null) {
					hideItemDropDownContent.style.display = 'none';
					hideItemDropDownTitle.href = '#!/c/0';
					hideItemDropDownTitle.innerHTML = text.more.replace('{1}',hideItemDropDownCount);
				} else {
					hideItemDropDownTitle.innerHTML = '<span>' + text.more.replace('{1}',hideItemDropDownCount) + '</span>' + svg.arrowBottom;
				}
			}
		};
		items.forEach(hideItems);

		if(needDropDown) {
			nav.appendChild(hideItemDropDownContainer);
			renderDropDown(nav);
		}
	};

	var menuRender = function() {
		var container = document.getElementById(catId);
		containerWidth = container.getBoundingClientRect().width;
		hideItemDropDownContainer.innerHTML = '';

		var nav = container.querySelector('.horizontal-menu');
		if (!nav) {
			nav = document.createElement('nav');
			nav.classList.add('horizontal-menu');
		}
		nav.innerHTML = buildCategory(data);
		state = ((containerWidth <= minWidth || window.innerWidth <= mobileWidth) && !(container.getAttribute('data-mobile-no') != null)) ? 'mobile' : 'desktop';
		switch (state) {
			case 'mobile':
				mobileRender(container, nav);
				insertMenuButton(container, nav);
				break;
			case 'desktop':
				desktopRender(container, nav);
				hoverItem(container, nav);
				childPosition(container, nav);
				break;
		}
		setActiveCategory();
		if (isCustomWidgetClickHandler()) {
			setCustomWidgetClickHandler(nav);
		}
		else {
			var links = document.querySelectorAll("[data-catid]");
			[].forEach.call(links, function(link) {
				if (link.parentNode.classList.contains('horizontal-menu-item')) {
					link.addEventListener('click', function(event) {
						event.preventDefault();
						Ecwid.openPage('category', {'id': link.dataset.catid});
					}, false);
				}
			});
		}
	};

	var setActiveCategory = function() {
		if (activeCatId !== null) {
			var prev = document.querySelector('.horizontal-menu-item--active');
			if (prev !== null) {
				prev.classList.remove('horizontal-menu-item--active');
			}
			var cur = document.getElementById('horizontal-category-' + activeCatId);
			if (cur !== null) {
				cur.classList.add('horizontal-menu-item--active');
			}
		}
	}

	var isCustomWidgetClickHandler = function() {
		return !!(window.ec && window.ec.config && window.ec.config.customWidgetClickHandler);
	}

	var changeExternalState = function(event) {
		event.preventDefault();
		if (dragging) {
			event.stopPropagation();
			return;
		}
		var anchor = event.target.closest('a');
		window.ec.config.customWidgetClickHandler(anchor.getAttribute('href'));
	};

	var setCustomWidgetClickHandler = function(nav) {
		nav.findChilds('.horizontal-menu-item').forEach(function(el) {
			el.addEventListener('click', changeExternalState, false);
			el.addEventListener('touchend', changeExternalState, false);
		});
	}

	var createMenu = function(menuData) {
		var container = document.getElementById(catId);
		container.classList.add('horizontal-menu-container');
		data = menuData;

		insertOverlay();
		menuRender();
		window.addEventListener('orientationchange', function(){ setTimeout(menuRender, 0); }, false);
	};

	var init = function() {
		var storeId,
			shopDomain,
			customerLanguage,
			defaultContainerId = 'horizontal-menu';

		var insertData = function() {
			var callbackName = 'f' + String(Math.random()).slice(2);

			var url = !shopDomain ? 'https://app.ecwid.com/categories.js' : shopDomain + '/categories.js';
			url += '?ownerid=' + storeId;
			if (!!customerLanguage) {
				url += '&lang=' + encodeURIComponent(customerLanguage);
			}
			url += '&callback=ecwidCategoryWidget.getData.' + callbackName;

			getData[callbackName] = function(data) {
				if (Object.keys(data).length) {
					createMenu(data, catId);
				}
				removeCallback();
			};

			var removeCallback = function () {
				delete getData[callbackName];
				return false;
			};

			var script = document.createElement('script');
			script.setAttribute('charset', 'utf-8');
			script.onerror = removeCallback;
			script.src = url;

			document.body.appendChild(script);
		};

		if (typeof(Ecwid) == 'object') {
			Ecwid.OnAPILoaded.add(function() {

				var widgets = window._xnext_initialization_scripts || [];

				if (widgets.length) {
					widgets.forEach(function(widget) {
						if ((typeof(widget.widgetType) !== 'undefined') && (widget.widgetType == 'CategoriesV2')) {
							catId = widget.id;
						}
					});
				}
				else {
					if (!catId && document.getElementById(defaultContainerId))
						catId = defaultContainerId;
				}

				if (!!window.Ecwid.customerLanguage) {
					customerLanguage = window.Ecwid.customerLanguage;
				}

				if (catId) {
					storeId = window.Ecwid.getOwnerId();
					if (container = document.getElementById(catId)) {
						storeId = container.getAttribute('data-storeId') || storeId;
						shopDomain = container.getAttribute('data-shopDomain') || shopDomain;
						insertData();
					}
				}
			});

			Ecwid.OnPageLoaded.add(function(page){
				if (page.categoryId !== null) {
					activeCatId = page.categoryId;
					setActiveCategory();
				}
			});
		}
	}

	init();
	this.getData = getData;
};

if (!ecwidCategoryWidget) {
	var ecwidCategoryWidget = new EcwidCategoryWidget();
}
