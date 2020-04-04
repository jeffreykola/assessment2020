const request = require('supertest');
const server = require("./server");

describe('Tests for server.js', () => {
    test('GET data for Programming module', () => {
        return request(server)
	    .get('/data?id=Programming')
        .expect(200);
});


test('GET /data for missing module', () => {
    return request(server)
    .get('/data?id=Geography')
    .expect(400);
});


});

//State management

  // let checked = new Set();
  // var editDisabled = false;
  // var checkboxesEnabled = false;
  // let checkedBoxes = Array.from(checked);

  // $("#edit").click(function() {
  //   $('input[type="checkbox"]:checked').each(function() {
  //     checked.add($(this).attr("name"));
  //   });

  //   editDisabled = true;
  //   checkboxesEnabled = true;

  //   if (checked.size > 0) {
  //     checkedBoxes = Array.from(checked);

  //     for (let i = 0; i < checkedBoxes.length; i++) {
  //       const previousValue = $("." + checkedBoxes[i]).text();
  //       $("." + checkedBoxes[i]).html(
  //         '<input class="' +
  //           checkedBoxes[i] +
  //           '_input" type="text" value="' +
  //           previousValue +
  //           '"/>'
  //       );
  //     }

  //     $("input:checkbox").attr("disabled", "true");
  //     $("#edit").css({ "pointer-events": "none" });
  //   }

  //   $(".save_button").click(function() {
  //     if (editDisabled && checkboxesEnabled && checkedBoxes.length > 0) {
  //       $("input:checkbox").removeAttr("disabled");
  //       //$("#edit").css({ "pointer-events": "unset" });
  //       //NEED TO FIX THIS

  //       $(".subject-1:input").click(() => {
  //         alert("Hello");
  //       });
  //       for (let i = 0; i < checkedBoxes.length; i++) {
  //         const currentValue = $("." + checkedBoxes[i] + "_input").val();
  //         console.log(checkedBoxes[i]);
  //         $("." + checkedBoxes[i]).html("<span>" + currentValue + "</span>");
  //       }
  //     }
  //   });
  // });
