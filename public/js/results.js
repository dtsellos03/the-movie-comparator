$('.ui.modal.info')
      .modal('show');



$('.filmography').popup({
      on: 'click',
      position: 'top left'
});;


$(document).ready(function() {
      $('.ui.sticky')
            .sticky({
                  context: '#stickycontext'
            });

})


$(document).ready(function() {
      $("#fadein").hide(0).delay(0).fadeIn(700)
});