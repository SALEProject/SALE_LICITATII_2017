function DownloadDocument(id,Pid)
{
//   $.ajax({
//     url: "/api/download/downloadfile",
//     method: 'post',
//     async: true,
//     data: JSON.stringify({DocumentID: id,ProcedureID: Pid }),
//     contentType: "application/json",
//     success: function(data) {},
// })
    // target= _blank 
    document.body.innerHTML += '<form id=\'DLF2\' action=\'/api/download/downloadfile\' method=\'POST\'><input type=\'hidden\' name=\'DocumentID\' value='+id+'> <input type=\'hidden\' name=\'ProcedureID\' value='+ Pid +'></form>';
    document.getElementById("DLF2").submit();
    document.getElementById("DLF2").remove();
    $('#filter-start').datetimepicker({format: 'YYYY-MM-DD'});
    $('#filter-end').datetimepicker({format: 'YYYY-MM-DD'});
    $('#Form1ProcedureTendersOpeningDate').datetimepicker({format: 'YYYY-MM-DD HH:mm'});
    $('#Form1ProcedureTendersReceiptDeadline').datetimepicker({format: 'YYYY-MM-DD HH:mm'});
    $('#Form1ProcedureClarificationRequestsDeadline').datetimepicker({format: 'YYYY-MM-DD HH:mm'});
    // $('#alerts-container').slimScroll({
    //   start: 'bottom',
    //   height: '90px'
    // });
    // $('#my-procedures-scroller').slimScroll({
    //   height: '250px',
    //   start: 'bottom'
    // });
}

function NextTab(id)
{
  var nextStep = $('.nav-tabs > .active').next('li').find('a').attr('data-step');
  $("#form-2-link").removeClass('disabled');
  $("#form-3-link").removeClass('disabled');
  $("#form-4-link").removeClass('disabled');
  $("#form-5-link").removeClass('disabled');
  $("#form-6-link").removeClass('disabled');
  if( nextStep  > 1 && nextStep  < 6)
  {
    $("#procedure-form-"+nextStep).find("div[class*='text-center padding-20 loader']").show();
    $("#form-"+nextStep+"-content").empty();
    $('.nav-tabs > .active').next('li').find('a').tab('show');

    $.ajax({
        url: "/api/forms/get",
        method: 'post',
        async: true,
        data: JSON.stringify({id: id,step: nextStep }),
        contentType: "application/json",
        success: function(data)
                                {
                                  $("#procedure-form-"+nextStep).find("div[class*='text-center padding-20 loader']").hide();
                                  $("#form-"+nextStep+"-content").empty();
                                  $("#form-"+nextStep+"-content").append(data);
                                  // $("#procedure-form-"+nextStep).find('.text-center padding-20 loader').hide();
                                }
    })
  }

  else if(nextStep == 6)
        {
          $("#procedure-form-"+nextStep).find("div[class*='text-center padding-20 loader']").show();
          $("#form-"+nextStep+"-content").empty();
          $('.nav-tabs > .active').next('li').find('a').tab('show');

          $.ajax({
              url: "/api/forms/get",
              method: 'post',
              async: true,
              data: JSON.stringify({id: id,step: nextStep }),
              contentType: "application/json",
              success: function(data)
                                      {
                                        $("#procedure-form-"+nextStep).find("div[class*='text-center padding-20 loader']").hide();
                                        $("#form-"+nextStep+"-content").empty();
                                        $("#form-"+nextStep+"-content").append(data);
                                      }
          })
        }
  else {
      $('.nav-tabs > .active').next('li').find('a').tab('show');
  }
}


function PrevTab(id)
{
  var nextStep = $('.nav-tabs > .active').prev('li').find('a').attr('data-step');
  $("#form-2-link").removeClass('disabled');
  $("#form-3-link").removeClass('disabled');
  $("#form-4-link").removeClass('disabled');
  $("#form-5-link").removeClass('disabled');
  $("#form-6-link").removeClass('disabled');
  if( nextStep  > 1 && nextStep  < 6)
  {
    $("#procedure-form-"+nextStep).find("div[class*='text-center padding-20 loader']").show();
    $("#form-"+nextStep+"-content").empty();
    $('.nav-tabs > .active').prev('li').find('a').tab('show');

    $.ajax({
        url: "/api/forms/get",
        method: 'post',
        async: true,
        data: JSON.stringify({id: id,step: nextStep }),
        contentType: "application/json",
        success: function(data)
                                {
                                  $("#form-"+nextStep+"-content").empty();
                                  $("#form-"+nextStep+"-content").append(data);
                                  $("#procedure-form-"+nextStep).find("div[class*='text-center padding-20 loader']").hide();
                                }
    })
  }
  else {
          $('.nav-tabs > .active').prev('li').find('a').tab('show');
  }
}

function DownloadForm(id)
{
  if(id > 1 && id < 6)
  {
     var currentUrl = window.location.href;
    $('#form-'+id+'-content').children().find('input:text, input:password, input:file, select, textarea').each(function() {$(this).remove();});
    var DownloadContent = $("#form-"+id+"-content").html();
    var filename = $('.nav-tabs > .active').find('a').html()
    document.body.innerHTML += '<form id=\'DLF\' action=\'/api/download/get\' method=\'POST\'><input type=\'hidden\' name=\'content\' value=\''+ DownloadContent +'\' target="_blank"> <input type=\'hidden\' name=\'filename\' value=\''+ filename +'\'></form>';
    document.getElementById("DLF").submit();
    document.getElementById("DLF").remove();
  }
  else
  {
    console.log("invalid file download request");
  }
}


// function DownloadForm(id)
// {
//   if(id > 1 && id < 6)
//   {
//     $('#form-'+id+'-content').children().find('input:text, input:password, input:file, select, textarea').each(function() {$(this).remove();});
//     var data = $("#form-"+id+"-content").html();
//     $.post("/api/download/get", function ( data ) {
//         var win=window.open('/api/download/get');
//         with(win.document)
//         {
//           open();
//           write(data);
//           close();
//         }
//     });
//
//   }
//   else
//   {
//     console.log("invalid file download request");
//   }
// }


function evaluateProcedureType(element)
{
  var TotalValue = element.value;
  console.log("here");
      $.ajax({
          url: '/api/fillprocedureparams/post',
          method: 'post',
          async: true,
          data: JSON.stringify({
              Value: TotalValue,
          }),
          contentType: "application/json",
          success: function(reply)
              {
                reply = JSON.parse(reply);
                t1 = reply["T1"];
                t2 = reply["T2"];
                t3 = reply["T3"];
                $("#Form1ProcedureID_ProcedureType").val(reply['valID']);
                $('#Form1ProcedureClarificationRequestsDeadline').data("DateTimePicker").date(moment(t1,"YYYY-MM-DD"));
                $('#Form1ProcedureTendersReceiptDeadline').data("DateTimePicker").date(moment(t2,"YYYY-MM-DD"));
                $('#Form1ProcedureTendersOpeningDate').data("DateTimePicker").date(moment(t3,"YYYY-MM-DD"));
              }
      })
}

function btnShowAllProcedures() {
  document.getElementById("filter-keyword").value = "";
  $('procedure-form-container').hide();
  $('#procedureDetailToggle').hide();
  $('#catalog-produse').hide();
  $("#procedure-form-container").hide();
  $('#procedures-container').show();
  $("#procedures-list").children().css("display", "block");
}

function btnShowCatalog() {

  document.getElementById("filter-keyword").value = "";
  $('#procedures-container').hide();
  $('#procedure-form-container').hide();
  $('#procedureDetailToggle').hide();
  $('#procedures-container').hide();
  $('#catalog-produse').show();

}

function btnCreateNewProcedure() {
    $("#Form1").trigger("reset");
    $('.nav-tabs a:first').tab('show');
    $('#procedureDetailToggle').hide();
    document.getElementById('procedures-container').style.display = 'none';
    document.getElementById('procedure-form-container').style.display = 'block';
    $("#Form1").trigger("reset");
    $('#Form1ProcedureNameError').hide();
    $('#From1ProcedureDescriptionError').hide();
    $('#Form1ProcedureLocationError').hide();
    $('#Form1ProcedureDurationError').hide();
    $('#Form1ProcedureTotalValueError').hide();
    $('#catalog-produse').hide();
    $("#Form1ProcedureTotalValue").attr('onchange','evaluateProcedureType(this)');
    $('#nextbutton').attr('onclick', 'addProcedure()');
    $('#nextbutton').text("Mergi la pasul urmator");
    $('#From1ProcedureDescription').val('');
    $('.nav-tabs a:first').tab('show');
    $("#Form1").trigger("reset");
    $("#Form1").each(function(){
    $(this).find('textarea').val('')});
    var list = ["Name","Description","Location","Duration","TotalValue","ClarificationRequestsDeadline","TendersReceiptDeadline","TendersOpeningDate"];
    for (var i = 0; i < list.length; i++)
          {
            $('#Form1Procedure'+list[i]+'Error').hide();
          }
    };


function toggleProcedure(id)
{
    $('#procedure-' + id).toggleClass('procedure-item');
    $('#procedure-' + id).toggleClass('procedure-item expanded');
}

//
// function toggleShowProcedures() {
//     document.getElementById('procedure-form-container').style.display = 'none';
//     document.getElementById('procedures-container').style.display = 'block';
// }


function toggleDiv(id)
{
  $('#'+id).toggleClass('tile m-b-10 collapsed');
  $('#'+id).toggleClass('tile m-b-10');
}



$( function() {
  $.widget( "custom.combobox", {
    _create: function() {
      this.wrapper = $( "<span>" )
        .addClass( "custom-combobox" )
        .insertAfter( this.element );

      this.element.hide();
      this._createAutocomplete();
      // this._createShowAllButton();
    },

    _createAutocomplete: function() {
      var selected = this.element.children( ":selected" ),
        value = selected.val() ? selected.text() : "";

      this.input = $( "<input>" )
        .appendTo( this.wrapper )
        .val( value )
        .attr( "title", "" )
        .addClass( "form-control input-sm required" )
        .autocomplete({
          delay: 0,
          minLength: 0,
          source: $.proxy( this, "_source" )
        })
        .tooltip({
          classes: {
            "ui-tooltip": "ui-state-highlight"
          }
        });

      this._on( this.input, {
        autocompleteselect: function( event, ui ) {
          ui.item.option.selected = true;
          this._trigger( "select", event, {
            item: ui.item.option
          });
        },

        autocompletechange: "_removeIfInvalid"
      });
    },

    _source: function( request, response ) {
      var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
      response( this.element.children( "option" ).map(function() {
        var text = $( this ).text();
        if ( this.value && ( !request.term || matcher.test(text) ) )
          return {
            label: text,
            value: text,
            option: this
          };
      }) );
    },

    _removeIfInvalid: function( event, ui ) {

      // Selected an item, nothing to do
      if ( ui.item ) {
        return;
      }

      // Search for a match (case-insensitive)
      var value = this.input.val(),
        valueLowerCase = value.toLowerCase(),
        valid = false;
      this.element.children( "option" ).each(function() {
        if ( $( this ).text().toLowerCase() === valueLowerCase ) {
          this.selected = valid = true;
          return false;
        }
      });

      // Found a match, nothing to do
      if ( valid ) {
        return;
      }

      // Remove invalid value
      this.input
        .val( "" )
        .attr( "title", value + " didn't match any item" )
        .tooltip( "open" );
      this.element.val( "" );
      this._delay(function() {
        this.input.tooltip( "close" ).attr( "title", "" );
      }, 2500 );
      this.input.autocomplete( "instance" ).term = "";
    },

    _destroy: function() {
      this.wrapper.remove();
      this.element.show();
    }
  });

  $( "#combobox" ).combobox();
  $( "#toggle" ).on( "click", function() {
    $( "#combobox" ).toggle();
  });
} );


// function DownloadForm(id)
// {
//   // onclick="DownloadForm(form-2);
//   console.log("#"+id)
//   var code = $("#"+id).html();
//   code = code.replace(/<\/?span[^>]*>/g,"");
//     code = code.replace(/<\/?textarea[^>]*>/g,"");
//   // console.log($("#"+id).html());
//   $.ajax({
//       url: '/api/download/post',
//       method: 'post',
//       async: true,
//       data: JSON.stringify({
//           Contents: code,
//       }),
//       contentType: "application/json",
//       success: function(reply) {console.log(reply)}
//   })
// }

// $(window).load(function() {
// $(".wizard-form-step").click(function(e) {
//   e.preventDefault();
//   if($(this).hasClass('disabled')) {
//     return false;
//   }
//   else {
//     console.log(this);
//   }
// });
// });


// // NAVIGATE CLICK TABS
//
// $(function () {
//     $('.nav-tabs a').click(function (e) {
//         e.preventDefault();
//         if($(this).hasClass('disabled')) {
//               return false;
//         }
//         else
//         {
//           var step = $(this).attr('data-step');
//           // if(step != 1) $("#form-1-link").addClass('disabled');
//           $('a[href="' + $(this).attr('href') + '"]').tab('show');
//           console.log($(this).attr('data-step'));
//           if( step > 1 && step < 6)
//           {
//             console.log("would generate");
//             $.ajax({
//                 url: "/api/forms/get",
//                 method: 'post',
//                 async: true,
//                 data: JSON.stringify({id: 4192,step: step}),
//                 contentType: "application/json",
//                 success: function(data)
//                                         {
//                                           $("#form-"+step+"-content").empty();
//                                           $("#form-"+step+"-content").append(data);
//                                         }
//             })
//           }
//
//         }
//
//     })
// });
//
// // NAVIGATE CLICK TABS
//
// $(function () {
//     $('.nav-tabs a').click(function (e) {
//         e.preventDefault();
//         if($(this).hasClass('disabled')) {
//               return false;
//         }
//         else
//         {
//           var step = $(this).attr('data-step');
//           // if(step != 1) $("#form-1-link").addClass('disabled');
//           $('a[href="' + $(this).attr('href') + '"]').tab('show');
//           console.log($(this).attr('data-step'));
//           if( step > 1 && step < 6)
//           {
//             console.log("would generate");
//             $.ajax({
//                 url: "/api/forms/get",
//                 method: 'post',
//                 async: true,
//                 data: JSON.stringify({id: 4192,step: step}),
//                 contentType: "application/json",
//                 success: function(data)
//                                         {
//                                           $("#form-"+step+"-content").empty();
//                                           $("#form-"+step+"-content").append(data);
//                                         }
//             })
//           }
//
//         }
//
//     })
// });
//



// function NextTab()
// {
//   $("#form-2-link").removeClass('disabled');
//   $("#form-3-link").removeClass('disabled');
//   $("#form-4-link").removeClass('disabled');
//   $("#form-5-link").removeClass('disabled');
//   $("#form-6-link").removeClass('disabled');
//    var step = $('.nav-tabs > .active').next('li').find('a').attr('href');
//    $('.nav-tabs > .active').next('li').find('a').trigger('click');
// }
//
// function PrevTab()
// {
//     $('.nav-tabs > .active').prev('li').find('a').trigger('click');
// }


// function NT(id)
// {
//   // $('.nav-tabs a:first').tab('show')
//   // $('.nav-pills > li.active')
//   // $('.nav-tabs > .active').prev('li').find('a').trigger('click');
//   var step = $('.nav-tabs > .active').find('a').attr('data-step');
  // if( step > 1 && step < 6)
  // {
  //   console.log("generating");
  //   $("#form-2-link").removeClass('disabled');
  //   $("#form-3-link").removeClass('disabled');
  //   $("#form-4-link").removeClass('disabled');
  //   $("#form-5-link").removeClass('disabled');
  //   $("#form-6-link").removeClass('disabled');
  //
  //   $.ajax({
  //       url: "/api/forms/get",
  //       method: 'post',
  //       async: true,
  //       data: JSON.stringify({id: 4192,step: step}),
  //       contentType: "application/json",
  //       success: function(data)
  //                               {
  //                                 $('.nav-tabs > .active').next('li').find('a').trigger('click');
                                  // $("#form-"+step+"-content").empty();
                                  // $("#form-"+step+"-content").append(data);
  //                               }
  //   })
  // }
//
// }
