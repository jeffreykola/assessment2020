$(document).ready(function() {
  //Swiper from swiper.js used for viewing tasks
  const mySwiper = new Swiper(".swiper-container", {
    slidesPerView: "auto",
    spaceBetween: 0,
    scrollbar: {
      el: ".swiper-scrollbar"
    }
  });

  //Datetime picker from flactpickr
  let date = new Date();
  const loadedTime = date.getHours() + ":" + date.getMinutes();
  const defaultState = {
    enableTime: true,
    dateFormat: "Z",
    altInput: true,
    spaceBetween: 10,
    minDate: "today",
    disableMobile: true
  };

  $(".datepicker").flatpickr(defaultState);



  //State management

  let checked = new Set();
  var editDisabled = false;
  var checkboxesEnabled = false;
  let checkedBoxes = Array.from(checked);

  $("#edit").click(function() {
    $('input[type="checkbox"]:checked').each(function() {
      checked.add($(this).attr("name"));
    });

    editDisabled = true;
    checkboxesEnabled = true;

    if (checked.size > 0) {
      checkedBoxes = Array.from(checked);

      for (let i = 0; i < checkedBoxes.length; i++) {
        const previousValue = $("." + checkedBoxes[i]).text();
        $("." + checkedBoxes[i]).html(
          '<input class="' +
            checkedBoxes[i] +
            '_input" type="text" value="' +
            previousValue +
            '"/>'
        );
      }

      $("input:checkbox").attr("disabled", "true");
      $("#edit").css({ "pointer-events": "none" });
    }
  });

  $(".save_button").click(function() {
    if (editDisabled && checkboxesEnabled && checkedBoxes.length > 0) {
      $("input:checkbox").removeAttr("disabled");
      $("#edit").css({ "pointer-events": "none" });

      $(".subject-1:input").click(() => {
        alert("Hello");
      });
      for (let i = 0; i < checkedBoxes.length; i++) {
        const currentValue = $("." + checkedBoxes[i] + "_input").val();
        console.log(currentValue);
        $("." + checkedBoxes[i]).html("<span>" + currentValue + "</span>");
      }
    }
  });

  //Save task button
  $(".save_task").click(function() {
    //Clearing all values in input
    const Task = {
      taskName: $("#task_name").val(),
      descripition: $(".task_desc_inp").val(),
      priority: $(".task_priority").val(),
      date: $(".datepicker").val()
    };

    if (Object.values(Task).includes("")) {
      $(".status_message").html(
        `Enter information into all required fields : <ul class="required_fields"></ul>`
      );
      for (let i = 0; i <= 4; i++) {
        if (Object.values(Task)[i] == "") {
          const niceDisplay = {
            taskName: "Task Name",
            descripition: "Task Description",
            priority: "Task Priority",
            date: "Deadline "
          };

          $(".required_fields").append(
            `<li>${niceDisplay[Object.keys(Task)[i]]}</li>`
          );
        }
      }
    } else {
      $("#task_name, .task_desc_inp, .datepicker").val("");
      $(".datepicker").flatpickr(defaultState);

      //Updating the status message

      //Create json object
      const taskJSONObject = JSON.stringify(Task);
      console.log(taskJSONObject);
      const postOptions = {
        method: "POST",
        body: taskJSONObject,
        dataType: "json",
        headers: {
          Accept: "application/json;charset=utf-8",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }
      };

      fetch("/", postOptions)
        .then(res => {
          if (res.status == "200") {
            $(".status_message").html(
              `You just added a task called: <b>${Task.taskName}</b>`
            );
          } else if (res.status == "404") {
            $(".status_message").html(`Not Found Error: Please Try Again`);
          }
        })
        .catch(console.error);
    }
  });

  //Refresh GET requests
  const htmlTaskTemplate = (object)=>{
    let backgroundColor = "none";
    switch(object.priority){
        case "high":
            backgroundColor="red";
            break;
        case "medium":
            backgroundColor="orange";
            break;
        case "low":
            backgroundColor="green";
            break;
        default:
            console.log("There has been an error");            
    }

// Set the date we're counting down to
var countDownDate = new Date(object.date).getTime();

// Update the count down every 1 second
var days=
    hours =
    minutes =
    seconds = 0;

var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  $(`.countdown_timer_${object._id}`).html(`${days} : ${hours} : ${minutes} : ${seconds}`);

  if (distance < 0) {
    clearInterval(x);
    $('.countdown_timer').html("EXPIRED");
  }
}, 1000);

      return `
  <div class="sliding_section swiper-slide">
  <div class="task_wrapper">
      <div class="top_task_section">
          <div class="task_name_wrap">
            ${object.taskName}
          </div>

          <div style="background-color:${backgroundColor};" class="priority_indicator">
          </div>
      </div>

      <div class="middle_task_section">
          <p class="countdown_timer_${object._id}">
          </p>
      </div>

      <div class="bottom_task_section">
          <p class="task_description">
            ${object.descripition}
          </p>
      </div>
  </div>

</div>`
};
var displayMap = new Map();
    async function updateTasks() {
      const response = await fetch("/data", {
        headers: {
          Accept: "application/json;charset=utf-8",
          "Content-Type": "application/json"
        },
        dataType: "json",
        method: "GET"
      });
      const data = await response.json();


      for(let i =0; i < data.length; i++){
          if(!displayMap.has([data[i]["_id"]])){
            //$(htmlTaskTemplate(data[i])).insertBefore($('.swiper-scrollbar'));
            mySwiper.appendSlide(htmlTaskTemplate(data[i]));
              displayMap.set(data[i]["_id"], "displayed");
          }else{
              return;
          }
      }

      console.log(displayMap);

    }

    
    updateTasks();

 
});
