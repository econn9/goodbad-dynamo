(function () {

    $('#events').submit(function(ev) {
        $.ajax({
            method: 'POST',
            url: '/api/event',
            success: function () {
                console.log('ayyyy' + request + '.....' + response + 'bodyyy:' + response.body);
              }
            });
            event.preventDefault();
            return false;
            }
    );
})();
