$( document ).ready(function() {
  $("#submit").on( "click", function( event ) {
    let points = {}
    $("input").map((i, e) => {
      if(e.value === "") {
        points[e.name] = e.placeholder;
      } else {
        points[e.name] = parseInt(e.value);
      }
    });
    let id = $('.form').attr("data-id");
    $.ajax({
            url: `/students/${id}`,
            type: 'PUT',
            data: points,
            dataType: 'json',
            success: function(result) {
              window.location.href = `/students/${id}`;
            }
        });
  });
});
