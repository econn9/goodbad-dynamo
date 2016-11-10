
(function() {
    $(document).ready(function() {

        getDay = '0506';
        $.ajax({
            method:'GET',
            url: '/api/event/'+getDay,
            success: function(data) {
                    $('#bad').append('<h2>' + data.Item.badYear + '</h2>');
                    $('#good').append('<h2>' + data.Item.goodYear + '</h2>');
                    $('#good').append('<li>' + data.Item.good + '</li>');
                    $('#bad').append('<li>' + data.Item.bad + '</li>');
                    // $('#bad').append('<li>' + data.Item.badLink + '</li>');
                    $('#good').append('<a id="goodurl" target="_blank" href="' + data.Item.goodLink + '" >Full Story >></a>');
                    $('#bad').append('<a id="badurl" target="_blank" href="' + data.Item.badLink + '" >Full Story >></a>');
            }
        });

        $.ajax({
            method: 'GET',
            url: '/api/event',
            success: function(data) {
                return console.log(data.Item);
            }
        });

        $('#eventDeleteForm').submit(function(event) {
            $.ajax({
                method: 'DELETE',
                url: '/api/event/57197df0139d13e011990ee1',
                success: function() {
                    console.log('deleted ' + checkedEvent.attr('data-id'));
                }
            });
            event.preventDefault();
            return false;
        });
    });
})();
