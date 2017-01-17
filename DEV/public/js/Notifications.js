window.document.onload = getNotifications();
function getNotifications() {
    $.ajax({
        url: '/api/notification/get',
        method: "POST",
        async: true,
        data: JSON.stringify({
            Since: moment(0, "HH"),
        }),
        contentType: "application/json",
        success: function ( data )
        {
            $('#alerts-list').empty();
            $('#alerts-list').fadeTo('slow', 0.1).fadeTo('slow', 1);
            $('#alerts-list').append(data);
            $('#alerts-container').slimScroll({ scrollTo : '999999999999px' });
            $('#alerts-container').slimScroll({ scrollTo : '999999999999px' });
        }
    });
}
