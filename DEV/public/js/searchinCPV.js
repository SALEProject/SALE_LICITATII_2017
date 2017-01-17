function showDrop() {
    if ($('#input').val().length > 3)
    {
      var filterword = $('#input').val();
      $.each(cpvs, function(i, result)
      {
          if (result.Code.indexOf(filterword) != -1)
          {
              console.log(result);
          }
      });
    };
};
