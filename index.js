$(document).ready(function() {

    const mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });


    let date = new Date();
    const loadedTime = date.getHours() + ":" + date.getMinutes();

    $('.datepicker').flatpickr({
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        altInput: true,
        minDate: "today",
        minTime: loadedTime
    });
})