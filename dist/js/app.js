var IZ = IZ || {}, UI = UI || {};
define(['config', 'jquery', 'izitoast', 'bootstrap', 'domready'], function(config, $, iziToast){
	var $wrapper = $('body');
	var dropdownAnims = function(){
		function dropdownEffectData(target) {
			var effectInDefault = null,
				effectOutDefault = null;
			var dropdown = $(target),
				dropdownMenu = $('.dropdown-menu', target);
			var parentUl = dropdown.parents('ul.nav');
			if (parentUl.size() > 0) {
				effectInDefault = parentUl.data('dropdown-in') || null;
				effectOutDefault = parentUl.data('dropdown-out') || null;
			}
			return {
				target: target,
				dropdown: dropdown,
				dropdownMenu: dropdownMenu,
				effectIn: dropdownMenu.data('dropdown-in') || effectInDefault,
				effectOut: dropdownMenu.data('dropdown-out') || effectOutDefault,
			};
		}
		function dropdownEffectStart(data, effectToStart) {
			if (effectToStart) {
				data.dropdown.addClass('dropdown-animating');
				data.dropdownMenu.addClass('animated');
				data.dropdownMenu.addClass(effectToStart);
			}
		}
		function dropdownEffectEnd(data, callbackFunc) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			data.dropdown.one(animationEnd, function() {
				data.dropdown.removeClass('dropdown-animating');
				data.dropdownMenu.removeClass('animated');
				data.dropdownMenu.removeClass(data.effectIn);
				data.dropdownMenu.removeClass(data.effectOut);
				if (typeof callbackFunc === 'function') {
					callbackFunc();
				}
			});
		}
		$('.dropdown, .dropup').on({
			'show.bs.dropdown': function() {
				var dropdown = dropdownEffectData(this);
				dropdownEffectStart(dropdown, dropdown.effectIn);
				console.log("dropdown.effectIn: ", dropdown.effectIn);
			},
			'shown.bs.dropdown': function() {
				var dropdown = dropdownEffectData(this);
				if (dropdown.effectIn && dropdown.effectOut) {
					dropdownEffectEnd(dropdown, function() {});
				}
			},
			'hide.bs.dropdown': function(e) {
				var dropdown = dropdownEffectData(this);
				if (dropdown.effectOut) {
					e.preventDefault();
					dropdownEffectStart(dropdown, dropdown.effectOut);
					dropdownEffectEnd(dropdown, function() {
						dropdown.dropdown.removeClass('open');
						dropdown.dropdown.removeClass('show');
					});
				}
			},
		});
	};
	var doodle = function(){
		// ■■ Counter Animation
		var counterAnim = $('.counter-anim');
		if( counterAnim.length > 0 ){
			counterAnim.counterUp({ delay: 10, time: 1000 });
		}
		// ■■ Tooltip
		if( $('[data-toggle="tooltip"]').length > 0 )
			$('[data-toggle="tooltip"]').tooltip();
		// ■■ Popover
		if( $('[data-toggle="popover"]').length > 0 )
			$('[data-toggle="popover"]').popover()
		// ■■ Sidebar Navigation
		$(document).on('click', '#toggle_nav_btn,#open_right_sidebar,#setting_panel_btn,.organizations_panel_btn,.profile_panel_btn', function (e) {
			$(".dropdown.open > .dropdown-toggle").dropdown("toggle"); // 3, show 4
			console.log("dropdown-toggle: ");
			return false;
		});
		$(document).on('click', '#toggle_nav_btn', function (e) {
			$wrapper.removeClass('open-right-sidebar open-setting-panel open-organizations-panel open-profile-panel').toggleClass('slide-nav-toggle');
			return false;
		});
		$(document).on('click', '#open_right_sidebar', function (e) {
			$wrapper.toggleClass('open-right-sidebar').removeClass('open-setting-panel open-organizations-panel open-profile-panel');
			return false;
		});
		$(document).on('click', 'body', function (e) {
			if($(e.target).closest('.fixed-sidebar-right,.setting-panel,.organizations-panel,.profile-panel').length > 0) {
				return;
			}
			$wrapper.removeClass('open-right-sidebar open-setting-panel open-organizations-panel open-profile-panel');
			return;
		});
		$(document).on('show.bs.dropdown', '.nav.navbar-right.top-nav .dropdown', function (e) {
			$wrapper.removeClass('open-right-sidebar open-setting-panel open-organizations-panel open-profile-panel');
			return;
		});
		$(document).on('click', '#setting_panel_btn', function (e) {
			$wrapper.toggleClass('open-setting-panel').removeClass('open-right-sidebar');
			return false;
		});
		$(document).on('click', '.organizations_panel_btn', function (e) {
			$wrapper.toggleClass('open-organizations-panel').removeClass('open-right-sidebar');
			return false;
		});
		$(document).on('click', '.profile_panel_btn', function (e) {
			$wrapper.toggleClass('open-profile-panel').removeClass('open-right-sidebar');
			return false;
		});
		$(document).on('click', '#toggle_mobile_nav', function (e) {
			$wrapper.toggleClass('mobile-nav-open').removeClass('open-right-sidebar');
			return;
		});
		$(document).on("mouseenter mouseleave",".fixed-sidebar-left", function(e) {
			if (e.type === "mouseenter") {
				$wrapper.addClass("sidebar-hover");
			} else {
				$wrapper.removeClass("sidebar-hover");
			}
			return false;
		});
		$(document).on("mouseenter mouseleave",".wrapper > .setting-panel", function(e) {
			if (e.type === "mouseenter") {
				$wrapper.addClass("no-transition");
			} else {
				$wrapper.removeClass("no-transition");
			}
			return false;
		});
		// ■■ Todo
		var random = Math.random();
		$(document).on("keypress","#add_todo",function (e) {
			if ((e.which === 13)&&(!$(this).val().length === 0))  {
					$('<li class="nav-item"><div class="checkbox checkbox-success"><input type="checkbox" id="checkbox'+random+'"/><label for="checkbox'+random+'">' + $('.new-todo input').val() + '</label></div></li>').insertAfter(".todo-list li:last-child");
					$('.new-todo input').val('');
			} else if(e.which === 13) {
				iziToast.error({title: 'warning', message: 'Please type asomthing!', position: 'topRight', color: 'orange'});
			}
			return;
		});
		// ■■ Slimscroll
		require(['slimscroll'],function(){
			$('.message-nicescroll-bar').slimscroll({height:'229px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
			$('.message-box-nicescroll-bar').slimscroll({height:'350px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
			$('.product-nicescroll-bar').slimscroll({height:'346px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
			$('.app-nicescroll-bar').slimscroll({height:'162px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
			$('.todo-box-nicescroll-bar').slimscroll({height:'310px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
			$('.users-nicescroll-bar').slimscroll({height:'370px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
			$('.users-chat-nicescroll-bar').slimscroll({height:'257px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
			$('.chatapp-nicescroll-bar').slimscroll({height:'543px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
			$('.chatapp-chat-nicescroll-bar').slimscroll({height:'483px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
		});
		// ■■ Refresh Init Js
		var refreshMe = '.refresh';
		$(document).on("click",refreshMe,function (e) {
			var panelToRefresh = $(this).closest('.panel').find('.refresh-container');
			var loadingAnim = panelToRefresh.find('.la-anim-1');
			panelToRefresh.show();
			setTimeout(function(){
				loadingAnim.addClass('la-animate');
			},100);
			setTimeout(function(){
				panelToRefresh.fadeOut(800);
				setTimeout(function(){
					loadingAnim.removeClass('la-animate');
				},800);
			},1500);
			  return false;
		});
		// ■■ Fullscreen Init Js
		$(document).on("click",".full-screen",function (e) {
			$(this).parents('.panel').toggleClass('fullscreen');
			$(window).trigger('resize');
			return false;
		});
		// ■■ Panel Remove
		$(document).on('click', '.close-panel', function (e) {
			var effect = $(this).data('effect');
				$(this).closest('.panel')[effect]();
			return false;
		});
		// ■■ Nav Tab Responsive Js
		$(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
			var $target = $(e.target);
			var $tabs = $target.closest('.nav-tabs-responsive');
			var $current = $target.closest('li');
			var $parent = $current.closest('li.dropdown');
				$current = $parent.length > 0 ? $parent : $current;
			var $next = $current.next();
			var $prev = $current.prev();
			$tabs.find('>li').removeClass('next prev');
			$prev.addClass('prev');
			$next.addClass('next');
			return;
		});
	};
	UI.helpers = {
		location: {
			host : location.host,
			pathname : decodeURIComponent(location.pathname),
			search : decodeURIComponent(location.search),
			hash : location.hash,
		},
	};
	UI.layout = {
		init: function(event, isthy) {
			this.preload();
			this.navLeft();
			doodle();
			dropdownAnims();
			UI.chatApp.evnt();
			this.settings();
			this.prevent();
			this.menus();
			this.elements();
			this.resize();
		},
		prevent: function() {
			$(document).on('click', 'a[href="#"]', function (e){ e.preventDefault(); });
			$(document).on('click', '.click-prevent', function (e){ e.preventDefault(); });
			$('.no-mobile a[href*="tel:"]').click(function (e) { e.preventDefault(); });
			$(document).on('click', '.dropdown-menu[role="form"]', function (e){
				e.stopPropagation();
			});
			$(".empty-parent:empty").parent().remove();
			$(".nav ul:empty").remove();
		},
		preload: function() {
			var progressAnim = $('.progress-anim');
			if( progressAnim.length > 0 ){
				for(var i = 0; i < progressAnim.length; i++){
					var $this = $(progressAnim[i]);
					$this.waypoint(function() {
					var progressBar = $(".progress-anim .progress-bar");
					for(var i = 0; i < progressBar.length; i++){
						$this = $(progressBar[i]);
						$this.css("width", $this.attr("aria-valuenow") + "%");
					}
					}, {
					  triggerOnce: true,
					  offset: 'bottom-in-view'
					});
				}
			}
		},
		resize: function() {
			this.setHeightWidth();
			UI.chatApp.init();
			$('.product-carousel').trigger('refresh.owl.carousel');
		},
		setHeightWidth: function() {
			var height = $(window).height();
			var width = $(window).width();
			$('.full-height').css('height', (height));
			// ■■ Right Sidebar Scroll Start
			if(width<=1007){
				$('#chat_list_scroll').css('height', (height - 270));
				$('.fixed-sidebar-right .chat-content').css('height', (height - 279));
				$('.fixed-sidebar-right .set-height-wrap').css('height', (height - 219));
			} else {
				$('#chat_list_scroll').css('height', (height - 204));
				$('.fixed-sidebar-right .chat-content').css('height', (height - 213));
				$('.fixed-sidebar-right .set-height-wrap').css('height', (height - 153));
			}	
			// ■■ Right Sidebar Scroll End
			// ■■ Vertical Tab Height Cal Start
			var verticalTab = $(".vertical-tab");
			if( verticalTab.length > 0 ){
				for(var i = 0; i < verticalTab.length; i++){
					var $this =$(verticalTab[i]);
					$this.find('ul.nav').css(
					  'min-height', ''
					);
					$this.find('.tab-content').css(
					  'min-height', ''
					);
					height = $this.find('ul.ver-nav-tab').height();
					$this.find('ul.nav').css(
					  'min-height', height + 40
					);
					$this.find('.tab-content').css(
					  'min-height', height + 40
					);
				}
			}
			// ■■ Vertical Tab Height Cal End
		},
		settings: function() {
			$(document).on('change', '.setting-panel #darkSidebar', function () {
				if($(".setting-panel #darkSidebar").is(":checked")) {
					$wrapper.addClass("dark-nav");
				} else {
					$wrapper.removeClass("dark-nav");
				}
				return false;
			});
		},
		navLeft: function() {
			if( $('.fixed-sidebar-left .side-nav .active-page').length > 0 ) {
				$('.fixed-sidebar-left .side-nav .active-page').parent().parent().collapse('show');
			}
			// ■■ Sidebar Collapse Animation
			var sidebarNavCollapse = $('.fixed-sidebar-left .side-nav  li .collapse');
			var sidebarNavAnchor = '.fixed-sidebar-left .side-nav li [data-toggle="collapse"]';
			$(document).on("click",sidebarNavAnchor,function (e) {
				if ($(this).attr('aria-expanded') === "false") {
					$(this).blur();
				}
				$(sidebarNavCollapse).not($(this).parent().parent()).collapse('hide');
			});
		},
		elements: function() {
			$(".js-page-loader").one('click', function(e) {
				$(this).initz_loadz();
				console.log("e: ", e);
				$(this).initz_toggleclass();
			});
			$(".js-page-loaded").each(function() {
				$(this).initz_loadz();
			});
			$(document).on('click', '.js-toggleclass', function () {
				$(this).initz_toggleclass();
			});
			$(document).on('click', '.js-switchclass', function () {
				$(this).initz_switchclass();
			});
			$(document).on('click', '.js-addclass', function () {
				$(this).initz_addclass();
			});
			$(document).on('click', '.js-removeclass', function () {
				$(this).initz_removeclass();
			});
			$(document).on('click', '.js-pageclass', function () {
				$(this).initz_pageclass();
			});
			$(document).on('click', '.js-uncheck', function () {
				$(this).initz_uncheck();
			});
			$(document).on('click', '.column-min-button .column-header-title', function () {
				$(this).parents('.column').toggleClass('column-minimize');
			});
			$(document).on('click', '.column-maximize-button', function () {
				var targets = $(this).data('targets') || '';
				$(this).parents('.column').addClass('column-maximize');
				$(targets).addClass('column-minimize');
			});
			$(document).on('click', '.column-minimize-button', function () {
				var targets = $(this).data('targets') || '';
				// var target = $(this).data('target') || '';
				$(targets).addClass('column-minimize');
			});
			$(document).on('click', '.column-normalize-button', function () {
				var targets = $(this).data('targets') || '';
				$(this).parents('.column').removeClass('column-maximize');
				$(targets).removeClass('column-minimize');
			});
			$(document).on('click', '.js-collapse-check', function () {
				var $thiz = $(this);
				var $that = $thiz.parents('.collapse-check').find('.collapse');
				if ($thiz.prop( "checked" )){
					$that.collapse('show');
				} else {
					$that.collapse('hide');
				}
			});
			$(document).on('click', '.js-eye', function (e) {
				var $pass = $(this).parents('.js-showpass').find('input');
				var $eye = $(this).find('i');
				if ($pass.attr('type') === 'password') {
					$pass.attr('type', 'text');
					$eye.addClass('fa-eye-slash');
					$eye.removeClass('fa-eye');
				} else {
					$pass.attr('type', 'password');
					$eye.removeClass('fa-eye-slash');
					$eye.addClass('fa-eye');
				}
			});
			$(document).on('show.bs.collapse', '.field-controls > .collapse', function (e) {
				$(e.target).parent().addClass('active');
				if ($(this).is('.field-tabs')) {
					$(e.target).parent().siblings().children('.collapse').not(this).collapse('hide');
					$(this).parents('.field-controls-hover').addClass('active');
				}
				if ($(this).is('.column-maximize-toggle')) {
					var targets = $(this).data('targets') || '';
					$(this).parents('.column').addClass('column-maximize');
					$(targets).addClass('column-minimize');
				}
			});
			$(document).on('hide.bs.collapse', '.field-controls > .collapse', function (e) {
				$(e.target).parent().removeClass('active');
				if ($(this).is('.field-tabs')) {
					$(this).parents('.field-controls-hover').removeClass('active');
				}
				if ($(this).is('.column-maximize-toggle')) {
					var targets = $(this).data('targets') || '';
					$(this).parents('.column').removeClass('column-maximize');
					$(targets).removeClass('column-minimize');
				}
			});
			$(document).on('show.bs.collapse', '.nav-controls > li .collapse', function (e) {
				$(this).parent().siblings().children('.collapse').not(this).collapse('hide');
				if ($(this).parents('.nav-controls').is('.api-list-proxy')) {
					var api = $('#api' + $(this).data('api'));
					var item = api.parents('li');
					var nice = $(api.parents('.nicescroll-bar'));
					api.collapse('show');
					setTimeout(function(){
						nice.animate({scrollTop: item.offset().top - nice.offset().top + nice.scrollTop()});
					},500);
				}
				if ($(this).is('.column-maximize-toggle')) {
					var targets = $(this).data('targets') || '';
					$(this).parents('.column').addClass('column-maximize');
					$(targets).addClass('column-minimize');
				}
			});
			$(document).on('hide.bs.collapse', '.nav-controls > li .collapse', function (e) {
				if ($(this).parents('.nav-controls').is('.api-list-proxy')) {
					var api = $('#api' + $(this).data('api'));
					api.collapse('hide');
				}
				if ($(this).is('.column-maximize-toggle')) {
					var targets = $(this).data('targets') || '';
					$(this).parents('.column').removeClass('column-maximize');
					$(targets).removeClass('column-minimize');
				}
			});
		},
		menus: function() {
			$('.fixed-sidebar-left .side-nav li a').each(function(i, e) {
				var locPath = UI.helpers.location.pathname;
				if ( $(this).attr('href') ) {
					if ( $(this).attr('href').indexOf('http') !== -1 ) {
						locPath = location.origin + locPath;
					}
					if ( location.pathname !== "/" ) {
						if ( $(this).attr('href') === locPath || $(this).data('href') === locPath ) {
							if ($(this).is('.js-collapse-open')) {
								var target = $(this).next('button').data('target');
								$(target).addClass('in');
							}
							$(this).addClass('active');
							$(this).parents('li').addClass('active');
							$(this).parent().parents('.collapse').collapse('show');
						}
					} else {
						$('nav li a[href="/"]').parent().addClass('active');
					}
				}
			});
		},
	}
	UI.navhorz = {
		init: function() {
			var $outer = $('.nav-horz nav');
			var $inner = $('.nav-horz ul');
			if ($inner.width() > $outer.width()) {
				$('.nav-horz').addClass('active');
			} else {
				$('.nav-horz').removeClass('active');
			}
			if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				var scrolling = false;
				function scrollContent(direction) {
					var amount = (direction === "left" ? "-=3px" : "+=3px");
					$($outer).animate({
						scrollLeft: amount
					}, 1, function() {
						if (scrolling) {
							scrollContent(direction);
						}
					});
				}
			}
		},
	};
	UI.chatApp = {
		init: function() {
			var chatAppTarget = $('.chat-for-widgets-1.chat-cmplt-wrap');
			$(document).on("click",".chat-for-widgets-1.chat-cmplt-wrap .chat-data",function (e) {
				var width = $(window).width();
				if(width<=1007) {
					chatAppTarget.addClass('chat-box-slide');
				}
				return false;
			});
			$(document).on("click","#goto_back_widget_1",function (e) {
				var width = $(window).width();
				if(width<=1007) {
					chatAppTarget.removeClass('chat-box-slide');
				}
				return false;
			});
		},
		evnt: function() {
			// ■■ Chat
			$(document).on("keypress","#input_msg_send",function (e) {
				if ((e.which == 13)&&(!$(this).val().length == 0)) {
					$('<li class="self mb-2"><div class="self-msg-wrap"><div class="msg d-block float-right">' + $(this).val() + '<div class="msg-per-detail mt-5"><span class="msg-time txt-grey">3:30 pm</span></div></div></div><div class="clearfix"></div></li>').insertAfter(".fixed-sidebar-right .chat-content ul li:last-child");
					$(this).val('');
				} else if((e.which == 13)&&($(this).val().length == 0)) {
					iziToast.error({title: 'warning', message: 'Please type asomthing!', position: 'topRight', color: 'orange'});
				}
				return;
			});
			$(document).on("keypress","#input_msg_send_widget",function (e) {
				if ((e.which == 13)&&(!$(this).val().length == 0)) {
					$('<li class="self mb-2"><div class="self-msg-wrap"><div class="msg d-block float-right">' + $(this).val() + '<div class="msg-per-detail mt-5"><span class="msg-time txt-grey">3:30 pm</span></div></div></div><div class="clearfix"></div></li>').insertAfter(".chat-for-widgets .chat-content ul li:last-child");
					$(this).val('');
				} else if((e.which == 13)&&($(this).val().length == 0)) {
					iziToast.error({title: 'warning', message: 'Please type asomthing!', position: 'topRight', color: 'orange'});
				}
				return;
			});
			$(document).on("keypress","#input_msg_send_chatapp",function (e) {
				if ((e.which == 13)&&(!$(this).val().length == 0)) {
					$('<li class="self mb-2"><div class="self-msg-wrap"><div class="msg d-block float-right">' + $(this).val() + '<div class="msg-per-detail mt-5"><span class="msg-time txt-grey">3:30 pm</span></div></div></div><div class="clearfix"></div></li>').insertAfter(".chat-for-widgets-1 .chat-content ul li:last-child");
					$(this).val('');
				} else if(e.which === 13) {
					iziToast.error({title: 'warning', message: 'Please type asomthing!', position: 'topRight', color: 'orange'});
				}
				return;
			});
			$(document).on("click",".fixed-sidebar-right .chat-cmplt-wrap .chat-data",function (e) {
				$(".fixed-sidebar-right .chat-cmplt-wrap").addClass('chat-box-slide');
				return false;
			});
			$(document).on("click",".fixed-sidebar-right #goto_back",function (e) {
				$(".fixed-sidebar-right .chat-cmplt-wrap").removeClass('chat-box-slide');
				return false;
			});
			// ■■ Chat for Widgets
			$(document).on("click",".chat-for-widgets.chat-cmplt-wrap .chat-data",function (e) {
				$(".chat-for-widgets.chat-cmplt-wrap").addClass('chat-box-slide');
				return false;
			});
			$(document).on("click","#goto_back_widget",function (e) {
				$(".chat-for-widgets.chat-cmplt-wrap").removeClass('chat-box-slide');
				return false;
			});
		},
	};
	$.fn.initz_loadz = function() {
		return this.each(function(i,e) {
			var $thiz = $(this);
			var targetUrl = $thiz.data('load');
			var targetCall = $thiz.data('call');
			var target = $thiz.data('target')||this;
			console.log("targetload: ", target);
			$(target).load(targetUrl, function() {
				reqDeps(targetCall);
			});
		});
	};
	$.fn.initz_removeclass = function() {
		return this.each(function(i,e) {
			var $thiz = $(this);
			var target = $thiz.data('target') || $thiz.attr('href');
			var cls = $thiz.data('class') || '';
			$(target).removeClass(cls);
		});
	};
	$.fn.initz_addclass = function() {
		return this.each(function(i,e) {
			var $thiz = $(this);
			var target = $thiz.data('target') || $thiz.attr('href');
			var cls = $thiz.data('class') || '';
			$(target).addClass(cls);
		});
	};
	$.fn.initz_toggleclass = function() {
		return this.each(function(i,e) {
			var $thiz = $(this);
			var target = $thiz.data('target') || $thiz.attr('href');
			var cls = $thiz.data('class') || '';
			var remove = $thiz.data('remove') || '';
			$(target).toggleClass(cls);
			$(target).removeClass(remove);
			if ($(target).is('.' + cls)) {
				$thiz.addClass('active');
			} else if ($(target).not('.' + cls)) {
				$thiz.removeClass('active');
			}
		});
	};
	$.fn.initz_switchclass = function() {
		return this.each(function(i,e) {
			var $thiz = $(this);
			var target = $thiz.data('target') || $thiz.attr('href');
			var cls = $thiz.data('class') || '';
			var all = $thiz.data('all');
			$(all).removeClass(cls);
			$(target).addClass(cls);
		});
	};
	$.fn.initz_pageclass = function() {
		return this.each(function(i,e) {
			var $thiz = $(this);
			var target = '.wrapper';
			var cls = $thiz.data('page') || '';
			var remove = $thiz.data('pageremove') || '';
			$(target).addClass(cls);
			$(target).removeClass(remove);
		});
	};
	$.fn.initz_uncheck = function() {
		return this.each(function(i,e) {
			$('input[name="specs"]').prop('checked', false);
		});
	};
	$.fn.initz_checkExcept = function() {
		return this.each(function(i,e) {
			var $exp = $(this).find('.js-check-exp-this').find('input[type="checkbox"]');
			var $others = $(this).find('.js-check-exp').find('input[type="checkbox"]');
			console.log("$exp: ", $exp);
			console.log("$others: ", $others);
			if ($others.is(':checked')) {
				$exp.prop('checked', false).change();
			}
		});
	};
	$(window).on("resize", function () {
		UI.layout.resize();
	});
	UI.layout.init('event', false);
});