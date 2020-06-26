$(function() {                            // found this one online (https://getbootstrap.com/docs/4.0/components/forms/)
    var form = $('.needs-validation');                    // bascially this prevents the form from submitting and adds bootstraps validation styles, looks quite nice i must admit
    form[0].addEventListener('submit', function(event) {  // tried to use jquery.on(...) but turns out that .on triggers after the submit and addEventListener triggers before, so no use for jquery here
        if(form[0].checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, false);

    $('.pw-new-group').on('keyup', () => {    // check if the password equals the confirm password on every key input
      let newval = $('#password').val();
      if(newval != "") {                    // if the password is empty it's fine (at least on /profile, on /register this would be invalid)
        if(newval != $('#confirmpwd').val()) {
          $('#confirmpwd').prop('required', true);
          $('#confirmpwd').prop('pattern', newval);   // set the pattern of the confirm password to the actual password
        }
      } else {
        $('#confirmpwd').prop('required', false);
      }
    });

    $('#res-modal').modal('show');
});
