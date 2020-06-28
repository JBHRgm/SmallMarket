$('#plz').on('keyup', (ev) => {
    let val = $(ev.target).val();
    if (val.length == 5) {
        $.ajax({
            url: '/register/plz',
            type: 'GET',
            data: { plz: val },
            dataType: 'JSON',
            success: function (res) {
                $('#city').children('option').remove();
                for(x in res) {
                    let el = document.createElement('option');
                    el.text = res[x];
                    document.getElementById('city').appendChild(el);
                }
            }
        })
    }
})