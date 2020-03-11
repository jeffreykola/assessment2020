$(document).ready(function() {
    //Swiper from swiper.js used for viewing tasks
    const mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });


    //Datetime picker from flactpickr
    let date = new Date();
    const loadedTime = date.getHours() + ":" + date.getMinutes();

    $('.datepicker').flatpickr({
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        altInput: true,
        minDate: "today",
        minTime: loadedTime
    });

    //Handle the use of the images as buttons

    let alreadyClicked = false;

    $('#edit').click(function() {
        alreadyClicked = true;
        let checked = [];
        $('input[type="checkbox"]:checked').each(function() {
            checked.push($(this).attr('name'));
            console.log(checked);
        });
    });
})