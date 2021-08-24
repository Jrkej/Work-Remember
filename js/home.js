const syllabus = ["Maths-Trignometry-1100", "Maths-Coordinate Geometry-1100", "Maths-Triangles-1100", "Maths-Polynomials-1100", "Maths-Pair of linear equations in Two Variables-1100", "Maths-Areas related to Circles-1100", "Maths-Probability-1100", "Maths-Real Numbers-1100", "Hindi-Kabir-1100", "Hindi-Meera-1100", "Hindi-Bade Bhai Sahab-1100", "Hindi-Tatara Vamiro katha-1100", "Hindi-Ab kaha dusre ke dukh se dukhi hone wale-1100", "English-A Letter to God-1100", "English-Dust of Snow-1100", "English-Fire and Ice-1100", "English-Nelson Mandela: Long walk to Freedom-1100", "English-A Tiger in the Zoo-1100", "English-Two Stories about Flying-1100", "English-The Ball Poem-1100", "English-From Diary of Anne Frank-1100", "English-The Hundred Dresses 1-1100", "English-The Hundred Dresses 2-1100", "Social science-Power Sharing (Political Science)-1100", "Social science-Federalism (Political Science)-1100", "Social science-Development (Economics))-1100", "Social science-Sectors of Indian Economy (Economics)-1100", "Science-Life Processes (Biology)-1100", "Science-Chemical reactions and equations (Chemistry)-1100", "Science-Acids, Bases and salts (Chemistry)-1100", "Science-Metals and Non metals (Chemistry)-1100", "Science-Reflection of light (Physics)-1100", "Science-Refraction of light (physics)-1100", "Science-The human Eye and colourful world (physics)-1100", "Social science-Resources and Development (Geography)-1100", "Social science-Water Resources (Geography)-1100", "Social science-Agriculture (Geography)-1100", "Social science-The Rise of Nationalism in Europe (History)-1100"];
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
    user["chapters"] = syllabus;
    user["totalstudy"] = syllabus.length;
    user["leftstudy"] = syllabus.length;
    user["donestudy"] = 0;
    user["totalwork"] = syllabus.length;
    user["leftwork"] = syllabus.length;
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
