
refreshManifests();

function clearManifests(){
	$( ".manifests" ).empty();
	$( "#notice" ).empty();
	$( "#notice" ).attr( "class", "" );
}

function refreshManifests(alert_class,alert_text){

	$.getJSON( "/collections/manifests", function( data ) {

		 clearManifests();

	   var items = [];
	   $.each( data, function( key, val ) {
	   	 var v = (val.label) ? val.label : '_untitled_';
	     items.push( "<li id='" + val._id + "'><a href='/collections/manifests/" + val._id + "'>" + v + "</a><br/><a class='btn editManifest' href='/collections/manifests/" + val._id  + "'>edit</a> | <a class='btn deleteManifest' href='/collections/manifests/" + val._id  + "'>delete</a></li>" );
	   });

	  $( items.join( "" ) ).appendTo( ".manifests" );

		$( "#notice" ).addClass(alert_class).html(alert_text);
		$( "#notice" ).show().fadeOut( 2600, "swing" )

	});

}


$('body').on('click', 'a.deleteManifest', function(event) {
  event.preventDefault();
  event.stopPropagation();

  var id = $( this ).attr('href');

  $.ajax(
    {
        url : $( this ).attr('href'),
        type: "DELETE",
        success:function(data, textStatus, jqXHR)
        {
					refreshManifests('alert-success','Deleted.');
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
					refreshManifests('alert-danger','Problem, Houston! No deletion.');
        }
    });

});

$('body').on('click', 'a.addManifest', function(event) {
  event.preventDefault();
  event.stopPropagation();
	$('#edit').hide();
	$('#add').show();
});

$('body').on('click', 'a.editManifest', function(event) {
  event.preventDefault();
  event.stopPropagation();

  var id = $( this ).attr('href');

	$('#add').hide();
	$('#edit').show();

  $.ajax(
    {
        url : $( this ).attr('href'),
        type: "GET",
        success:function(data, textStatus, jqXHR)
        {
					//Populate form and change METHOD
					$( '#inputEditManifest' ).text(JSON.stringify(data));
					//var action = "/" + data._id;
					//$( '#formAddManifest' ).attr("method", "PUT");
					//$( '#formAddManifest' ).attr("action", action);
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
					//Couldn't find record
					$( '#inputManifest' ).text("Couldn't find record.");
        }
    });

});

$( "#formEditManifest" ).submit(function( event ) {
		event.preventDefault();
  	event.stopPropagation();

		var postData = $(this).serializeArray();
		var payload = JSON.parse(postData[0].value);
		postDataJSON = JSON.stringify(payload, null, 2);

    var formURL = $(this).attr("action") + payload._id;

    $.ajax(
    {
        url : formURL,
				method: "PUT",
        data : payload,
        success:function(data, textStatus, jqXHR)
        {
					refreshManifests('alert-success','<h2>Manifest created:</h2><pre>' + postDataJSON + '</pre>');
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
					refreshManifests('alert-danger','<h2>' + errorThrown + '</h2><pre>' + postDataJSON + '</pre>');
        }
    });

});

$( "#formAddManifest" ).submit(function( event ) {
		console.log("formdata: " + $(this));
		var postData = $(this).serializeArray();
		var payload = JSON.parse(postData[0].value);
    var formURL = $(this).attr("action");

    var postDataJSON = JSON.stringify(payload, null, 2);

    $.ajax(
    {
        url : formURL,
				method: "POST",
        data : payload,
        success:function(data, textStatus, jqXHR)
        {
					refreshManifests('alert-success','<h2>Manifest created:</h2><pre>' + postDataJSON + '</pre>');
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
					refreshManifests('alert-danger','<h2>' + errorThrown + '</h2><pre>' + postDataJSON + '</pre>');
        }
    });

  event.preventDefault();
  event.stopPropagation();

});

// This code handles the expandable textarea
$(function() {
  var observe;
        if (window.attachEvent) {
            observe = function (element, event, handler) {
                element.attachEvent('on'+event, handler);
            };
        }
        else {
            observe = function (element, event, handler) {
                element.addEventListener(event, handler, false);
            };
        }
        function init () {
            var text = document.getElementById('inputManifest');
            function resize () {
                text.style.height = 'auto';
                text.style.height = text.scrollHeight+'px';
            }
            /* 0-timeout to get the already changed text */
            function delayedResize () {
                window.setTimeout(resize, 0);
            }
            observe(text, 'change',  resize);
            observe(text, 'cut',     delayedResize);
            observe(text, 'paste',   delayedResize);
            observe(text, 'drop',    delayedResize);
            observe(text, 'keydown', delayedResize);

            text.focus();
            text.select();
            resize();
        }

        init();
});
