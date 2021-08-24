$(document).ready(function($){
    load($);
});

function closeItem(id) {
    document.getElementById(id+"-info").remove();
    document.getElementById(id+"-button").onclick = function() {openItem(id);};
}

function choose(subject) {
    user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        console.error("No id detected.");
        alert("You haven't created id yet.")
        return null;
    }
    s = subject.at(0).toUpperCase() + subject.substr(1, subject.length);
    s = s.replace("-", " ");
    document.getElementById("chapter-subject").value = s;
    document.getElementById("rem-chapter-subject").value = s;
    document.getElementById("mark-chapter-subject").value = s;
    updateChs(subject, user);
}

function openItem(id) {
    const item = document.getElementById(id);
    document.getElementById(id+"-button").onclick = function() {closeItem(id);};
    const card = document.createElement("div");
    const header = document.createElement("div");
    const body = document.createElement("div");
    const study = document.createElement("p");
    const mark1 = document.createElement("button");
    const mark2 = document.createElement("button");
    const rem = document.createElement("button");
    card.id = id+"-info";
    card.className = "card text-center bg-secondary text-white text-uppercase";
    card.style = "margin-top: 20px;width: 500px;height: 170px;"
    header.className = "card-header bg-dark text-primary";
    header.innerHTML = id.split('-').at(0) + "-" + id.split('-').at(1);
    body.className = "card-body";
    study.innerHTML = "Study : " + (id.at(-4) == '1'?(id.at(-2) == '1'?"Done":"Left"):"NA") + " | Work : " + (id.at(-3) == '1'?(id.at(-1) == '1'?"Done":"Left"):"NA");
    mark1.className = "btn btn-primary text-uppercase";
    mark1.innerHTML = id.at(-2) == '0'?"studied":"un-studied";
    mark1.onclick = function() {flipStudy(id);};
    if (id.at(-4) == '0') mark1.disabled = "disabled";
    mark2.className = "btn btn-primary text-uppercase";
    mark2.innerHTML = id.at(-1) == '0'?"worked":"left-work";
    mark2.onclick = function() {flipWork(id);};
    if (id.at(-3) == '0') mark2.disabled = "disabled";
    mark2.style = "margin-left: 20px;";
    rem.className = "btn btn-primary text-uppercase";
    rem.innerHTML = "remove";
    rem.onclick = function() {remove(id);};
    rem.style = "margin-left: 20px;";
    body.style = "margin-top: 10px;";
    body.appendChild(study);
    body.appendChild(mark1);
    body.appendChild(mark2);
    body.appendChild(rem);
    card.appendChild(header);
    card.appendChild(body);
    item.appendChild(card);
}

function add(t, id, color) {
    const type = ["success", "warning", "danger"];
    const item = document.createElement('li');
    const button = document.createElement('button');
    const text = document.createTextNode(t);
    item.className = "list-group-item list-group-item-action list-group-item-" + type[color];
    item.id = id;
    button.className = "list-group-item list-group-item-action list-group-item-" + type[color];
    button.id = id+"-button"
    button.style = "outline: none;"
    button.onclick = function() {openItem(id);};
    button.appendChild(text);
    item.appendChild(button);
    document.getElementById("list").appendChild(item);
}

function drawChart() {
    user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        console.error("No id detected.");
        alert("You haven't created id yet.")
        return null;
    }
    const params = new URLSearchParams(window.location.search);
    subject = params.get("subject");
    const ld = leftDone(user["chapters"], subject)
    CS = ld[1];
    LS = ld[0];
    CW = ld[3];
    LW = ld[2];
    var data = google.visualization.arrayToDataTable([['Syllabus', 'Left'], ['Completed', CS], ['Left', LS]]);
    var dataWork = google.visualization.arrayToDataTable([['Work', 'Left'], ['Completed', CW], ['Left', LW]]);
    var options = {
      title: 'Syllabus ' + subject,
      is3D: true,
      slices: {0: {offset: 0.1, color: "green"}, 1: {offset: 0.1, color: "red"},},
    };
    var optionsWork = {
      title: 'Work ' + subject,
      is3D: true,
      slices: { 0: {offset: 0.1, color: "green"}, 1: {offset: 0.1, color: "red"},}
    };
    var work = [null, null, null, null, null, null, null, null];
    var study = [null, null, null, null, null, null, null, null];
    console.log("drawing graph.");
    $("#graph").shieldChart({
      theme: "light",
      primaryHeader: {text: "Activities last 7 days("+subject+")."},
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
};

function load($) {
    const params = new URLSearchParams(window.location.search);
    subject = params.get("subject");
    if (["maths", "computer", "science", "hindi", "english", "social-science"].includes(subject) == false) {
        console.error("Invalid subject = ", subject);
        alert("Invalid subject = " + subject);
    }
    prettySubject = subject.charAt(0).toUpperCase() + subject.slice(1);
    console.log(prettySubject);
    document.getElementById("title").innerHTML = prettySubject;
    document.getElementById("head").innerHTML = prettySubject;
    document.getElementById(subject).className += "nav-link text-danger";
    user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        console.error("No id detected.");
        alert("You haven't created id yet.")
        document.location = "index.html";
        return null;
    }
    document.getElementById("add-chapter").onclick = function() {choose(subject);};
    document.getElementById("rem-chapter").onclick = function() {choose(subject);};
    document.getElementById("mark-chapter").onclick = function() {choose(subject);};
    document.getElementById("add-chapter1").onclick = function() {choose(subject);};
    document.getElementById("rem-chapter1").onclick = function() {choose(subject);};
    document.getElementById("mark-chapter1").onclick = function() {choose(subject);};
    chapters = sortChapters(user["chapters"], subject);
    while (document.getElementById("list").lastChild) {
        document.getElementById("list").removeChild(document.getElementById("list").lastChild);
    }
    chapters.forEach( chapter => {
        add(chapter[0], chapter[1], chapter[2]);
    });
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    drawChart();
    console.log(chapters);
}