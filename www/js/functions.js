// If JavaScript is enabled remove 'no-js' class and give 'js' class
jQuery('html').removeClass('no-js').addClass('js');

// Add .osx class to html if on Os/x
if ( navigator.appVersion.indexOf("Mac")!=-1 ) 
	jQuery('html').addClass('osx');

// When DOM is fully loaded
jQuery(document).ready(function($) {
  "use strict";
               
/* --------------------------------------------------------	
	 External Links
   --------------------------------------------------------	*/	

	  $(window).load(function() {
			$('a[rel=external]').attr('target','_blank');	
		});

/* --------------------------------------------------------	
	 Tooltips
   --------------------------------------------------------	*/	

    $('body').tooltip({
        delay: { show: 300, hide: 0 },
        selector: '[data-toggle=tooltip]:not([disabled])'
    });
    
/* --------------------------------------------------------	
	 Inc Dec
   --------------------------------------------------------	*/	
    
    $(function() {
      $(".inc").click(function() { var $button = $(this); var old = $button.parent().find("input").val(); var newVal = parseFloat(old) + 1; $button.parent().find("input").val(newVal); }); 
      
      $(".dec").click(function() { var $button = $(this); var old = $button.parent().find("input").val(); var newVal = parseFloat(old) - 1; $button.parent().find("input").val(newVal); }); 
    }); 
    
/* --------------------------------------------------------	
	 Dynamic Progress Bar
   --------------------------------------------------------	*/

    $(window).load(function(){    
      $('.progress-bar').css('width',  function(){ return ($(this).attr('data-percentage')+'%')});
    });

/* --------------------------------------------------------	
	 Back To Top Button
   --------------------------------------------------------	*/	

  // hide #back-top first
	$(".back-to-top").hide();
	
	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 500) {
				$('.back-to-top').fadeIn(500);
			} else {
				$('.back-to-top').fadeOut(500);
			}
		});

	  // scroll body to 0px on click
		$('.back-to-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});

/* --------------------------------------------------------	
	 Fixed Menu
   --------------------------------------------------------	*/	

  $('.navbar').sticky({topSpacing:0});

/* --------------------------------------------------------	
	 TinyNav
   --------------------------------------------------------	*/	
 
  $(function () {
    $("#nav").tinyNav();
  });

  $('html').addClass('js');

/* --------------------------------------------------------	
	 Countdown
   --------------------------------------------------------	*/

  $(function() {
  
    $('.countdown').countdown({
      date: "october 04, 2014 15:00:00",
      render: function(data) {
        var el = $(this.el);
        el.empty()
          .append("<div class=\"counter-item item-day\">" + this.leadingZeros(data.days, 2) + "</div>")
          .append("<div class=\"counter-item\">" + this.leadingZeros(data.hours, 2) + "</div>")
          .append("<div class=\"counter-item\">" + this.leadingZeros(data.min, 2) + "</div>")
          .append("<div class=\"counter-item\">" + this.leadingZeros(data.sec, 2) + "</div>");
      }
    });

  });

/* --------------------------------------------------------	
	 Magnific Popup
   --------------------------------------------------------	*/

    $('.image-link').magnificPopup({type:'image'});

  	$('.popup-gallery').magnificPopup({
  		delegate: 'a',
  		type: 'image',
  		tLoading: 'Loading image #%curr%...',
  		mainClass: 'mfp-img-mobile',
  		gallery: {
  			enabled: true,
  			navigateByImgClick: true,
  			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
  		},
  		image: {
  			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
  			titleSrc: function(item) {
  				return item.el.attr('title') + '<small>By Your Company</small>';
  			}
  		}
  	});

/* --------------------------------------------------------	
	 Gallery (Projects) 
   --------------------------------------------------------	*/	
  
  (function() {
   
    $(window).load(function(){
    	// container
    	var $container = $('#portfolio-items');
    	function filter_projects(tag)
    	{
    	  // filter projects
    	  $container.isotope({ filter: tag });
    	  // clear active class
    	  $('li.act').removeClass('act');
    	  // add active class to filter selector
    	  $('#portfolio-filter').find("[data-filter='" + tag + "']").parent().addClass('act');
    	}
    	if ($container.length) {
    		// conver data-tags to classes
    		$('.project').each(function(){
    			var $this = $(this);
    			var tags = $this.data('tags');
    			if (tags) {
    				var classes = tags.split(',');
    				for (var i = classes.length - 1; i >= 0; i--) {
    					$this.addClass(classes[i]);
    				};
    			}
    		})
    		// initialize isotope
    		$container.isotope({
    		  // options...
    		  itemSelector : '.project',
    		  layoutMode   : 'fitRows'
    		});    
    		// filter items
    		$('#portfolio-filter li a').click(function(){
    			var selector = $(this).attr('data-filter');
    			filter_projects(selector);
    			return false;
    		});
    		// filter tags if location.has is available. e.g. http://example.com/work.html#design will filter projects within this category
    		if (window.location.hash!='')
    		{
    			filter_projects( '.' + window.location.hash.replace('#','') );
    		}
    	}
      
    })

	})();
  
  
/* --------------------------------------------------------	
	 Parallax
   --------------------------------------------------------	*/	

    var detectmob = false;	
    if(navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)) {							
        detectmob = true;
    }
    
    if (detectmob === true) {
      $( '.parallax' ).each(function(){
    			$(this).addClass('parallax-mobile');
    	});
    }
    else {
        $( '#parallax-one' ).parallax();
        $( '#parallax-two' ).parallax();
        $( '#parallax-three' ).parallax();
    }  

/* --------------------------------------------------------	
	 Fitvids
   --------------------------------------------------------	*/	

    $(window).load(function() {
      $("body").fitVids();
    });

/* --------------------------------------------------------	
	 Flex Initialize
   --------------------------------------------------------	*/	

    $(window).load(function() {
    
      $('.flex-1').flexslider({
        animation: "slide",
        slideshow: false,
        useCSS : false,
        animationLoop: true 	
      });
     
      jQuery('.flex-1 .flex-direction-nav .flex-next').html('<i class="fa fa-angle-right"></i>');
      jQuery('.flex-1 .flex-direction-nav .flex-prev').html('<i class="fa fa-angle-left"></i>'); 
     
      $('.flex-2').flexslider({
        animationLoop: false,
    		animation: 'slide',
        useCSS : false
    	 });     
    
      $('.flex-3').flexslider({
        animation: "slide",
        slideshow: false,
        useCSS : false,
        animationLoop: false 	
      });
     
      jQuery('.flex-3 .flex-direction-nav .flex-next').html('<i class="fa fa-angle-right"></i>');
      jQuery('.flex-3 .flex-direction-nav .flex-prev').html('<i class="fa fa-angle-left"></i>'); 
    
      $('.flex-4').flexslider({
        animationLoop: false,
    		animation: 'slide',
        slideshow: false,
        useCSS : false
    	 }); 
    
    }); 

/* --------------------------------------------------------	
	 Refine Slider
   --------------------------------------------------------	*/	
  
  $(window).load(function() {
  
    //main slider
    $('.main-slider-direct-nav').refineSlide({
      maxWidth              : 1920,      // Max slider width - should be set to image width
      transition            : 'random',  // String (default 'cubeV'): Transition type ('custom', random', 'cubeH', 'cubeV', 'fade', 'sliceH', 'sliceV', 'slideH', 'slideV', 'scale', 'blockScale', 'kaleidoscope', 'fan', 'blindH', 'blindV')
      fallback3d            : 'random', // String (default 'sliceV'): Fallback for browsers that support transitions, but not 3d transforms (only used if primary transition makes use of 3d-transforms)
      customTransitions     : [],       // Arr (Custom transitions wrapper)
      perspective           : 1000,     // Perspective (used for 3d transforms)
      useThumbs             : false,     // Bool (default true): Navigation type thumbnails
      useArrows             : true,    // Bool (default false): Navigation type previous and next arrows
      thumbMargin           : 3,        // Int (default 3): Percentage width of thumb margin
      autoPlay              : false,    // Int (default false): Auto-cycle slider
      delay                 : 5000,     // Int (default 5000) Time between slides in ms
      transitionDuration    : 800,      // Int (default 800): Transition length in ms
      startSlide            : 0,        // Int (default 0): First slide
      keyNav                : true,     // Bool (default true): Use left/right arrow keys to switch slide
      captionWidth          : 50,       // Int (default 50): Percentage of slide taken by caption
      arrowTemplate         : '<div class="rs-arrows"><a href="#" class="rs-prev"></a><a href="#" class="rs-next"></a></div>', // String: The markup used for arrow controls (if arrows are used). Must use classes '.rs-next' & '.rs-prev'
      onInit                : function () {}, // Func: User-defined, fires with slider initialisation
      onChange              : function () {}, // Func: User-defined, fires with transition start
      afterChange           : function () {}  // Func: User-defined, fires after transition end
  
    });
    jQuery('.rs-arrows .rs-next').html('<i class="fa fa-angle-right"></i>');
    jQuery('.rs-arrows .rs-prev').html('<i class="fa fa-angle-left"></i>');
  
  });      

/* --------------------------------------------------------	
	 Layer Slider
   --------------------------------------------------------	*/

    $(document).ready(function(){
 
        // Calling LayerSlider on the target element with adding custom slider options
        $('#layerslider').layerSlider({
            autoStart: true,
            firstLayer: 1,
            skin: 'v5',
            skinsPath: 'layerslider/skins/'
 
            // Please make sure that you didn't forget to add a comma to the line endings
            // except the last line!
        });
    });

/* --------------------------------------------------------	
	 Slider Revolution
   --------------------------------------------------------	*/

		var revapi;

		jQuery(document).ready(function() {

			   revapi = jQuery('.tp-banner').revolution(
				{
					delay:9000,
					startwidth:1170,
					startheight:500,
					hideThumbs:10,
					fullWidth:"on",
					forceFullWidth:"on"
				});

		});	//ready
    
/* --------------------------------------------------------	
	 Master Slider
   --------------------------------------------------------	*/
                   
  var slider = new MasterSlider();
  slider.setup('masterslider' , {
       width:1920,    // slider standard width
       height:600,   // slider standard height
       fullwidth:true,
       loop:true,
       space:0
       // more slider options goes here...
       // check slider options section in documentation for more options.
  });
  // adds Arrows navigation control to the slider.
  slider.control('arrows');
                
/* --------------------------------------------------------	
	 Contact Form
   --------------------------------------------------------	*/
	
	$('#send').click(function(){ // when the button is clicked the code executes
		$('.error').fadeOut('slow'); // reset the error messages (hides them)

		var error = false; // we will set this true if the form isn't valid

		var name = $('input#name2').val(); // get the value of the input field
		if(name == "" || name == " " || name == "Name") {
    $('#err-name').show(500);
    $('#err-name').delay(4000);
    $('#err-name').animate({
      height: 'toggle'  
    }, 500, function() {
      // Animation complete.
    }); 
      error = true; // change the error state to true
		}

		var email_compare = /^([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})$/; // Syntax to compare against input
		var email = $('input#email2').val().toLowerCase(); // get the value of the input field
		if (email == "" || email == " " || email == "E-mail") { // check if the field is empty
			$('#err-email').fadeIn('slow'); // error - empty
			error = true;
		}else if (!email_compare.test(email)) { // if it's not empty check the format against our email_compare variable

    $('#err-emailvld').show(500);
    $('#err-emailvld').delay(4000);
    $('#err-emailvld').animate({
      height: 'toggle'  
    }, 500, function() {
      // Animation complete.
    });         
			error = true;
		}
    
		var message = $('textarea#message2').val(); // get the value of the input field
		if(message == "" || message == " " || message == "Message") {

      
    $('#err-message').show(500);
    $('#err-message').delay(4000);
    $('#err-message').animate({
      height: 'toggle'  
    }, 500, function() {
      // Animation complete.
    });            
			error = true; // change the error state to true
		} 

		if(error == true) {

    $('#err-form').show(500);
    $('#err-form').delay(4000);
    $('#err-form').animate({
      height: 'toggle'  
    }, 500, function() {
      // Animation complete.
    });         
			return false;
		}

		var data_string = $('#ajax-form').serialize(); // Collect data from form
		//alert(data_string);

		$.ajax({
			type: "POST",
			url: $('#ajax-form').attr('action'),
			data: data_string,
			timeout: 6000,
			error: function(request,error) {
				if (error == "timeout") {
					$('#err-timedout').slideDown('slow');
				}
				else {
					$('#err-state').slideDown('slow');
					$("#err-state").html('An error occurred: ' + error + '');
				}
			},
			success: function() {

        
    $('#ajaxsuccess').show(500);
    $('#ajaxsuccess').delay(4000);
    $('#ajaxsuccess').animate({
      height: 'toggle'  
    }, 500, function() {
    });           

        $("#name").val('');
        $("#email").val('');
        $("#message").val('');
			}
		});

		return false; // stops user browser being directed to the php file
	}); // end click function
     





});







    