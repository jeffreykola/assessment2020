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

    //State management


    let checked = new Set();
    var editDisabled = false;
    var checkboxesEnabled = false;
    let checkedBoxes = Array.from(checked);

    $('#edit').click(function() {

        $('input[type="checkbox"]:checked').each(function() {
            checked.add($(this).attr('name'));
        });


        editDisabled = true;
        checkboxesEnabled = true;

        if (checked.size > 0) {
            checkedBoxes = Array.from(checked);

            for (let i = 0; i < checkedBoxes.length; i++) {
                const previousValue = $('.' + checkedBoxes[i]).text();
                $('.' + checkedBoxes[i]).html('<input class="' + checkedBoxes[i] + '_input" type="text" value="' + previousValue + '"/>');
            }


            $('input:checkbox').attr('disabled', 'true');
            $('#edit').css({ 'pointer-events': 'none' });
        }
    });

    $('.save_button').click(function() {
        if (editDisabled && checkboxesEnabled && checkedBoxes.length > 0) {
            $('input:checkbox').removeAttr('disabled');
            $('#edit').css({ 'pointer-events': 'none' });

            $('.subject-1:input').click(() => { alert("Hello"); });
            for (let i = 0; i < checkedBoxes.length; i++) {
                const currentValue = $('.' + checkedBoxes[i] + '_input').val();
                console.log(currentValue);
                $('.' + checkedBoxes[i]).html('<span>' + currentValue + '</span>');
            }
        }
    });

});