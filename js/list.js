var getDay = '';

(function() {
    $(document).ready(function() {

        let date = new Date();
        let year = date.getFullYear();
        let day = date.getDate();
        let month = date.getMonth() + 1;

        function groomGetDay() {
            day < 10 ? getDay += '0'+day : getDay+=day;
            month < 10 ? getDay += '0'+month : getDay+=month;
        }

        groomGetDay();


        let monthNames = ["0", "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

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
                    el.push('<li>'+ val + '<sup>st</sup></li>');
                    break;
                case (val === 2 || val === 22):
                    el.push('<li>'+ val + '<sup>nd</sup></li>');
                    break;
                case (val === 3 || val === 23):
                    el.push('<li>'+ val + '<sup>rd</sup></li>');
                    break;
                case (val>3 && val<21):
                case(val>23 && val<31):
                    el.push('<li>'+ val + '<sup>th</sup></li>');
                    break;
            }
        }

    //highlight the  centered day
        document.querySelectorAll('#daybar')[0].childNodes[3].setAttribute("style", "background-color:#333333");

    });
})();
