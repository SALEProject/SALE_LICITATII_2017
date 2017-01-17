window.document.onload = getServerTime();
var time;
var today;
function getServerTime() {
  $.ajax({
      url: '/api/time/get',
       method: "GET",
       async: true,
       success: function(data){
                var serverTime = Date.parse(data);
                var clientTime = new Date().getTime();
                var timeDifference = clientTime - serverTime;
                var timer = (clientTime+timeDifference);
                setInterval(function(){ timer = (timer+1000); document.getElementById("servertime").innerHTML = moment(timer).format('HH:mm:ss'); time=moment(timer).format(); today=moment(time).startOf("day").format();}, 1000);
              }
       });
}
