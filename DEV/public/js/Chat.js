window.document.onload = getChatHistory();

function getChatHistory() {
    $.ajax({
        url: '/api/chat/get',
        async: true,
        method: "GET",
        success: function ( data ) {
            console.log(data);
            // $('#chat-list').empty();
            //With timestamp don't emprty or will appear as empty everytime
            $('#chat-list').append(data);
        }
    })
}

function addChatMessage( event ) {
    if( event.which == 13 || event.keyCode == 13 )
        {
            var Message = document.getElementById("chat-input").value;
            document.getElementById("chat-input").value = '';
            if( event.which == 13 || event.keyCode == 13 )
                {
                    $.ajax({
                        url: "/api/chat/add",
                        method: 'post',
                        async: true,
                        data: JSON.stringify({
                            Message: Message
                        }),
                        contentType: "application/json",
                        success: function(data) {( console.log(data))}
                    })
                }
        }
}
