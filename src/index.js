/*eslint-disable*/
$(document).ready(function () {
  $(".status_message").html(`<b>MODULE</b> MANAGER`);


  var displayMap = new Map();
  
  $(".close_button").click(function () {
    showTaskSection();
  });
  
  const priorityDecoder = (color) => {
    if (color === "#ff0000" || color.trim() === "rgb(255, 0, 0)") {
      return "high";
    } else if (color === "rgb(255, 191, 0)") {
      return "medium";
    } else {
      return "low";
    }
  };

  const taskp = (str) => {
    if (str == "high") {
      return 1;
    } else if (str == "medium") {
      return 0;
    } else {
      return -1;
    }
  };

  let mySwiper = new Swiper(".swiper-container", {
    slidesPerView: 1,
    spaceBetween: 5,
    breakpoints: {
      900: {
        slidesPerView: 3,
      },
      // when window width is >= 480px
      600: {
        slidesPerView: 2,
      },
      // when window width is >= 640px
    },
  });

  $(".add_button").click(function () {
    showAddSection();
    let name = $(".status_message").html();
    //console.log(name);
    //Save task button
  });

  const templateButton = (name) => {
    return `<div class="module_name ${name}_wrapper">
    <button class="sub module_${name}">${name.split("_").join(" ")}</button>
    <img alt="view-icon" class="view_options" name="${name}" src="./assets/icons/options.svg"/>
    <div class="module_action_tray action_tray_${name} w3-animate-right">
      <button name="${name}" class="delete_button">
        <img alt="delete-icon" src="./assets/icons/delete.svg"/>
      </button>
      <button name=${name} class="edit_button">
        <img alt="edit-icon" src="./assets/icons/edit.svg"/>
      </button>
    </div>
  </div>`;
  };

  function showTaskSection() {
    $(".full_overlay_container").css({ display: "none" });
    $(".view_tasks_section, .add_item_wrapper").removeAttr("style");
    $('.done').css({display:"unset"});
    $('.save_edit').hide();
  }

  function showAddSection(defaults = false, options) {
    $(".full_overlay_container").css({ display: "grid" });
    $(".view_tasks_section, .add_item_wrapper").css({ display: "none" });
    //$(".full_overlay_container").css({ "z-index": 99999 });
    $("input,textarea").val(" ");
    $(".status_message").css({ color: "black" });
    $(".character_count").html(" ");
    $(".task_priority").children().removeAttr("selected");

    if (defaults) {
      $(".full_overlay_container").attr("data-target", options["id"]);
      $("#task_name").html(" ").val(options["taskName"]);
      $(".task_desc_inp").html(" ").val(options["description"]);
      $.each($(".task_priority option"), function () {
        if ($(this).val() == options["priority"]) {
          $(this).attr("selected", "true");
        }
      });
      defaultState["defaultDate"] = options["date"];
      //redrawing the datepicker
      $(".datepicker").flatpickr(defaultState);
    }
  }

  function backToOriginalView() {
    $(".status_message").removeAttr("style");
    $(".status_message").html(`<b>MODULE</b> MANAGER`);
    $(".view_tasks_section, .add_item_wrapper").css({ display: "none" });
    $(".module_selection_section, header").removeAttr("style");
  }

  $(".back_button").click(function () {
    backToOriginalView();
  });

  $(".module_selection").on("click", ".view_options", function () {
    var name = $(this).attr("name").trim().split(" ").join("_");

    if ($(window).width() <= 800) {
      $(`.${name}_wrapper`).toggleClass("change_grid_display");
    }

    $(`.module_${name}`).toggleClass("hide");

    $(`.action_tray_${name}`).toggleClass("action_tray_show");
  });

  $(".module_selection").on("click", ".edit_button", function () {
    const name = $(this).attr("name");

    const previousState = $(`.action_tray_${name}`).html();

    $(`.action_tray_${name}`).html(
      `<input name=${name} class="update_name" maxlength="22" placeholder ="New.." type="text"/> <button class="update_button"><img src="./assets/icons/done.svg"/></button>`
    );

    $(`.module_selection`).on(
      "click",
      `.action_tray_${name} .update_button`,
      async function () {
        const updateValue = $(`.action_tray_${name} .update_name`).val().trim();
        if (
          updateValue === "" ||
          updateValue === name.split("_").join(" ") ||
          $(".module_selection").has(`.module_${updateValue}`).length >= 1
        ) {
          $(`.action_tray_${name}`).html(previousState);
        } else {
          await fetch("/updatemod", {
            headers: {
              Accept: "application/json;charset=utf-8",
              "Content-Type": "application/json",
            },
            dataType: "json",
            method: "POST",
            body: JSON.stringify({
              originalName: `${name.split("_").join(" ")}`,
              newFileName: `${updateValue}`,
            }),
          }).then(async (res) => {
            await getSubjects();
            //console.log(getSubjects());
          }).catch((err)=>{
            alert(`Unable to obtain response from server \n ${err}`);
          });
        }
      }
    );
  });

  $(".module_selection").on("click", ".delete_button", function () {
    const name = $(this).attr("name");
    fetch("/dropmod", {
      headers: {
        Accept: "application/json;charset=utf-8",
        "Content-Type": "application/json",
      },
      dataType: "json",
      method: "POST",
      body: JSON.stringify({ name: `${name.split("_").join(" ")}` }),
    }).then(async (res) => {
      if (res.status === 200) {
        await getSubjects();
      } else {
        alert("There has been an error");
      }
    }).catch((err)=>{
      alert(`Unable to obtain response from server \n ${err}`);
    });
  });

  async function getSubjects() {
    $('.module_selection').html(" ");
    const response = await fetch(`/subjects`, {
      headers: {
        Accept: "application/json;charset=utf-8",
        "Content-Type": "application/json",
      },
      dataType: "json",
      method: "GET",
    }).catch((err)=>{
      alert(`Unable to obtain response from server \n ${err}`);
    });

    const data = await response.json();
    //console.log(data);
    for (let i = 0; i < data.length; i++) {

      if (data[i] != "./db_files/_tasks.db" && data[i] != "./db_files/~_tasks.db") {
        $(".module_selection").append(
          templateButton(
            data[i]
              .replace("./db_files/", "")
              .replace("_tasks.db", "")
              .trim()
              .split(" ")
              .join("_")
          )
        );
      }
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
      }).catch((err)=>{
        alert(`Unable to obtain response from server \n ${err}`);
      });

      const data = await response.json();
      if (
        data["status"] == "found" ||
        $(".module_search").val().trim() === ""
      ) {
        $(".add_button_mod").css({ display: "none" });
      } else {
        $(".add_button_mod").css({ display: "unset" });
      }
  }

  $(".module_search").keyup(function () {
    const searchValue = $(this).val().trim();
    search(searchValue);
  });

  $(".add_button_mod").click(function () {
      const searchValue = $(".module_search").val().trim();
      fetch("/add", {
        headers: {
          Accept: "application/json;charset=utf-8",
          "Content-Type": "application/json",
        },
        dataType: "json",
        method: "POST",
        body: JSON.stringify({ module: `${searchValue}` }),
      }).then(async (res) => {
        if (res.status === 200) {
          await getSubjects();
        } else if (res.status === 403) {
          $(".refresh_message span").html("Maxmimum subjects reached");
        }
      }).catch((err)=>{
        alert(`Unable to obtain response from server \n ${err}`);
      });
   
  });



  const defaultState = {
    enableTime: true,
    dateFormat: "Z",
    altInput: true,
    spaceBetween: 10,
    minDate: "today",
    disableMobile: true,
  };

  $(".datepicker").flatpickr(defaultState);

  //Once you click on a module to view the tasks of of
  $(".module_selection").on("click", ".sub", function () {
    var name = $(this).text().trim();
    updateTasks(name);
    $(".add_button").click(function () {
      $(".done").unbind().click(function () {
        console.log("here");
        //console.log(name);
        const Task = {
          taskName: $("#task_name").val().trim(),
          description: $(".task_desc_inp").val().trim(),
          priority: taskp($(".task_priority").val()),
          date: $(".datepicker").val().trim(),
          module: name,
        };
        // console.log(Object.values(Task));
        // console.log(Object.values(Task).includes(""))

        if (Object.values(Task).includes("")) {
          $(".status_message")
            .html(
              `Enter information into all required fields : <ul style="font-size:16px;text-decoration:none;list-style-type: none;" class="required_fields"></ul>`
            )
            .css({ color: "red" });
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
          const postOptions = {
            method: "POST",
            body: taskJSONObject,
            dataType: "json",
            headers: {
              Accept: "application/json;charset=utf-8",
              "Content-Type": "application/json",
            },
          };
            fetch("/", postOptions)
              .then(async (res) => {
                if (res.status == "200") {
                  $(".status_message")
                    .html(`Task added: <b>${Task.taskName}</b>`)
                    .css({ color: "black" });
                  $(".character_count").html(" ");
                  await updateTasks(Task.module);
                } else if (res.status == "404") {
                  $(".status_message").html(
                    `Not Found Error: Please Try Again`
                  );
                }
              })
              .catch((err) => {
                  alert(`Unable to obtain response from server \n ${err}`);
              });
        }
      });

      $('.close_button').click(function(){
        $(".status_message").html(name).css({ color: "black" });
      });
    });


    //Hide everything except the view task sectiona nd the add item wrapper
    $(".module_selection_section, .full_screen_overlay, header").css({
      display: "none",
    });

    $(".view_tasks_section, .add_item_wrapper").removeAttr("style");
    //Update status message with the name of the module
    $(".status_message").html(name).parent().css({ "text-align": "center" });

    //if one chooses to delete a task
    $(".swiper-wrapper").on("click", ".delete_task", function (data) {
      const id = $(this).attr("name");
        fetch(`/delete`, {
          method: "POST",
          body: JSON.stringify({ name: name, id: id }),
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json",
          },
          dataType: "json",
        }).then((res) => {
          if(res['status']==200){
            displayMap.set(id,'deleted');
            mySwiper.removeSlide(mySwiper.activeIndex);
          }
        }).catch((err)=>{
          alert(`The server has disconnected, please try again... \n ${err}` );
        })
    });

    //Go back to the homepage

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

      $(".character_count")
        .html(`${remainingCharacters}`)
        .css({ color: `${color}`, "font-size": "14px" });
    });

    $(".task_desc_inp").focusout(function () {
      $(".character_count").html(" ");
    });

    //Refresh GET requests
    const htmlTaskTemplate = (object) => {
      let backgroundColor = "none";
      switch (object.priority) {
        case 1:
          backgroundColor = "#ff0000";
          break;
        case 0:
          backgroundColor = "#ffbf00";
          break;
        case -1:
          backgroundColor = "#85ba6a";
          break;
        default:
            console.log("There has been an error, please refresh the page");

      }
      //https://www.w3schools.com/howto/howto_js_countdown.asp
      //Credit: w3 Schools

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
  <div class="task_wrapper task_wrapper_${object._id}">
      <div class="top_task_section">
          <div class="task_name_wrap">
            ${object.taskName}
          </div>

          <div style="background-color:${backgroundColor};" class="priority_indicator">
          </div>
      </div>

      <div class="middle_task_section">
          <p date="${object.date}" class="countdown_timer_${object._id}">
          </p>
      </div>

      <div class="bottom_task_section">
          <p class="task_description">
            ${object.description}
          </p>
      </div>

      <div class="delete_task_section">
        <button class="delete_task" name="${object._id}"><img alt="delete-svg" src="./assets/icons/delete.svg"/></button>
        <button class="edit_task" data-target="${object.module}" name="${object._id}"><img alt="edit-icon" src="./assets/icons/edit.svg"/></button>
      </div>
      </div>

        </div>`;
    };

    
    async function updateTasks(name) {
      mySwiper.removeAllSlides();

      //$('.close_button').attr("disabled", "true");
      
        const response = await fetch(`/data?id=${name}`, {
          headers: {
            Accept: "application/json;charset=utf-8",
            "Content-Type": "application/json",
          },
          dataType: "json",
          method: "GET",
        }).catch((err)=>{
          console.log(err);
          alert(`Unable to obtain response from server \n ${err}`);
        });
        
        const data = await response.json();
        console.log(data);

        //console.log(data);
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
        //   if (displayMap.has(data[i]["_id"])) {
        //   } else {
            mySwiper.appendSlide(htmlTaskTemplate(data[i]));
            //displayMap.set(data[i]["_id"], "displayed");
        //   }
        }
      //$('.close_button').removeAttr("disabled");
    }

    $(".swiper-wrapper").on("click", `.edit_task`, function () {

      $('.close_button').click(function(){
        //console.log("here");
        $(".status_message").html(name).css({ color: "black" });
      });

      //$('.refresh_status').html("");
      let id = (module = taskWrapper = taskName = priority = taskDesc = date = taskObject = null);
      id = $(this).attr("name");
      //console.log(id);
      module = name
      taskWrapper = `.task_wrapper_${id}`;
      taskName = $(`${taskWrapper} .task_name_wrap`).html().trim();
      priority = taskp(
        priorityDecoder(
          $(`${taskWrapper} .priority_indicator`).css("background-color")
        )
      );
      taskDesc = $(`${taskWrapper} .task_description`).html().trim();
      date = $(`${taskWrapper} .countdown_timer_${id}`).attr("date");
      //console.log(`taskName, ${taskName}, priority  ${priority},   ${taskDesc}`);
      //console.log($(`${taskWrapper} .priority_indicator`).css("background-color"));
      taskObject = {
        taskName: taskName,
        description: taskDesc,
        priority: priority,
        date: date,
      };
      //console.log(taskDesc);
      let optionsObject = {};
      optionsObject = Object.assign(optionsObject, taskObject);
      optionsObject["id"] = id;
      optionsObject["priority"] = priorityDecoder(
        $(`${taskWrapper} .priority_indicator`).css("background-color")
      );
      showAddSection(true, optionsObject);

      $(".done").css({"display":"none"});
      $('.save_edit').show();
      //console.log(id);
      $(`.save_edit`).unbind().click(function () {
        $('button').attr("disabled", true);
        const actid = $(".full_overlay_container").attr("data-target");

        const updatedTaskName = $(`#task_name`).val().trim();
        const updatedPriority = taskp($(".task_priority").val());
        const updatedTaskDesc = $(`.task_desc_inp`).val().trim();
        const updatedDate = $(".datepicker").val();
        //console.log(updatedTaskName);

        const newTask = {
          taskName: updatedTaskName,
          description: updatedTaskDesc,
          priority: updatedPriority,
          date: updatedDate,
        };
        
        const changesList = () => {
          let cl = [];
          for (
            let i = 0;
            i < recursiveDiff.getDiff(taskObject, newTask).length;
            i++
          ) {
            cl.push(recursiveDiff.getDiff(taskObject, newTask)[i]);
          }
          return cl;
        };

        const cl = changesList();
        //console.log(cl);

        function changes() {
          if (cl.length >= 1) {
            return true;
          }
          return false;
        }

        if (changes() && id === actid) {
          const bodyOfRequest = {};
          let properties = [];
          for (let i = 0; i <= cl.length - 1; ++i) {
            //console.log(i);
            properties.push(cl[i].path[0]);

            if(newTask[cl[i].path[0]] != ""){
              bodyOfRequest[cl[i].path[0]] = newTask[cl[i].path[0]];
            }else{
              
            }
            
          }

          //console.log(properties);

          bodyOfRequest["properties"] = properties;
          bodyOfRequest["module"] = module;
          bodyOfRequest["id"] = id;
          //console.log(bodyOfRequest);

            fetch("/update", {
              method: "POST",
              body: JSON.stringify(bodyOfRequest),
              dataType: "json",
              headers: {
                Accept: "application/json;charset=utf-8",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
              }
            }).then(async (res) => {
              //console.log('here');
              $(".status_message").html(
                `Updating : <b>${taskName}</b>...`
              );
              setTimeout(function(){
                if (res.status === 200) {
                  $("button").removeAttr("disabled");
                  $(".status_message").html(
                    `Saved task : <b>${updatedTaskName}</b>`
                  );
                  updateTasks(module);
                } else {
                  //showTaskSection();
                }
              },5000);
           }).catch((err)=>{
            alert(`Unable to update the task \n ${err}`);
          });

        }
      });
    });
  });
});
