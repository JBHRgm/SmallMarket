function select_cat(elem) {
    $('#subcats .form-check').css('display', 'none');
    let cid = $(elem).children().val();
    $('.sub' + cid).parent().parent().css('display', 'block');
}

function submit_new() {
    $('#a-piccount').val($('#pctr').val());
    let maincat = $('#maincats div label input:checked');
    let subcat = $('#subcats div label input:checked');
    if (maincat.length == 0) {
        alert("Bitte wählen Sie eine Kategorie");
        return 0;
    } else {
        $('#a-cat').val($(maincat[0]).val());
    }
    if (subcat.length > 0) $('#a-subcat').val($(subcat[0]).val());
    $('#new-submit').click();
}

function upload_file () {
    return new Promise((res, rej) => {
        let form = $('#pic-form')[0];
        let data = new FormData(form);
        if ($('#apicture').val() != '') {
            $.ajax({
                url: window.location.href + '/pic',
                method: 'POST',
                data: data,
                processData: false,
                contentType: false,
                cache: false,
            })
            .then(function (response) {
                let pc = $('#pctr').val();
                $('#pctr').val(parseInt($('#pctr').val()) + 1);
                let el = document.createElement('img');
                el.src = `/static/img/articles/art${response['aid']}/art${response['aid']}pic${pc}.jpg`;
                el.className = 'pics';
                $(el).insertBefore($('#picwrapper button').first());
                res(pc);
            })
            .catch(function (err) {
                console.error(err);
                rej(0);
            });
        }
    })
}
