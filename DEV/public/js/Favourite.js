function getFavouriteProcedures() {
    $.ajax({
        url: '/api/favourite/get',
        method: "GET",
        async: true,
        success: function ( data ) {
              $('#favourite-procedures-list').empty();
              $('#favourite-procedures-list').append(data);
              // console.log(data);
        }
    });
}

function setFavouriteProcedure(ID_Procedure) {

    $("#dialog").dialog({
        title: "Confirmati",
        open: function (event, ui) {
            var Question = 'Esti sigur ca vrei sa urmaresti procedura?';
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
            {
                text: "Da", click: function () {
                $.ajax({
                    url: "/api/favourite/add",
                    method: 'post',
                    async: true,
                    data: JSON.stringify({
                        ID_Procedure: ID_Procedure
                    }),
                    contentType: "application/json",
                    success: function () {
                      getProcedures();
                      $('#dialog').dialog("close");
                    }
                })
            }, style: "color:white;background-color:#99BB22;min-width: 100px;"
            },
            {
                text: "Nu", click: function () {
                $(this).dialog("close");
            }, style: "color:white;background-color:#ACACAC;min-width: 100px;"
            }
        ]
    }).prev(".ui-dialog-titlebar").css({background: "white", border: "none"})
    $(".ui-dialog-buttonpane").css({'text-align': 'center'});
    $(".ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset").css({'float': 'none', "align-items": "center"});
    $("#dialog").addClass('text-center');
    $(".ui-widget-content").css({'border': "none"});

}

function resetFavouriteProcedure(ID_Procedure) {
    $("#dialog").dialog({
        title: "Confirmati",
        open: function (event, ui) {
            var Question = 'Esti sigur ca nu mai vrei sa urmaresti procedura?';
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
            {
                text: "Da", click: function () {
                $.ajax({
                    url: "/api/favourite/delete",
                    method: 'post',
                    async: true,
                    data: JSON.stringify({
                        ID_Procedure: ID_Procedure
                    }),
                    contentType: "application/json",
                    success: function()
                        {
                          getProcedures();
                          $('#dialog').dialog("close");
                        }
                })
            }, style: "color:white;background-color:#99BB22;min-width: 100px;"
            },
            {
                text: "Nu", click: function () {
                $(this).dialog("close");
            }, style: "color:white;background-color:#ACACAC;min-width: 100px;"
            }
        ]
    }).prev(".ui-dialog-titlebar").css({background: "white", border: "none"})
    $(".ui-dialog-buttonpane").css({'text-align': 'center'});
    $(".ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset").css({'float': 'none', "align-items": "center"});
    $("#dialog").addClass('text-center');
    $(".ui-widget-content").css({'border': "none"});
    // $('.ui-dialog-titlebar-close').css({'display': 'none'});
    $( "button[class='ui-dialog-titlebar-close']" ).css({'display': 'none !important'});
}

function filterProcedures()
    {
        var filterIDContractType = document.getElementById("filter-ID_ContractType").value;
        var filterIDProcedureType = document.getElementById("filter-ID_ProcedureType").value;
        var filterIDProcedureCriterion = document.getElementById("filter-ID_ProcedureCriterion").value;
        var filterStart = document.getElementById("filter-start").value;
        var filterEnd = document.getElementById("filter-end").value;
        var filterWord = document.getElementById("filter-keyword").value.toUpperCase();
        var FilteredResults = CachedProcedures;
        var Found = [];

        // console.log(CachedProcedures);
        // var SearchResult = [];

        // switch (filterIDContractType)
        // {
        //     case '1':
        //         alert("da");
        //         break;
        //     case '2':
        //         alert("da");
        //         break;
        //     case '3':
        //         alert("da");
        //         break;
        //     default:
        //         alert("nu");
        //         break;
        // }
        //

        if(filterIDContractType != "")
               {
                for (var i = 0; i < FilteredResults.length; i++)
                    {
                        if (FilteredResults[i].ID_ContractType == filterIDContractType)
                            {
                                Found.push(FilteredResults[i]);
                            }

                    }

               FilteredResults = Found;
               console.log("First Filter "+FilteredResults.length);
               console.log(FilteredResults);
               Found = [];
            }


        if(filterIDProcedureType != "")
            {
                console.log(FilteredResults);
                for (var i = 0; i < FilteredResults.length; i++)
                    {
                        if (FilteredResults[i].ID_ProcedureType == filterIDProcedureType)
                            {
                                Found.push(FilteredResults[i]);
                            }
                    }
                FilteredResults = Found;
                console.log("Second Filter "+FilteredResults.length);
                console.log(FilteredResults);
                Found = [];
            }

        if(filterIDProcedureCriterion != "")
            {
                console.log(FilteredResults);
                for (var i = 0; i < FilteredResults.length; i++)
                    {
                        if (FilteredResults[i].ID_ProcedureCriterion == filterIDProcedureCriterion)
                            {
                                Found.push(FilteredResults[i]);
                            }
                    }
                FilteredResults = Found;
                console.log("Third "+FilteredResults.length);
                console.log(FilteredResults);
                Found = [];
            }

        if(filterWord != "")
            {
                console.log(FilteredResults);
                for (var i = 0; i < FilteredResults.length; i++)
                    {
                        if ((FilteredResults[i].Name.toUpperCase()).indexOf(filterWord) != -1)
                            {
                                Found.push(FilteredResults[i]);
                            }
                    }
                FilteredResults = Found;
                console.log("NameFilter "+FilteredResults.length);
                console.log(FilteredResults);
                Found = [];
            }


        if(filterStart != "")
            {
                filterStart  = moment(filterStart,"DD-MM-YYYY").startOf("day");
                for (var i = 0; i < FilteredResults.length; i++)
                    {
                        if ( moment(FilteredResults[i].TendersOpeningDate).isSameOrAfter(filterStart))
                            {
                                Found.push(FilteredResults[i]);
                            }
                    }
                FilteredResults = Found;
                console.log("StartDay "+FilteredResults.length);
                console.log(FilteredResults);
                Found = [];
            }

        if(filterEnd!= "")
            {
                filterEnd  = moment(filterEnd,"DD-MM-YYYY").endOf("day");

                for (var i = 0; i < FilteredResults.length; i++)
                    {
                            if ( moment(FilteredResults[i].TendersOpeningDate).isSameOrBefore(filterEnd))
                            {
                                Found.push(FilteredResults[i]);
                            }
                    }
                FilteredResults = Found;
                console.log("StartDay "+FilteredResults.length);
                console.log(FilteredResults);
                Found = [];
            }


          $('#procedures-list').children().hide();
          for (var i = 0; i < FilteredResults.length; i++)
              {
                          Found.push(FilteredResults[i]);
                          $('#procedure-'+FilteredResults[i].ID).show();
              }


// if ( (CachedProcedures[i].Name.toUpperCase()).indexOf(filterWord) == -1)
        // console.log(FilteredResults);
        // if(filterIDProcedureCriterion !== "Toate criteriile")
        //     {
        //         for (var i = 0; i < CachedProcedures.length; i++)
        //             {
        //                 if (CachedProcedures[i].ID_ProcedureCriterion == filterIDProcedureCriterion)
        //                     {
        //                         console.log(CachedProcedures[i].ID_ProcedureCriterion);
        //                     }
        //             }
        //     }




        // for (var i = 0; i < CachedProcedures.length; i++)
        //     {
        //         if ( (CachedProcedures[i].Name.toUpperCase()).indexOf(filterWord) == -1)
        //             {
        //                 $("#procedure-"+CachedProcedures[i].ID).hide();
        //             }
        //         else
        //             {
        //                 $("#procedure-"+CachedProcedures[i].ID).show();
        //             }
        //     }
        // filterWord = '';
    }
//
// function filterMotor(CachedProcedures,searchIN,searchFOR,toUpper)
// {
//     if (toUpper == false)
//         {
//             for (var i = 0; i < CachedProcedures.length; i++)
//                 {
//                     if (CachedProcedures[i].searchIN = searchFOR)
//                         {
//                             console.log(CachedProcedures[i]);
//                         }
//                 }
//         }
// }




// function FilterEngine()
// {
//   if(filterIDContractType != "")
//          {
//           for (var i = 0; i < FilteredResults.length; i++)
//               {
//                   if (FilteredResults[i].ID_ContractType == filterIDContractType && FilteredResults[i].Status == "approved")
//                       {
//                           Found.push(FilteredResults[i]);
//                       }
//
//               }
//
//          FilteredResults = Found;
//          console.log("First Filter "+FilteredResults.length);
//          console.log(FilteredResults);
//          Found = [];
//       }
// }
