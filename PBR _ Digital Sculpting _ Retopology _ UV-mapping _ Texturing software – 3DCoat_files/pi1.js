var engine = {
    renderVideo : function(videoContainerObj, contentuid, lastuid, limit ){
		//alert('contentuid='+contentuid + 'lastuid='+lastuid + 'limit='+limit);
		$.ajax({
			url: "/index.php?eID=videoloadmore",
			data: {
				contentuid: contentuid,
				lastuid: lastuid,
				limit: limit
			},
			success: function( data ) {
				var oldHtml = videoContainerObj.html();
				var loadedVideoHtml = '';
				var obj = JSON.parse(data);
				
				//console.dir(obj);
				
				var addTitleContainer = false;
				var addDescriptionContainer = false;
				for(var i=0; i< obj.video.length; i++) {
					if(obj.video[i].title) addTitleContainer = true;
					if(obj.video[i].description) addDescriptionContainer = true;
				}
				
				for(var i=0; i< obj.video.length; i++) {
					loadedVideoHtml += '<div class="column-video">';
					loadedVideoHtml += '<a href="' + obj.video[i].videolink + '" title="' + obj.video[i].title + '"><div class="image-white-container"><div class="play-video"></div><img src="' + obj.video[i].image + '"></div></a>';
					if(addTitleContainer) loadedVideoHtml += '<h5>' + obj.video[i].title + '</h5>';
					if(addDescriptionContainer) loadedVideoHtml += '<p>' + obj.video[i].description + '</p>';
					loadedVideoHtml += '</div>';
					lastuid = obj.video[i].uid;
				}
				
				videoContainerObj.html( oldHtml + loadedVideoHtml  );
				engine.renderButton(videoContainerObj,contentuid, lastuid, obj.amountleft);	
				engine.videoLinkHandler(videoContainerObj);	
			}
		});
        
    },
	renderButton : function(videoContainerObj, contentuid, lastuid, amountleft){
		var buttonContainer = $( "#button-container"+contentuid );
		var amountLoadMax = buttonContainer.data('amountload');
		
		var buttonlink = buttonContainer.data('buttonlink');
		var buttontext = buttonContainer.data('buttontext');
		
		
		var buttonContainerHtml = '';
		
		if(buttonlink) {
			buttonContainerHtml = engine.getButtonHtml(buttontext, amountload);
		} else 
		{
			if(amountleft > 0){
				var amountload = Math.min(amountleft, amountLoadMax);
				buttonContainerHtml = engine.getButtonHtml(buttontext, amountload);
			}
		}
		buttonContainer.html( buttonContainerHtml );
		buttonContainer.find( "button" ).on( "click", function( event ) {
			if(buttonlink){
				var isNum = $.isNumeric(buttonlink);
				if(isNum){
					document.location.href = '/index.php?id=' + buttonlink;
				} else
				{
					document.location.href = buttonlink;
				}
			} else
			{
				ga('send', 'event', 'Video', 'LoadMore');
				engine.renderVideo(videoContainerObj, contentuid, lastuid, amountload);
			}
		});
	},
	
	getButtonHtml : function(buttontext, amountload){
		var buttonContainerHtml = '';
		buttonContainerHtml += '<button class="btn" >';
		if(buttontext){
			buttonContainerHtml += buttontext;
		} else
		{
			buttonContainerHtml +=	'load <span class="amount_video_left">'+amountload+'</span> more video';
		}
		buttonContainerHtml +=	'</button>';
		
		return buttonContainerHtml;
	},
	
	videoLinkHandler : function(videoContainerObj){
		videoContainerObj.find("a").on( "click", function( event ) {
			event.preventDefault();	
			var title = $(this).attr('title');
			ga('send', 'event', 'Video', 'Play', title);
			
			var href = $(this).attr('href');
			//alert(href);
			//console.dir(href);
			var videoArr = href.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?)]*).*/);
			//console.dir(videoArr);
			$( "#video-id" ).show();
			//$('#iframe-id').attr('src', href);
			
			$('#iframe-id').attr('src', 'http://www.youtube.com/embed/'+videoArr[7]+'?rel=0&autoplay=1&amp;controls=1&amp;showinfo=1&enablejsapi=1');
		});
	},
	init : function(videoContainer){
		var videoContainerObj = $(videoContainer);
		var initAmountLoad = videoContainerObj.data('initamountload');
		var contentUid = videoContainerObj.data('contentuid');
		
		//alert('contentUid='+contentUid);
		var lastuid = 0;
		engine.renderVideo(videoContainerObj, contentUid, lastuid, initAmountLoad);
    }
};



// usage
$(document).ready(function(){
	var videoContainers = $( ".loaded-video-container" );
	for(var i=0; i< videoContainers.length; i++) {
		//alert(videoContainers[i]);
		engine.init(videoContainers[i]);
	}
	
	$( ".videoloadmore_background" ).on( "click", function( event ) {
		
		//alert('videoloadmore_background');
		$('#iframe-id').attr('src', '');
		$( "#video-id" ).hide();
		
		
	});
	
	
	
	
	
});


