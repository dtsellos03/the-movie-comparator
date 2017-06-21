
  var socket = io.connect(window.location.href );
  socket.on('connect', function(){});
  socket.on('message', function(data){
      console.log(data+"%")
     $("#test1").text(data);
     $('#example4').progress({
  percent: data
});
  });
  socket.on('disconnect', function(){});

        $('#toggle').click(function(){ $('.ui.dimmer').dimmer("toggle")})
    
     $('#toggle2').click(function(){ $('.ui.modal.guide')
  .modal('show')})
;

     $('#toggle3').click(function(){ $('.ui.modal.about')
  .modal('show')})
;
    

$('.ui.file.input').find('input:text, .ui.button')
  .on('click', function(e) {
    $(e.target).parent().find('input:file').click();
  })
;

$('input:file', '.ui.file.input')
  .on('change', function(e) {
    var file = $(e.target);
    var name = '';

    for (var i=0; i<e.target.files.length; i++) {
      name += e.target.files[i].name + ', ';
    }
    // remove trailing ","
    name = name.replace(/,\s*$/, '');

		$('input:text', file.parent()).val(name);
  })
;


    $('input:file').on("change", function() {
    $('.submitbutton').prop('disabled', !$(this).val()); 
});

    