function append_message (sender, user, message, date) {
    let wrapper = document.createElement('div');
    wrapper.className = 'chat-message-wrapper';
    let msg = document.createElement('div');
    let time_wrapper = document.createElement('div');
    if (user == sender) {
        msg.className = 'ml-auto bg-primary chat-message';
        time_wrapper.className = 'chat-message-date ml-auto';
    } else {
        msg.className = 'mr-auto bg-success chat-message';
        time_wrapper.className = 'chat-message-date mr-auto';
    }
    msg.textContent = message;
    let time = document.createElement('small');
    time.textContent = date;
    time_wrapper.appendChild(time);
    wrapper.appendChild(msg);
    wrapper.appendChild(time_wrapper);
    $('#chat-body').append(wrapper);
}

function select_chat (elem) {
    let aid = elem.id.split('a').pop();
    let uid = elem.id.split('a').shift().substr(1);
    $.ajax({
        url: window.location.href,
        method: 'GET',
        dataType: 'JSON',
        data: { aid: aid, uid: uid }
    })
    .then((response) => {
        let messages = response.messages;
        $('#chat-body').children().remove();
        $('#selector-body').children().css('background-color', '');
        $(elem).css('background-color', '#242424');
        $(elem).next('input').prop('checked', true);
        for (x = 0; x < messages.length; x++) {
            append_message(messages[x].sender, response.user, messages[x].msg, messages[x].date);
        }
    })
    .catch((err) => {
        console.log(err);
        alert('Ein Fehler ist aufgetreten!');
    })
}

function send_msg () {
    let msg = $('#message-input').val().trim();
    let selected = $('#selector-body input:checked');
    if (msg != "" && selected.length) {
        let aid = $(selected).val().split('a').pop();
        let uid = $(selected).val().split('a').shift().split('u').pop();
        $.ajax({
            url: window.location.href,
            method: 'POST',
            data: { aid: aid, uid: uid, msg: msg },
            dataType: 'JSON'
        })
        .then((response) => {
            append_message(response.message.sender, response.user, response.message.msg, response.message.date);
        })
        .catch((err) => {
            console.log(err);
            alert('Ein Fehler ist aufgetreten!');
        })
    }
}