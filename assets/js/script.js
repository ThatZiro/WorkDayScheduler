//===============================================
//================== Variables ==================
//===============================================
let startHour = 6;
let endHour = 22;

let currentHour = 13;

let dataArray = [];

let alertTimer = null;
//===============================================
//================== Running Logic ==============
//===============================================
$(function () {
  currentHour = dayjs().hour();
  BuildGrid();
  UpdateHeader();
  $(".btn").on("click", SetData);
});

//===============================================
//================== Functions ==================
//===============================================

function UpdateHeader() {
  PopAlert("Time Updated", "info", 2000);
  let dayOfMonth = dayjs().date();
  $("#currentDay").text(
    `${dayjs().format("dddd, MMMM")} ${addOrdinalIndicator(dayOfMonth)}`
  );

  setInterval(() => {
    currentHour = dayjs().hour();
    UpdateColors();
    UpdateHeader();
  }, 300000);
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
//===============================================
//================== Database ===================
//===============================================
function SetData(event) {
  let parent = $(this).parent();

  let thisData = {
    hour: parent.attr("id"),
    textContent: parent.children("textarea").val(),
  };
  PopAlert(`${thisData.hour} saved successfully`, "success", 2000);
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

  for (const item of data) {
    if (item.hour === hour) {
      return item.textContent;
    }
  }
  return "";
}

function PopAlert(text, type, duration) {
  let alert = $("#Alert");
  alert.removeClass("alert-info");
  alert.removeClass("alert-success");

  switch (type) {
    case "success":
      alert.addClass("alert-success");
      break;
    case "info":
      alert.addClass("alert-info");
      break;
  }

  alert.attr("style", "visibility : visible");
  alert.text(text);

  clearInterval(alertTimer);

  alertTimer = setInterval(function () {
    $("#Alert").attr("style", "visibility : hidden");
    clearInterval(alertTimer);
  }, duration);
}

//===============================================
//================ DayJS Patch ==================
//===============================================
function addOrdinalIndicator(day) {
  console.log(day);
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}
