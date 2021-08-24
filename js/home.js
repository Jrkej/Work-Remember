$(document).ready(function($){
  load($);
});
function load($){
    user = JSON.parse(localStorage.getItem("user"));
    console.log(user)
    if (user == null) {
      document.getElementById("creator").style = "visibility: visible;";
      document.getElementById("deletor").style = "visibility: hidden;";
      document.getElementById("name").innerHTML = null
      console.error("No id detected.");
      return null;
    }
    document.getElementById("creator").style = "visibility: hidden;height: 0px;";
    document.getElementById("deletor").style = "visibility: visible;height: 40px;margin-top: 10px;";
    document.getElementById("name").innerHTML = user["name"]
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    
    function drawChart() {
    CS = user["donestudy"];
    LS = user["leftstudy"];
    CW = user["donework"];
    LW = user["leftwork"];
    var data = google.visualization.arrayToDataTable([['Syllabus', 'Left'], ['Completed', CS], ['Left', LS]]);
    var dataWork = google.visualization.arrayToDataTable([['Work', 'Left'], ['Completed', CW], ['Left', LW]]);
    var options = {
      title: 'Syllabus',
      is3D: true,
      slices: {0: {offset: 0.1, color: "green"}, 1: {offset: 0.1, color: "red"},},
    };
    var optionsWork = {
      title: 'Work',
      is3D: true,
      slices: { 0: {offset: 0.1, color: "green"}, 1: {offset: 0.1, color: "red"},}
    };
    var work = [null, null, null, null, null, null, null, null];
    var study = [null, null, null, null, null, null, null, null];
    console.log("drawing graph.");
    $("#graph").shieldChart({
      theme: "light",
      primaryHeader: {text: "Activities last 7 days."},
      axisY: {title: {text: "Chapters"}},
      axisX: {title: {text: "Days"}},
      dataSeries: [
        {seriesType: "line", applyAnimation: true, collectionAlias: "Work", data: work},    
        {seriesType: "line", applyAnimation: true, collectionAlias: "Study", data: study}
      ]
    });
    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    var chartWork = new google.visualization.PieChart(document.getElementById('piechartwork'));
    console.log("drawing charts.");
    chart.draw(data, options);
    chartWork.draw(dataWork, optionsWork);
}};

function createId() {
    if (localStorage.getItem("user") != null) {
      console.error("already have id.");
      alert("You already have an Id! Can't create another.");
      return null;
    }
    let name = prompt('Enter your name.');
    if (name == null || name == "") {
      console.error("No name entry.");
      alert("You didn't entered anything! Retry.");
      return null
    }
    console.log(name, "creating id");
    var user = {};
    user["name"] = name;
    user["chapters"] = [];
    user["totalstudy"] = 0;
    user["leftstudy"] = 0;
    user["donestudy"] = 0;
    user["totalwork"] = 0;
    user["leftwork"] = 0;
    user["donework"] = 0;
    user["logs"] = [];
    localStorage.setItem("user", JSON.stringify(user));
    console.log(user);
    alert("We save data in your local machine so don't clear it!");
    load($);
}
function deleteId() {
  if (localStorage.getItem("user") == null) {
    console.error("No id detected to delete.");
    alert("No id to delete;");
    return null;
  }
  let name = prompt('Enter your name to verify.');
  if (name == null || name == "") {
    console.error("No name entry.");
    alert("You didn't entered anything! Retry.");
    return null
  }
  console.log(name, "deleting id");
  var user = JSON.parse(localStorage.getItem("user"));
  if (user["name"] != name) {
    console.error("Can't validate.");
    alert("Invalid name entry.");
    return null;
  }
  localStorage.clear();
  load($);
}