
(function() {
    $(document).ready(function() {

        let date = new Date();
        let year = date.getFullYear();
        let day = date.getDate();
        let month = date.getMonth() + 1;

        let monthNames = ["0", "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];



        // var day = 222;
        // var month = 111;

        $('#month').append(monthNames[month]);
        window.addEventListener('load', buildDays(day));

        function buildDays(today){
            let daybar = $('#daybar');
            let dayArr = [];
            for(var i = -3; i < 4; i++){
                // let weekdayEl = $('<li>' + (i + today) + '</li>');
                if((i+today) < 1){
                    let prev = new Date(year, month - 1, i+today);
                    addLi(dayArr, prev.getDate());
                } else if((i+today > 0)){
                    addLi(dayArr, i + today);
                }
            }
            daybar.append(dayArr);

        }

    // appends with correct superscript for day number
        function addLi(el, val){
            switch(!!val){
                case (val === 1 || val === 21 || val === 31):
                    el.push('<li>'+ val + '</li>');
                    break;
                case (val === 2 || val === 22):
                    el.push('<li>'+ val + '</li>');
                    break;
                case (val === 3 || val === 23):
                    el.push('<li>'+ val + '</li>');
                    break;
                case (val>3 && val<21):
                case(val>23 && val<31):
                    el.push('<li>'+ val + '</li>');
                    break;
            }
        }

    //highlight the  centered day
        document.querySelectorAll('#daybar')[0].childNodes[3].setAttribute("style", "background-color:#333333");

    });
})();
