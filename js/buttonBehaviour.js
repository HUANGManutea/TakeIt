$(function(){
	$('#newDial').dialog({
    autoOpen: false,
    title: 'New Drawing',
    buttons:{
    	"I'm sure !": function(){
    		clean();
    		context.beginPath();
    		context.closePath();
    		$(this).dialog("close");
    	},
    	"Cancel":function(){
    		$(this).dialog("close");
    	}
    }
	});

	$('#butnew').click(function() {
	    $('#newDial').dialog('open');
	    return false;
	});

	$('#butDraw').click(function() {
	    $('#sidebar').add('selector/elements/html')
	});

});