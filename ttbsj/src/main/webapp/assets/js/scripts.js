
jQuery(document).ready(function() {

    $('.page-container form').submit(function(){
  
    });

    $('.page-container form .username, .page-container form .password').keyup(function(){
        $(this).parent().find('.error').fadeOut('fast');
    });

});
