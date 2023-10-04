//===============================================
//================== Variables ==================
//===============================================

let startHour = 6;
let endHour = 22;

let currentHour = 13;

let dataArray = [];

$(function () {
  currentHour = dayjs().hour();
  console.log(currentHour);
  BuildGrid();
  UpdateHeader();
  $(".btn").on("click", SetData);
});

function UpdateHeader() {
  $("#currentDay").text(dayjs());
}

function SetData(event) {
  let parent = $(this).parent();

  let thisData = {
    hour: parent.attr("id"),
    textContent: parent.children("textarea").val(),
  };

  dataArray = GetData();
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].hour == thisData.hour) {
      dataArray.splice(i, 1);
    }
  }

  dataArray.push(thisData);

  localStorage.setItem("hourData", JSON.stringify(dataArray));
}

function GetData() {
  let data = JSON.parse(localStorage.getItem("hourData"));
  if (data == null) {
    data = [];
  }
  return data;
}

function GetDataAtHour(hour) {
  let data = GetData();

  for (let i = 0; i < data.length; i++) {
    if (data[i].hour === hour) {
      console.log(data[i].hour + " | " + hour);
      return data[i].textContent;
    }
  }
  return "";
}
function BuildGrid() {
  for (let i = startHour; i <= endHour; i++) {
    BuildTile(i);
  }
  UpdateColors();
}

function BuildTile(hour) {
  let hourString;

  if (hour < 12) {
    hourString = `${hour} am`;
  } else if (hour == 12) {
    hourString = `${hour} pm`;
  } else {
    hourString = `${hour - 12} pm`;
  }

  let sectionElement = $("<div>", {
    id: `hour-${hour}`,
    class: "row time-block",
  })
    .append(
      $("<div>", {
        class: "col 2 col-md-1 hour text-center py-3",
        text: hourString,
      })
    )
    .append(
      $("<textarea>", {
        class: "col-8 col-md-10 description past",
        rows: "3",
        text: GetDataAtHour(`hour-${hour}`),
      })
    );

  let sectionButton = $("<button>", {
    class: "btn saveBtn col-2 col-md-1",
    "aria-label": "save",
  });

  sectionElement.append(sectionButton);

  sectionButton.append(
    $("<i>", {
      class: "fas fa-save",
      "aria-hidden": "true",
    })
  );

  $(List).append(sectionElement);
}

function UpdateColors() {
  for (let i = startHour; i <= endHour; i++) {
    $(`#hour-${i} textarea`).removeClass("past");
    $(`#hour-${i} textarea`).removeClass("present");
    $(`#hour-${i} textarea`).removeClass("future");

    if (i < currentHour) {
      $(`#hour-${i} textarea`).addClass("past");
    } else if (i == currentHour) {
      $(`#hour-${i} textarea`).addClass("present");
    } else {
      $(`#hour-${i} textarea`).addClass("future");
    }
  }
}

//=====================================================
//================== Event Listeners ==================
//=====================================================

// localStorage.clear();
