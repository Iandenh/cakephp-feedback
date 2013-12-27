$(document).ready(function(){

	/*
	Hide all on IE < 9
	*/
	if( get_browser() == 'MSIE' && get_browser_version() <= 9 ){
		$( "#feedbackit-slideout, #feedbackit-slideout_inner" ).css( "display", 'none');
	}else{
		$( "#feedbackit-slideout, #feedbackit-slideout_inner" ).css( "display", 'block');
	}


	/*
	Submit button click
	 */
	$('#feedbackit-form').submit(function(e){

		//Hide feedback slider
		$('#feedbackit-slideout,#feedbackit-slideout_inner').hide();

		html2canvas(document.body, {
		  onrendered: function(canvas) {
		    
		    //encode the image data as a base64 encoded PNG file and return it
		    var strDataURI = canvas.toDataURL(); 

		    //Serialize the feedback form
		    var postData = $('#feedbackit-form').serializeArray();

		    //Add screenshot
		    postData.push({name:'screenshot',value:strDataURI});

		    //Add current URL
		    postData.push({name:'url',value:document.URL});

		    //Add browser
		    postData.push({name:'browser',value:get_browser()});

		    //Add browser version
		    postData.push({name:'browser_version',value:get_browser_version()});

		    //Ajax call to controller to save this feedback report
		    $.ajax(
		    {
		        url : window.formURL,
		        type: "POST",
		        data : postData,
		        success:function(data, textStatus, jqXHR) 
		        {
		        	closeandreset();

		            alert('Thank you. Your feedback was submitted.');
		        },
		        error: function(jqXHR, textStatus, errorThrown) 
		        {
		            alert('There was an error submitting your feedback. Please try again later.');    
		        }
		    });
		    
		    //Show it again
		    $('#feedbackit-slideout,#feedbackit-slideout_inner').show();
		  }
		});

		e.preventDefault();
	});

	/*
	Hightlight button click
	 */
	$('#feedbackit-highlight').mouseup(function(){

		//Fadeout highlight if any
		$("#feedbackit-highlight-holder").fadeOut();

		$(this).queue(function() {
	       
	       	//Disable button and show loading text
			$('#feedbackit-highlight').button('loading');

	        $(this).dequeue();

	    }).delay(250).queue(function() {
	        
	        /*
			Highlight function
			 */
			$('body').click(function(e){
				// capture the mouse position
			    var posx = 0;
			    var posy = 0;
			    if (!e) var e = window.event;
			    if (e.pageX || e.pageY)
			    {
			        posx = e.pageX;
			        posy = e.pageY;
			    }
			    else if (e.clientX || e.clientY)
			    {
			        posx = e.clientX;
			        posy = e.clientY;
			    }
			 
			 	//Set position, to exactly center substract half the width and height from the x and y position
				$( "#feedbackit-highlight-holder" ).css( "left", posx - 75);
			    $( "#feedbackit-highlight-holder" ).css( "top", posy - 75);
				$( "#feedbackit-highlight-holder" ).fadeIn();

				//Reset highlight button
				$('#feedbackit-highlight').button('reset');

				//Unbind click function
				$('body').off('click');

				e.preventDefault();
			});

	        $(this).dequeue();

	    });
	});

	/*
	Checkbox
	 */
	$('#feedbackit-okay').change(function(){
		
		if( $(this).is(':checked') ){
			//Enable button
			$("#feedbackit-submit").removeAttr("disabled");  
			return;
		}

		//Disable button
		$("#feedbackit-submit").attr("disabled", "disabled");
		return;
	});

	/*
	Detect browser
	 */
	function get_browser(){
	    var N=navigator.appName, ua=navigator.userAgent, tem;
	    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
	    return M[0];
    }

    /*
	Detect browser version
	 */
	function get_browser_version(){
	    var N=navigator.appName, ua=navigator.userAgent, tem;
	    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
	    return M[1];
    }

    /*
	Click on closed feedback tab
	 */
    $("#feedbackit-slideout").click(function(){
		//Open menu 
		$("#feedbackit-slideout").addClass("feedbackit-slideout_outer");
		$("#feedbackit-slideout_inner").addClass("feedbackit-slideout_inner");  
	});

	/*
	Click on cancel button
	 */
	$("#feedbackit-cancel").click(function(){
      	closeandreset();
	});	

	/*
	Close and reset function
	 */
	function closeandreset(){
		//Close menu 
      	$("#feedbackit-slideout").removeClass("feedbackit-slideout_outer");
      	$("#feedbackit-slideout_inner").removeClass("feedbackit-slideout_inner"); 
      	//Reset fields
      	$('.feedbackit-input').val(''); //Reset
      	$('#feedbackit-okay').attr('checked', false);
      	$("#feedbackit-submit").attr("disabled", "disabled");
		$("#feedbackit-highlight-holder").fadeOut();
	}

	/*
	Activate tooltip for screenshot approval
	 */
	
	$('#feedbackit-okay-message').tooltip();
});