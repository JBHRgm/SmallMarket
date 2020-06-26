$(() => {
    let ctr = $('#ctr').val();
    for (x = 0; x < ctr/10; x++) {
        let el = document.createElement('a');
        el.href = '#';
        el.text = (x + 1).toString();
        el.style.padding = '2px';
        el.addEventListener('click', (ev) => {
          $('#page-input').val(ev.target.text);
          $('#searchform').submit();
        })
        document.getElementById('pages').appendChild(el);
    }
    $('input[type="checkbox"]:checked').parent().css('background-color', 'blue');
})

function clicked (el) {
  let aid = el.id.split('article').pop();
  aid = '#alink' + aid;
  $(aid)[0].click();
}

function checked (el) {
  let cb = $(el).children('input');
  if ($(cb).prop('checked') == false) {
    $(cb).prop('checked', true);
    $(el).css('background-color', 'blue');
  } else {
    $(cb).prop('checked', false);
    $(el).css('background-color', '');
  }
}