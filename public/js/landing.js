// Progress of API calls

var socket = io.connect(window.location.href);
socket.on('connect', function() {});
socket.on('message', function(data) {
  console.log(data)
  $("#progress").text(data);

});

socket.on('disconnect', function() {});

// Modal toggle

$('#dimmer').click(function() {
  $('.ui.dimmer').dimmer("toggle")
})

$('#guide').click(function() {
  $('.ui.modal.guide')
    .modal('show')
});

$('#about').click(function() {
  $('.ui.modal.about')
    .modal('show')
});

// Appearance of file input box

$('.ui.file.input').find('input:text, .ui.button')
  .on('click', function(e) {
    $(e.target).parent().find('input:file').click();
  });


$('input:file', '.ui.file.input')
  .on('change', function(e) {
    var file = $(e.target);
    var name = '';

    for (var i = 0; i < e.target.files.length; i++) {
      name += e.target.files[i].name + ', ';
    }
    // remove trailing ","
    name = name.replace(/,\s*$/, '');

    $('input:text', file.parent()).val(name);
  });


$('input:file').on("change", function() {
  $('.submitbutton').prop('disabled', !$(this).val());
});