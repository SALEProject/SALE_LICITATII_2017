window.document.onload = getProcedures();
// getProcedureVariablesData();

function getProcedures() {
    $.ajax({
        url: '/api/procedure/get',
        method: "GET",
        async: true,
        success: function (data) {
                          $("#procedures-loader").remove();
                          $('#procedures-list').empty();
                          $('#procedures-list').append(data.Procedures);
                          $("#my-procedures-loader").remove();
                          $('#my-procedures-list').empty();
                          $('#my-procedures-list').append(data.myProcedures);
                          $('#favourite-procedures-list').empty();
                          $('#favourite-procedures-list').append(data.favProcedures);
                          console.log("Get and got: Procedures "+data.Procedures.length);
        }
    });
};


function getProcedureVariablesData(id)
{
  $.ajax({
      url: '/api/editProcedure/variables',
      method: "post",
      async: true,
      data: {"id":id},
      success: function (data) {
                        // console.log("FROM TEST"+JSON.stringify(data));
                        // $('#Form1').children().find('input:text, input:password, input:file, select, textarea').each(function() {$(this).remove();});
                        $("#Form1ProcedureTotalValue").attr('onchange','');
                        $('.nav-tabs a:first').tab('show');
                        $("#procedure-detail-container").hide();
                        $("#procedure-form-container").show();
                        for (var i = 0; i < data.length; i++) {
                          if(data[i].Key == "@Options.ClarificationRequestsDeadline")
                          {
                            $('#Form1ProcedureClarificationRequestsDeadline').datetimepicker({
                              defaultDate: data[i].Value});
                              //defaultDate: new Date(data[i].Value).getTime()});
                          }
                          else if(data[i].Key == "@Options.TendersReceiptDeadline")
                          {
                            $('#Form1ProcedureTendersReceiptDeadline').datetimepicker({
                              defaultDate: data[i].Value});
                          }
                          else if(data[i].Key == "@Options.TendersOpeningDate")
                          {
                            $('#Form1ProcedureTendersOpeningDate').datetimepicker({
                              defaultDate: data[i].Value});
                          }
                          else{
                            $( "input[rel='"+data[i].Key+"'],textarea[rel='"+data[i].Key+"']").val(data[i].Value);
                            $( "input[rel='"+data[i].Key+"'],textarea[rel='"+data[i].Key+"']").text(data[i].Value);
                            $( 'select[rel="'+data[i].Key+'"]').val(data[i].Value).attr("selected", true);
                            $( 'select[rel="'+data[i].Key+'"]').val(data[i].Value);
                            $('#nextbutton').attr('onclick', 'EditProc('+id+')');
                            $('.nav-tabs a:first').tab('show');
                            $('.nav-tabs a:first').tab('show');
                          }
                        }
      }
  });
};

function deleteProcedure(ID_Procedure) {

    $("#dialog").dialog({
        title: "Confirmati",
        open: function (event, ui) {
            var Question = 'Esti sigur ca vrei sa stergi procedura?';
            $(this).html(Question);
            $(".ui-widget-overlay").css({
                opacity: 0.7,
                filter: "Alpha(Opacity=100)",
                backgroundColor: "black",
                zIndex: 999
            });
        },
        modal: true
    });

    $("#dialog").dialog({
        buttons: [
            { text: "Da", click: function ()
                {
                    $.ajax({
                        url: "/api/procedure/delete",
                        method: 'post',
                        async: true,
                        data: JSON.stringify({
                            ID: ID_Procedure
                        }),
                        contentType: "application/json",
                        success:    function() {
                            $("#my-procedure-" + ID_Procedure).remove();
                            $("#procedure-" + ID_Procedure).remove();
                            $('#dialog').dialog( "close" );
                            $("#procedureDetailToggle").empty();}
                    })
                 }, style:"color:white;background-color:#99BB22;min-width: 100px;"},
            { text: "Nu", click: function () { $( this ).dialog( "close" ); }, style:"color:white;background-color:#ACACAC;min-width: 100px;"}
        ]
    }).prev(".ui-dialog-titlebar").css({background:"white",border:"none"})
    $(".ui-dialog-buttonpane").css({'text-align': 'center'});
    $(".ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset").css({'float': 'none',"align-items": "center"});
    $("#dialog").addClass('text-center');
    $(".ui-widget-content").css({'border': "none"});

 }
//

// function ProcessProcedureForm(id)
function EditProc(id)
    {
        var NewFormProcedure = {};

        NewFormProcedure.SubmitTime = moment().format();
        NewFormProcedure.Name = $('#Form1ProcedureName').val();
        NewFormProcedure.Description = $('#Form1ProcedureDescription').val();
        NewFormProcedure.Location = $('#Form1ProcedureLocation').val();
        NewFormProcedure.Legislation = $('#Form1ProcedureLegislation option:selected').val();
        NewFormProcedure.Duration = $('#Form1ProcedureDuration').val();
        NewFormProcedure.TotalValue = $('#Form1ProcedureTotalValue').val();
        NewFormProcedure.ID_ContractType = $('#Form1ProcedureID_ContractType').val();
        NewFormProcedure.ID_ProcedureType = $('#Form1ProcedureID_ProcedureType option:selected').val();
        NewFormProcedure.ID_ProcedureCriterion = $('#Form1ProcedureID_ProcedureCriterion').val();
        NewFormProcedure.Forms = $('#Form1ProcedureForms').val();
        NewFormProcedure.EconomicCapacity = $('#Form1ProcedureEconomicCapacity').val();
        NewFormProcedure.TechnicalCapacity = $('#Form1ProcedureTechnicalCapacity').val();
        NewFormProcedure.ClarificationRequestsDeadline = new Date($('#Form1ProcedureClarificationRequestsDeadline').val());
        NewFormProcedure.TendersReceiptDeadline = new Date($('#Form1ProcedureTendersReceiptDeadline').val());
        NewFormProcedure.TendersOpeningDate = new Date($('#Form1ProcedureTendersOpeningDate').val());
        NewFormProcedure.ContestationsSubmission = $('#Form1ProcedureContestationsSubmission').val();
        NewFormProcedure.OtherInformation = $('#Form1ProcedureOtherInformation').val();
        NewFormProcedure.Necessity = $('#Form1ProcedureNecessity').val();
        NewFormProcedure.ClassificationIDs = $('#Form1ProcedureClassificationIDs').val();

        //Regex

        var list = ["Name","Description","Location","Duration","TotalValue","ClarificationRequestsDeadline","TendersReceiptDeadline","TendersOpeningDate"];

        var erori = false;
        for (var i = 0; i < list.length; i++) {
              if($('#Form1Procedure'+list[i]).val() == "" || $('#Form1Procedure'+list[i]).val() == 'undefined')
              {
                $('#Form1Procedure'+list[i]+'Error').show();
                erori = true;
              }
              else {
                $('#Form1Procedure'+list[i]+'Error').hide();
              }
        }

        if(erori == true)
        alert("Aveti campuri necompletate!");
else
{
  // console.log(NewFormProcedure);
          $.ajax({
              url: "/api/editprocedure/edit",
              method: 'post',
              async: true,
              data: JSON.stringify({
                "ID": id,
                "SubmitTime": moment().format(),
                "Name": NewFormProcedure.Name,
                "Description": NewFormProcedure.Description,
                "Location":  NewFormProcedure.Location,
                "Legislation": NewFormProcedure.Legislation,
                "Duration": NewFormProcedure.Duration,
                "TotalValue": NewFormProcedure.TotalValue,
                "ID_ContractType": NewFormProcedure.ID_ContractType,
                "ID_ProcedureType": NewFormProcedure.ID_ProcedureType,
                "ID_ProcedureCriterion": NewFormProcedure.ID_ProcedureCriterion,
                "Forms": NewFormProcedure.Forms,
                "EconomicCapacity": NewFormProcedure.EconomicCapacity,
                "TechnicalCapacity": NewFormProcedure.TechnicalCapacity,
                "ClarificationRequestsDeadline": NewFormProcedure.ClarificationRequestsDeadline,
                "TendersReceiptDeadline": NewFormProcedure.TendersReceiptDeadline,
                "TendersOpeningDate": NewFormProcedure.TendersOpeningDate,
                "ContestationsSubmission": NewFormProcedure.ContestationsSubmission,
                "OtherInformation": NewFormProcedure.OtherInformation,
                "Necessity": NewFormProcedure.Necessity,
                "ClassificationIDs": [1289,1692]
            }),
            contentType: "application/json",
            success: function (data) {
              // console.log(data);
              $('button[name="navigationButtonNext"]').each(function()
               {
                   $(this).attr('onclick', 'NextTab('+id+')');
               });
               $('button[name="navigationButtonPrev"]').each(function()
                {
                    $(this).attr('onclick', 'PrevTab('+id+')');
                });
                NextTab(id);
            }
})
}
}


function generateDetails(id)
    {
        $.ajax({
            url: "/test",
            method: 'post',
            async: true,
            data: JSON.stringify({'id':id}),
            contentType: "application/json",
            success: function(data)
                      {
                        $('#procedures-container').hide();
                        $('#procedureDetailToggle').empty();
                        $('#procedureDetailToggle').append( data );
                        $('#procedure-form-container').hide();
                        $("#Form1").trigger("reset");
                        $("#Form1").each(function(){$(this).find('textarea').val('')});
                        $('#procedureDetailToggle').show();
                        var list = ["Name","Description","Location","Duration","TotalValue","ClarificationRequestsDeadline","TendersReceiptDeadline","TendersOpeningDate"];
                        for (var i = 0; i < list.length; i++)
                              {
                                $('#Form1Procedure'+list[i]+'Error').hide();
                              }
                        }
                  })
    }

    function addProcedure()
        {
            var NewFormProcedure = {};

            NewFormProcedure.SubmitTime = moment().format();
            NewFormProcedure.Name = $('#Form1ProcedureName').val();
            NewFormProcedure.Description = $('#Form1ProcedureDescription').val();
            NewFormProcedure.Location = $('#Form1ProcedureLocation').val();
            NewFormProcedure.Legislation = $('#Form1ProcedureLegislation option:selected').val();
            NewFormProcedure.Duration = $('#Form1ProcedureDuration').val();
            NewFormProcedure.TotalValue = $('#Form1ProcedureTotalValue').val();
            NewFormProcedure.ID_ContractType = $('#Form1ProcedureID_ContractType').val();
            NewFormProcedure.ID_ProcedureType = $('#Form1ProcedureID_ProcedureType option:selected').val();
            NewFormProcedure.ID_ProcedureCriterion = $('#Form1ProcedureID_ProcedureCriterion').val();
            NewFormProcedure.Forms = $('#Form1ProcedureForms').val();
            NewFormProcedure.EconomicCapacity = $('#Form1ProcedureEconomicCapacity').val();
            NewFormProcedure.TechnicalCapacity = $('#Form1ProcedureTechnicalCapacity').val();
            NewFormProcedure.ClarificationRequestsDeadline = new Date($('#Form1ProcedureClarificationRequestsDeadline').val());
            NewFormProcedure.TendersReceiptDeadline = new Date($('#Form1ProcedureTendersReceiptDeadline').val());
            NewFormProcedure.TendersOpeningDate = new Date($('#Form1ProcedureTendersOpeningDate').val());
            NewFormProcedure.ContestationsSubmission = $('#Form1ProcedureContestationsSubmission').val();
            NewFormProcedure.OtherInformation = $('#Form1ProcedureOtherInformation').val();
            NewFormProcedure.Necessity = $('#Form1ProcedureNecessity').val();
            NewFormProcedure.ClassificationIDs = $('#Form1ProcedureClassificationIDs').val();


            var list = ["Name","Description","Location","Duration","TotalValue","ClarificationRequestsDeadline","TendersReceiptDeadline","TendersOpeningDate"];

            var errors = false;
            for (var i = 0; i < list.length; i++) {
                  if($('#Form1Procedure'+list[i]).val() == "" || $('#Form1Procedure'+list[i]).val() == 'undefined' || $('#Form1Procedure'+list[i]).val() == " ")
                  {
                    $('#Form1Procedure'+list[i]+'Error').show();
                    errors = true;
                  }
                  else {
                    $('#Form1Procedure'+list[i]+'Error').hide();
                  }
            }

            if(errors != false)
            alert("Aveti campuri necompletate!");
    else
    {
      console.log(NewFormProcedure);
              $.ajax({
                  url: "/api/procedure/add",
                  method: 'post',
                  async: true,
                  data: JSON.stringify({
                    "SubmitTime": moment().format(),
                    "Name": NewFormProcedure.Name,
                    "Description": NewFormProcedure.Description,
                    "Location":  NewFormProcedure.Location,
                    "Legislation": NewFormProcedure.Legislation,
                    "Duration": NewFormProcedure.Duration,
                    "TotalValue": NewFormProcedure.TotalValue,
                    "ID_ContractType": NewFormProcedure.ID_ContractType,
                    "ID_ProcedureType": NewFormProcedure.ID_ProcedureType,
                    "ID_ProcedureCriterion": NewFormProcedure.ID_ProcedureCriterion,
                    "Forms": NewFormProcedure.Forms,
                    "EconomicCapacity": NewFormProcedure.EconomicCapacity,
                    "TechnicalCapacity": NewFormProcedure.TechnicalCapacity,
                    "ClarificationRequestsDeadline": NewFormProcedure.ClarificationRequestsDeadline,
                    "TendersReceiptDeadline": NewFormProcedure.TendersReceiptDeadline,
                    "TendersOpeningDate": NewFormProcedure.TendersOpeningDate,
                    "ContestationsSubmission": NewFormProcedure.ContestationsSubmission,
                    "OtherInformation": NewFormProcedure.OtherInformation,
                    "Necessity": NewFormProcedure.Necessity,
                    "ClassificationIDs": [1289,1692]
                }),
                contentType: "application/json",
                success: function (data) {
                   console.log("ADDED AND GOT THE ID:"+data);
                   NextTab(data);
                   $('button[name="navigationButtonNext"]').each(function()
                    {
                        $(this).attr('onclick', 'NextTab('+data+')');
                    });
                    $('button[name="navigationButtonPrev"]').each(function()
                     {
                         $(this).attr('onclick', 'PrevTab('+data+')');
                     });
                   setTimeout(function(){getProcedures();}, 1500);
                }
    })
    }
}

            // else
            //     {
            //         $.ajax({
            //             url: "/api/procedure/add",
            //             method: 'post',
            //             async: true,
            //             data: JSON.stringify({
                        //     "SubmitTime": moment().format(),
                        //     "Name": NewFormProcedure.Name,
                        //     "Description": NewFormProcedure.Description,
                        //     "Location":  NewFormProcedure.Location,
                        //     "Legislation": NewFormProcedure.Legislation,
                        //     "Duration": NewFormProcedure.Duration,
                        //     "TotalValue": NewFormProcedure.TotalValue,
                        //     "ID_ContractType": NewFormProcedure.ID_ContractType,
                        //     "ID_ProcedureType": NewFormProcedure.ID_ProcedureType,
                        //     "ID_ProcedureCriterion": NewFormProcedure.ID_ProcedureCriterion,
                        //     "Forms": NewFormProcedure.Forms,
                        //     "EconomicCapacity": NewFormProcedure.EconomicCapacity,
                        //     "TechnicalCapacity": NewFormProcedure.TechnicalCapacity,
                        //     "ClarificationRequestsDeadline": NewFormProcedure.ClarificationRequestsDeadline,
                        //     "TendersReceiptDeadline": NewFormProcedure.TendersReceiptDeadline,
                        //     "TendersOpeningDate": NewFormProcedure.TendersOpeningDate,
                        //     "ContestationsSubmission": NewFormProcedure.ContestationsSubmission,
                        //     "OtherInformation": NewFormProcedure.OtherInformation,
                        //     "Necessity": NewFormProcedure.Necessity,
                        //     "ClassificationIDs": [
                        //         2088,
                        //         1290
                        //     ]
                        // }),
                        // contentType: "application/json",
                        // success: function (data) {
            //                 setTimeout(function(){
            //                         console.log("Requesting after 2 seconds")
            //                         getProcedures();
            //                     }, 2000);
            //                     setTimeout(function(){
            //                             console.log("Requesting after 5 seconds")
            //                             getProcedures();
            //                         }, 50000);
            //                         setTimeout(function(){
            //                                 console.log("Requesting after 7 seconds")
            //                                 getProcedures();
            //                             }, 7000);
            //             }

            // var id = 4192;
            // var step = 2;
            //




    // function DrawWizardForm(id,step)
    // {
    //   $.ajax({
    //       url: "/api/forms/get",
    //       method: 'post',
    //       async: true,
    //       data: JSON.stringify({id: id,step: step}),
    //       contentType: "application/json",
    //       success: function(data)
    //                               {
    //                                 $("#form-2-content").empty();
    //                                 $("#form-2-content").append(data);
    //                               }
    //   })
    // }

    // console.log(new Date(data[i].Value));
    // console.log(data[i].Value);
    // console.log(moment(data[i].Value).format('MMMM Do YYYY, h:mm:ss a'));
    // $('#Form1ProcedureClarificationRequestsDeadline').data("DateTimePicker").date(new Date(data[i].Value));
    // $('#Form1ProcedureClarificationRequestsDeadline').data("DateTimePicker").date(new Date("2015-09-24 11:00:00"));
    // $('#Form1ProcedureClarificationRequestsDeadline').datetimepicker({
    //   "defaultDate":new Date(")})                                                          "1443081600000
                                                                                        //"1423081600000

    // function getProcedureForms(FormID) {
    //     console.log(FormID);
    //     $.ajax({
    //         url: '/api/forms/get',
    //         method: 'POST',
    //         async: true,
    //         data: JSON.stringify({"ID":4192,"FormID": FormID}),
    //         contentType: "application/json",
    //         success: function (data) {
    //                           $('#form-'+FormID+'-content').append(data);
    //                           // console.log(data);
    //         }
    //     });
    // };
    //
    // getProcedureForms(2);
    // window.document.onload = getProcedures();
    // var CachedProcedures = [];
    // var GlobalBrokerID = $("#brk").val()
    //
    // function getProcedures() {
    //     $.ajax({
    //         url: '/api/procedure/get',
    //         method: "GET",
    //         async: true,
    //         success: function (data) {
    //             var FilteredCachedProcedures = [];
    //             $('#procedures-list').empty();
    //             $('#procedures-loader').remove();
    //             var toAppend = '';
    //             $.each(data, function (i, res) {
    //                 if(res.Status == 'approved' || res.ID_Broker == $("#brk").val())
    //                     {
    //                         FilteredCachedProcedures.push(res);
    //                         switch (res.ID_ProcedureType)
    //                         {
    //                             case 1:
    //                                 var ModifiedProcedureStatus = 'achizitie directa';
    //                                 break;
    //                             case 2:
    //                                 var ModifiedProcedureStatus = 'cerere oferta';
    //                                 break;
    //                             case 3:
    //                                 var ModifiedProcedureStatus = 'licitatie deschisa';
    //                                 break;
    //                             default:
    //                                 var ModifiedProcedureStatus = 'lipsa detalii';
    //                                 break;
    //                         }
    //                           console.log(JSON.parse(res.ClassificationIDs.replace(/\s/g, "")));
    //                         toAppend += '<li id="procedure-' + res.ID + '" class="procedure-item">' +
    //                             '    <div class="row">' +
    //                             '        <div class="col-md-5 toggle-procedure" onclick=toggleProcedure(' + res.ID + ')><a class="procedure-name">' + res.Name + '</a>' +
    //                             '            <div class="procedure-details"><span class="procedure-location">' + res.Location + '</span>&nbsp;|&nbsp;<span class="procedure-classification"> ' + res.ClassificationIDs.replace(/\s/g, "")  + ' </span>&nbsp;|&nbsp;<span class="procedure-legislation">' + res.Legislation + '</span>' +
    //                             '            </div>' +
    //                             '        </div>' +
    //                             '       <div id="procedure-detail-status">' +
    //                             '        <div class="col-md-1"><span class="procedure-type ' + ModifiedProcedureStatus.toLowerCase().replace (/ /g, "_") + '">' + ModifiedProcedureStatus + '</span>' +
    //                             '        </div>' +
    //                             '        <div class="col-md-1">' +
    //                             '            <a id="isFav-' + res.ID + '" class="procedure-favourite " title="Add_favorite" data-title="Add_favorite" style="cursor:pointer !important;" onclick=setFavouriteProcedure(' + res.ID + ')></a>' +
    //                             '        </div>' +
    //                             '        <div class="col-md-1"><span class="procedure-status ' + res.Status + '" title="' + res.Status + '"></span>' +
    //                             '        </div>' +
    //                             '        <div class="col-md-3">' +
    //                             '            <p class="procedure-time">Lansare<span class="procedure-launch">' + moment (res.TendersOpeningDate).format ("YYYY-MM-DD HH:mm") + '</span>' +
    //                             '            </p>' +
    //                             '            <p class="procedure-time">Clarificari pana la<span class="procedure-clarifications-deadline">' + moment (res.ClarificationRequestsDeadline).format ("YYYY-MM-DD HH:mm") + '</span>' +
    //                             '            </p>' +
    //                             '            <p class="procedure-time">Termen depunere<span class="procedure-deadline">' + moment (res.TendersReceiptDeadline).format ("YYYY-MM-DD HH:mm") + '</span>' +
    //                             '            </p>' +
    //                             '        </div>' +
    //                             '       </div>' +
    //                             '        <div class="col-md-1"><a class="toggle-procedure collapse" onclick=toggleProcedure(' + res.ID + ')>&nbsp;</a>' +
    //                             '        </div>' +
    //                             '        <div class="col-md-12 procedure-expandable">' +
    //                             '            <div class="row">' +
    //                             '                <div class="col-md-5">' +
    //                             '                    <p class="procedure-description">' + res.Description + '</p>' +
    //                             '                </div>' +
    //                             '                <div class="col-md-6 procedure-offer-details">' +
    //                             '                    <div class="row">' +
    //                             '                        <div class="col-md-3">' +
    //                             '                            <p><strong>Clarificari</strong>' +
    //                             '                            </p>' +
    //                             '                            <p class="procedure-clarifications"></p>' +
    //                             '                      </div>' +
    //                             '                        <div class="col-md-4">' +
    //                             '                            <p><strong>Depuneri oferte</strong>' +
    //                             '                            </p>' +
    //                             '                            <p class="procedure-submission"></p>' +
    //                             '                        </div>' +
    //                             '                        <div class="col-md-5">' +
    //                             '                            <p><strong>Autoritate contractanta</strong>' +
    //                             '                            </p>' +
    //                             '                            <p class="procedure-contracter">' + res.OrganizationName + '</p>' +
    //                             '                        </div>' +
    //                             '                    </div><a class="view-procedure btn btn-default" style="cursor: pointer" onclick="generateDetails(' + res.ID + ')">Detalii licitatie</a>' +
    //                             '                </div>' +
    //                             '            </div>' +
    //                             '        </div>' +
    //                             '    </div>' +
    //                             '</li>'
    //                     }});
    //             CachedProcedures = FilteredCachedProcedures;
    //             $('#procedures-list').append(toAppend);
    //             getMyProcedures(CachedProcedures);
    //             getFavouriteProcedures();
    //         }
    //     });
    // }
    //
    //
    // function getMyProcedures(crawl) {
    //     var toAppend = '';
    //     if (typeof crawl !== 'undefined')
    //         {
    //             $("#my-procedures-loader").remove();
    //             $('#my-procedures-list').empty();
    //             for (var i = 0, len = crawl.length; i < len; i++)
    //                 {
    //                     if (crawl[i].ID_Broker == $("#brk").val())
    //                         {
    //                             toAppend += '<li class="procedure-item" id=my-procedure-' + crawl[i].ID + '>' +
    //                                 '<a class="view-procedure" style="cursor: pointer" onclick="generateDetails(' + crawl[i].ID + ')"><span class="procedure-name">' + crawl[i].Name + '</span>' +
    //                                 '<span class="procedure-status ' + crawl[i].Status + '" title="draft">&nbsp;</span>' +
    //                                 '</a><a class="delete-procedure" style="cursor:pointer !important;" onclick="deleteProcedure(' + crawl[i].ID +')">Anuleaza</a>' +
    //                                 '</li>';
    //                         }
    //                 }
    //             $('#my-procedures-list').append(toAppend);
    //           };
    // }
    //
    //
    // function generateDetails(id)
    //     {
    //         $('#procedure-form-container').hide();
    //         var toAppend = '';
    //         $.each(CachedProcedures, function (i, res) {
    //             if(res.ID == id)
    //                 {
    //                     toAppend += '<div class="tile m-b-10 data-container procedure-item" id="procedure-detail-container" style="display: block;">'+
    //                     '    <div class="tile-title">'+
    //                     '    <h5 class="no-margin m-b-10 bold"><span id="detail-name" class="procedure-name">' + res.Name + '</span></h5>'+
    //                     '<br>'+
    //                     '</div>'+
    //                     '<div class="tile-body">'+
    //                     '    <div class="row procedure-details-holder">'+
    //                     '    <div class="col-md-5">'+
    //                     '    <p id="detail-description" class="procedure-description">' + res.Description + '</p>'+
    //                     '<div id="detail-documents" class="procedure-documents"></div>'+
    //                     '    </div>'+
    //                     '    <div class="col-md-6">'+
    //                     '    <div id="detail-status" class="row">'+
    //                     '</div>'+
    //                     '</div>'+
    //                     '</div>'+
    //                     '<div class="clearfix"></div>'+
    //                     '    <div class="js-clarification-request-container col-md-6 col-xs-12" style="display: none;">'+
    //                     '    <div class="tile-title">'+
    //                     '    <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Clarification_request</span></h5>'+
    //                     '    <br>'+
    //                     '    </div>'+
    //                     '    <div class="tile-body">'+
    //                     '    <input type="file" name="doc" id="js-clarification-file">'+
    //                     '    <input type="button" class="btn btn-success btn-cons js-clarification-start-upload" value="Submit">'+
    //                     '    </div>'+
    //                     '    <div class="clearfix"></div>'+
    //                     '    </div>'+
    //                     '    <div class="js-offer-container col-md-6 col-xs-12">'+
    //                     '   <div class="tile-title">'+
    //                     '   <h5 class="no-margin m-b-10 bold"><span class="procedure-name">Offer</span></h5>'+
    //                     '   <br>'+
    //                     '   </div>'+
    //                     '   <div class="tile-body">'+
    //                     '   <input type="file" name="offer_doc" id="js-offer-file">'+
    //                     '   <input type="text" name="offer_price" class="js-offer-input" data-field="Price" placeholder="Pret"><br><br>'+
    //                     '   <input type="text" name="offer_deadline" class="js-offer-input" data-field="Deadline" placeholder="Delivery_deadline"><br><br>'+
    //                     '   <input type="button" class="btn btn-success btn-cons js-offer-start-upload" value="Submit">'+
    //                     '   </div>'+
    //                     '   <div class="clearfix"></div>'+
    //                     '   </div>'+
    //                     '   <div class="clearfix"></div>'+
    //                     '</div>'+
    //                     '</div>'
    //                 }
    //         })
    //         $('#procedures-container').hide();
    //         $('#procedureDetailToggle').empty();
    //         $('#procedureDetailToggle').append(toAppend);
    //         $('#procedure-'+id).find( "#procedure-detail-status" ).children().clone().appendTo( "#detail-status" );
    //         $('#detail-status').children().eq(1).children().eq(0).attr('id','detail-isFav-'+id);
    //         $("#detail-status").find(".col-md-1").removeClass("col-md-1").addClass("col-md-2");
    //         $("#detail-status").find(".col-md-3").removeClass("col-md-3").addClass("col-md-6");
    //         $('#procedureDetailToggle').show();
    //
    //     }
    //
    // function getProcedureValues() {
    //
    //     var NewProcedure = {
    //         Name: ""
    //         , Description: ""
    //         , Location: ""
    //         , Legislation: ""
    //         , Duration: ""
    //         , TotalValue: ""
    //         , ID_ContractType: ""
    //         , ID_ProcedureType: ""
    //         , ID_ProcedureCriterion: ""
    //         , cpv: ""
    //         , Forms: ""
    //         , EconomicCapacity: ""
    //         , TechnicalCapacity: ""
    //         , ClarificationRequestsDeadline: ""
    //         , TendersReceiptDeadline: ""
    //         , TendersOpeningDate: ""
    //         , ContestationsSubmission: ""
    //         , OtherInformation: ""
    //         , Necessity: ""
    //     };
    //
    //     NewProcedure.Name = $('#procedure-Name').val();
    //     NewProcedure.Description = $('#procedure-Description').val();
    //     NewProcedure.Location = $('#procedure-Location').val();
    //     NewProcedure.Legislation = $('#procedure-Legislation').val();
    //     NewProcedure.Duration = $('#procedure-Duration').val();
    //     NewProcedure.TotalValue = $('#procedure-TotalValue').val();
    //     NewProcedure.ID_ContractType = $('#procedure-ID_ContractType').val();
    //     NewProcedure.ID_ProcedureType = $('#procedure-ID_ProcedureType').val();
    //     NewProcedure.ID_ProcedureCriterion = $('#procedure-ID_ProcedureCriterion').val();
    //     NewProcedure.cpv = $('#procedure-cpv').val();
    //     NewProcedure.Forms = $('#procedure-Forms').val();
    //     NewProcedure.EconomicCapacity = $('#procedure-EconomicCapacity').val();
    //     NewProcedure.TechnicalCapacity = $('#procedure-TechnicalCapacity').val();
    //     NewProcedure.ClarificationRequestsDeadline = $('#procedure-ClarificationRequestsDeadline').val();
    //     NewProcedure.TendersReceiptDeadline = $('#procedure-TendersReceiptDeadline').val();
    //     NewProcedure.TendersOpeningDate = $('#procedure-TendersOpeningDate').val();
    //     NewProcedure.ContestationsSubmission = $('#procedure-ContestationsSubmission').val();
    //     NewProcedure.OtherInformation = $('#procedure-OtherInformation').val();
    //     NewProcedure.Necessity = $('#procedure-Necessity').val();
    //
    //     console.log(
    //         "Name = " + NewProcedure.Name + "\n" +
    //         "Description = " + NewProcedure.Description + "\n" +
    //         "Location = " + NewProcedure.Location + "\n" +
    //         "Legislation = " + NewProcedure.Legislation + "\n" +
    //         "Duration = " + NewProcedure.Duration + "\n" +
    //         "TotalValue = " + NewProcedure.TotalValue + "\n" +
    //         "ID_ContractType = " + NewProcedure.ID_ContractType + "\n" +
    //         "ID_ProcedureType = " + NewProcedure.ID_ProcedureType + "\n" +
    //         "ID_ProcedureCriterion = " + NewProcedure.ID_ProcedureCriterion + "\n" +
    //         "cpv = " + NewProcedure.cpv + "\n" +
    //         "Forms = " + NewProcedure.Forms + "\n" +
    //         "EconomicCapacity = " + NewProcedure.EconomicCapacity + "\n" +
    //         "TechnicalCapacity = " + NewProcedure.TechnicalCapacity + "\n" +
    //         "ClarificationRequestsDeadline = " + NewProcedure.ClarificationRequestsDeadline + "\n" +
    //         "TendersReceiptDeadline = " + NewProcedure.TendersReceiptDeadline + "\n" +
    //         "TendersOpeningDate = " + NewProcedure.TendersOpeningDate + "\n" +
    //         "ContestationsSubmission = " + NewProcedure.ContestationsSubmission + "\n" +
    //         "OtherInformation = " + NewProcedure.OtherInformation + "\n" +
    //         "Necessity = " + NewProcedure.Necessity
    //     );
    // }
    //
    // function addProcedure() {
    //
    //     $.ajax({
    //         url: "/api/procedures/add",
    //         method: 'post',
    //         async: true,
    //         data: JSON.stringify({
    //             "SubmitTime": time,
    //             "Name": "direct",
    //             "Description": "11111",
    //             "Location": "1111",
    //             "Legislation": "111",
    //             "Duration": 1,
    //             "TotalValue": 11111,
    //             "ID_ContractType": 1,
    //             "ID_ProcedureType": 1,
    //             "ID_ProcedureCriterion": 1,
    //             "Forms": "111",
    //             "EconomicCapacity": "111",
    //             "TechnicalCapacity": "111",
    //             "ClarificationRequestsDeadline": "0003-01-08T20:15:00.000",
    //             "TendersReceiptDeadline": "0006-01-08T20:15:00.000",
    //             "TendersOpeningDate": "0014-01-08T20:15:00.000",
    //             "ContestationsSubmission": "1111",
    //             "OtherInformation": "111",
    //             "Necessity": "1111",
    //             "ClassificationIDs": [
    //                 2088,
    //                 1290
    //             ]
    //         }),
    //         contentType: "application/json",
    //         success: function (data) {
    //             alert("raspuns " + data)
    //         }
    //     });
    // }
    //
    //
    //
    //
    //


// function uploadifyTest{
//     $('#Document').uploadify({
//       swf: '/plugins/uploadify/uploadify.swf',
//       uploader: '/procedure/upload',
//       multi: false,
//       buttonClass: 'btn btn-primary btn-cons uploadify-button',
//       buttonText: 'Upload',
//       fileObjName: 'Document',
//       fileSizeLimit: '10MB',
//       formData: uploadFormData,
//       onQueueComplete: function () {
//         alert("Complete Upload");
//       }
//     });
//     }


// function deleteProcedure(id)
// {
//   {
//       $.ajax({
//           url: '/api/procedure/delete',
//           method: 'post',
//           async: true,
//           data: JSON.stringify({'ID':id}),
//           contentType: "application/json",
//           success: function(data)
//                     {
//                       console.log(data);
//                     }
//                 })
//   }
// }



// function deleteProcedure(id) {
//
//     $("#dialog").dialog({
//         title: "Confirmati",
//         open: function (event, ui) {
//             var Question = 'Esti sigur vrei sa stergi procedura?';
//             $(this).html(Question);
//             $(".ui-widget-overlay").css({
//                 opacity: 0.7,
//                 filter: "Alpha(Opacity=100)",
//                 backgroundColor: "black",
//                 zIndex: 999
//             });
//         },
//         modal: true
//     });
//
//     $("#dialog").dialog({
//         buttons: [
//             { text: "Da", click: function ()
//                 {
//                     $.ajax({
//                         url: '/api/procedure/delete',
//                         method: 'post',
//                         async: true,
//                         data: JSON.stringify({'ID':id}),
//                         contentType: "application/json",
//                         success: function(data)
//                                   {
//                                     console.log(data);
//                                   }
//                               })
//                  }, style:"color:white;background-color:#99BB22;min-width: 100px;"},
//             { text: "Nu", click: function () { $( this ).dialog( "close" ); }, style:"color:white;background-color:#ACACAC;min-width: 100px;"}
//         ]
//     }).prev(".ui-dialog-titlebar").css({background:"white",border:"none"})
//     $(".ui-dialog-buttonpane").css({'text-align': 'center'});
//     $(".ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset").css({'float': 'none',"align-items": "center"});
//     $("#dialog").addClass('text-center');
//     $(".ui-widget-content").css({'border': "none"});
//
//  }
