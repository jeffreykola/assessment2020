/*eslint-disable*/
$(document).ready(function () {
  $(".status_message").html(`<b>MODULE</b> MANAGER`);

  const templateButton = (name) => {
    return `<div class="module_name ${name}_wrapper">
    <button class="sub">${name}</button>
  </div>`;
  };

  async function getSubjects() {
    const response = await fetch(`/subjects`, {
      headers: {
        Accept: "application/json;charset=utf-8",
        "Content-Type": "application/json",
      },
      dataType: "json",
      method: "GET",
    });
    const data = await response.json();
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      $(".module_selection").append(
        templateButton(
          data[i].replace("./db_files/", "").replace("_tasks.db", "").trim()
        )
      );
    }
  }

  getSubjects();

  //SEARCHING SUBJECTS
  async function search(searchVal) {
    const response = await fetch(`/search?search=${searchVal}`, {
      headers: {
        Accept: "application/json;charset=utf-8",
        "Content-Type": "application/json",
      },
      dataType: "json",
      method: "GET",
    });

    const data = await response.json();
    if (data["code"] == "found" || $('.module_search').val().trim()==="") {
      $(".add_button").css({ display: "none" });
    } else {
      $(".add_button").css({ display: "unset" });
    }
  }

  

  $(".module_search").keyup(function () {
    const searchValue = $(this).val().trim();
    search(searchValue);
  });

$(".add_button").click(function () {
  const searchValue = $(".module_search").val().trim();
  fetch("/add", {
    headers: {
      Accept: "application/json;charset=utf-8",
      "Content-Type": "application/json",
    },
    dataType: "json",
    method: "POST",
    body: JSON.stringify({ subject: `${searchValue}` }),
  }).then((res)=>{
    if(res.status===200){
      $('.refresh_message span').html("Refresh required");
    }else if(res.status===500){
      $('.refresh_message span').html("Maxmimum subjects reached");
    }
  });




});

  let mySwiper = new Swiper(".swiper-container", {
    slidesPerView: 1,
    spaceBetween: 0,
    breakpoints: {
      // when window width is >= 320px
      801: {
        slidesPerView: 3,
      },
      // when window width is >= 480px
      600: {
        slidesPerView: 2,
      },
      // when window width is >= 640px
      500: {
        slidesPerView: 1,
      },
    },
  });

  //Datetime picker from flactpickr
  let date = new Date();
  date.setMinutes(date.getMinutes() + 1);

  const defaultState = {
    enableTime: true,
    dateFormat: "Z",
    altInput: true,
    spaceBetween: 10,
    minDate: "today",
    minTime: date,
    disableMobile: true,
  };

  $(".datepicker").flatpickr(defaultState);

  //Once you click on a module to view the tasks of of
  $(".module_selection").on("click", "button", function () {
    var name = $(this).text().trim();
    //Hide everything except the view task sectiona nd the add item wrapper
    $(
      ".module_selection_section, .full_screen_overlay, header"
    ).css({
      display: "none",
    });

    $(".view_tasks_section, .add_item_wrapper").removeAttr("style");
    //Update status message with the name of the module
    $(".status_message")
      .html(name)
      .css({ color: "black", "font-size": "24px" })
      .parent()
      .css({ "text-align": "center" });
    //If one chooses to add a task hide and show required divs
    $(".add_button").click(function () {
      $(".full_overlay_container").show();
      $(".view_tasks_section, .add_item_wrapper").css({ display: "none" });
      $(".full_overlay_container").css({ "z-index": 99999 });
      $(".character_count").html(" ");

      //If closing the add task section
      $(".close_button").click(function () {
        $(".status_message").css({ "font-size": "24px" });
        $(".full_overlay_container").css({ display: "none" });
        $(".view_tasks_section, .add_item_wrapper").removeAttr("style");
        $(".status_message").html(name);
      });
    });

    //Go back to the homepage
    $(".back_button").click(function () {
      $(".status_message").removeAttr("style");
      $(".status_message").html(`<b>MODULE</b> MANAGER`);
      const currentTime = new Date();
      const displayTime = `${currentTime.getHours()}: ${currentTime.getMinutes()}`;
      location.reload();
      $(".view_tasks_section, .add_item_wrapper").css({ display: "none" });
      $(".module_selection_section, header").removeAttr("style");
      $(".time_refreshed").html(displayTime);
    });

    updateTasks(name);

    var color = "";
    $(".task_desc_inp").keyup(function () {
      const MAXLENGTH = $(this).attr("maxlength");
      const remainingCharacters = MAXLENGTH - $(".task_desc_inp").val().length;

      if (remainingCharacters >= 70) {
        color = "green";
      } else if (remainingCharacters >= 50 && remainingCharacters <= 70) {
        color = "orange";
      } else {
        color = "red";
      }

      console.log(remainingCharacters);
      console.log(color);
      $(".character_count")
        .html(`${remainingCharacters}`)
        .css({ color: `${color}`, "font-size": "14px" });
    });
    //Save task button
    $(".save_task").click(function () {
      const taskp = (str) => {
        if (str == "high") {
          return 1;
        } else if (str == "medium") {
          return 0;
        } else {
          return -1;
        }
      };

      const Task = {
        taskName: $("#task_name").val(),
        description: $(".task_desc_inp").val(),
        priority: taskp($(".task_priority").val()),
        date: $(".datepicker").val(),
        module: name,
      };

      if (Object.values(Task).includes("")) {
        $(".status_message").html(
          `Enter information into all required fields : <ul class="required_fields"></ul>`
        );
        for (let i = 0; i <= 4; i++) {
          if (Object.values(Task)[i] == "") {
            const niceDisplay = {
              taskName: "Task Name",
              description: "Task Description",
              priority: "Task Priority",
              date: "Deadline",
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
            "X-Requested-With": "XMLHttpRequest",
          },
        };

        fetch("/", postOptions)
          .then((res) => {
            if (res.status == "200") {
              $(".status_message")
                .html(`You just added a task called: <b>${Task.taskName}</b>`)
                .css({ "font-size": "16px" });
            } else if (res.status == "404") {
              $(".status_message").html(`Not Found Error: Please Try Again`);
            }
          })
          .catch(console.error);
      }
    });

    //Refresh GET requests
    const htmlTaskTemplate = (object) => {
      let backgroundColor = "none";
      switch (object.priority) {
        case 1:
          backgroundColor = "red";
          break;
        case 0:
          backgroundColor = "#ffbf00";
          break;
        case -1:
          backgroundColor = "#85ba6a";
          break;
        default:
          console.log("There has been an error");
      }

      // Set the date we're counting down to
      var countDownDate = new Date(object.date).getTime();

      var x = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        //console.log(distance);
        if (distance <= 0) {
          clearInterval(x);
          $(`.countdown_timer_${object._id}`).html(`This task has expired`);
        } else {
          $(`.countdown_timer_${object._id}`).html(
            `${days} : ${hours} : ${minutes} : ${seconds}`
          );
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
            ${object.description}
          </p>
      </div>
  </div>

</div>`;
    };

    var displayMap = new Map();
    async function updateTasks(name) {
      const response = await fetch(`/data?id=${name}`, {
        headers: {
          Accept: "application/json;charset=utf-8",
          "Content-Type": "application/json",
        },
        dataType: "json",
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
      //Showing tasks in order of their priority and then in order of their deadlines
      data.sort((a, b) =>
        a.priority < b.priority
          ? 1
          : a.priority === b.priority
          ? a.date > b.date
            ? 1
            : -1
          : -1
      );
      for (let i = 0; i < data.length; i++) {
        if (!displayMap.has([data[i]["_id"]])) {
          mySwiper.appendSlide(htmlTaskTemplate(data[i]));
          displayMap.set(data[i]["_id"], "displayed");
        } else {
          return;
        }
      }

      console.log(displayMap);
    }
  });
});
