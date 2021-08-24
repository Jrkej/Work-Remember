function sortChapters(l, subject) {
    sub = subject.replace("-", " ");
    chapters = [];
    console.log(l);
    l.forEach(element => {
        splits = element.split("-");
        if (splits[0].toLowerCase() == sub.toLowerCase()) {
            let color = 0;
            if (element.at(-1) == '0' && element.at(-3) == '1') color += 1;
            if (element.at(-2) == '0' && element.at(-4) == '1') color += 1;
            chapters = chapters.concat([[splits[1], element, color]]);
        }
    });
    return chapters;
}

function leftDone(l, subject) {
    sub = subject.replace("-", " ");
    const ld = [0, 0, 0, 0];
    l.forEach(element =>{
        splits = element.split("-");
        if (splits[0].toLowerCase() == sub.toLowerCase()) {
            if (element.at(-4) == '1') {
                if (element.at(-2) == '0') ld[0] += 1;
                if (element.at(-2) == '1') ld[1] += 1;
            }
            if (element.at(-3) == '1') {
                if (element.at(-1) == '0') ld[2] += 1;
                if (element.at(-1) == '1') ld[3] += 1;
            }
        }
    });
    return ld;
}

function replace(s, idx, t) {
    if (idx < 0) idx = s.length + idx;
    return s.substr(0, idx) + t + s.substr(idx+1, s.length);
}

function flipStudy(id, mark = false) {
    user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        console.error("No id detected.");
        if (mark == false) alert("You haven't created id yet.");
        if (mark) return id;
        return null;
    }
    if (id.at(-4) == '0') {
        console.error("Chapter can't be marked studied.");
        if (mark == false) alert("Chapter can't be marked studied.");
        if (mark) return id;
        return null;
    }
    if (user["chapters"].includes(id)) {
        const idx = user["chapters"].indexOf(id);
        const toChange = id.at(-2) == '0'?'1':'0';
        if (mark && toChange == '0') {
            console.log("Already marked!");
            return id;
        }
        user["chapters"][idx] = replace(user["chapters"][idx], -2, toChange);
        console.log(user["chapters"][idx]);
        user["donestudy"] += toChange == '1'?1:-1;
        user["leftstudy"] += toChange == '0'?1:-1;
        localStorage["user"] = JSON.stringify(user);
        if (mark) return user["chapters"][idx];
        load($);
    }
    else {
        console.error("Id not in list.");
        if (mark == false) alert("Not a valid request.");
        if (mark) return id;
        return null;
    }
}

function flipWork(id, mark = false) {
    user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        console.error("No id detected.");
        if (mark == false) alert("You haven't created id yet.");
        return null;
    }
    if (id.at(-3) == '0') {
        console.error("Chapter can't be marked work done.");
        if (mark == false) alert("Chapter can't be marked work done.");
        return null;
    }
    if (user["chapters"].includes(id)) {
        const idx = user["chapters"].indexOf(id);
        const toChange = id.at(-1) == '0'?'1':'0';
        if (mark && toChange == '0') {
            console.log("Already marked!");
            return null;
        }
        user["chapters"][idx] = replace(user["chapters"][idx], -1, toChange);
        console.log(user["chapters"][idx]);
        user["donework"] += toChange == '1'?1:-1;
        user["leftwork"] += toChange == '0'?1:-1;
        localStorage["user"] = JSON.stringify(user);
        if (mark) return null;
        load($);
    }
    else {
        console.error("Id not in list.");
        alert("Not a valid request.");
        return null;
    }
}

function updateChs(subject, user) {
    console.log(subject);
    const selection = document.getElementById("rem-chapter-name");
    const selection1 = document.getElementById("mark-chapter-name");
    while (selection.firstChild) {
        selection.removeChild(selection.firstChild);
    }
    while (selection1.firstChild) {
        selection1.removeChild(selection1.firstChild);
    }
    if (subject == "choose subject") {
        const option = document.createElement("option");
        option.innerHTML = "None";
        const option2 = document.createElement("option");
        option2.innerHTML = "Choose Subject First";
        selection.appendChild(option);
        selection.appendChild(option2);
        selection1.appendChild(option);
        selection1.appendChild(option2);
        return null
    }
    chapters = sortChapters(user["chapters"], subject);
    if (chapters.length == 0) {
        const option = document.createElement("option");
        option.innerHTML = "No Chapters Found";
        selection.appendChild(option);
        selection1.appendChild(option);
    }
    chapters.forEach(chapter => {
        const option = document.createElement("option");
        option.id = "remove "+chapter[1];
        option.innerHTML = chapter[0];
        selection.appendChild(option);
        option.id = "mark "+chapter[1];
        selection1.appendChild(option);
    });
}

function loadChaptersMark() {
    user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        console.error("No id detected.");
        alert("You haven't created id yet.");
        return null;
    }
    subject = document.getElementById("mark-chapter-subject").value;
    updateChs(subject.toLowerCase(), user);
}


function loadChapters() {
    user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        console.error("No id detected.");
        alert("You haven't created id yet.");
        return null;
    }
    subject = document.getElementById("rem-chapter-subject").value;
    updateChs(subject.toLowerCase(), user);
}

function removeChapter() {
    const sel = document.getElementById("rem-chapter-name");
    const idx = sel.selectedIndex;
    remove(sel.childNodes[idx].id.split(" ").at(1));
}

function markChapter() {
    const sel = document.getElementById("mark-chapter-name");
    const idx = sel.selectedIndex;
    let id = sel.childNodes[idx].id.split(" ").at(1);
    console.log(id);
    id = flipStudy(id, true);
    flipWork(id, true);
    load($);
}

function addChapter() {
    user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        console.error("No id detected.");
        alert("You haven't created id yet.");
        return null;
    }
    let name = document.getElementById("chapter-name").value;
    if (name.includes("-")) {
        console.error("`-` in chapter name.");
        alert("Please remove `-` from chapter name.");
        refreshDrop();
        return null;
    }
    const idx = document.getElementById("chapter-subject").selectedIndex;
    let subject = document.getElementById("chapter-subject").value;
    let study = document.getElementById("chapter-study").checked;
    let work = document.getElementById("chapter-work").checked;
    if (name == "") {
        console.error("Invalid subject name entry.");
        alert("Enter a subject name! Invalid entry.");
        refreshDrop();
        return null;
    }
    if (idx == 0) {
        console.error("No subject selected");
        alert("Please select a subject!");
        refreshDrop();
        return null;
    }
    if (study == false && work == false) {
        console.error("Both work and study = false");
        alert("Atleast select one of Study and Work.");
        refreshDrop();
        return null;
    }
    const id = subject+"-"+name+"-"+(study?"1":"0")+(work?"1":"0")+"00";
    console.log(id, " adding subject!");
    if (user["chapters"].includes(id)) {
        console.error("Chapter already exists!");
        alert("Chapter already exists!");
        refreshDrop();
        return null;
    }
    user["chapters"] = user["chapters"].concat(id);
    if (study) {
        user["totalstudy"] += 1;
        user["leftstudy"] += 1;
    }
    if (work) {
        user["totalwork"] += 1;
        user["leftwork"] += 1;
    }
    localStorage["user"] = JSON.stringify(user);
    refreshDrop();
    load($);
}

function remove(id) {
    user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
        console.error("No id detected.");
        alert("You haven't created id yet.");
        return null;
    }
    if (user["chapters"].includes(id)) {
        user["chapters"].splice(user["chapters"].indexOf(id), 1);
        console.log("Removed - ", id);
        if (id.at(-4) == '1') {
            user["totalstudy"] -= 1;
            user["leftstudy"] -= id.at(-2) == '0'?1:0;
            user["donestudy"] -= id.at(-2) == '1'?1:0;
        }
        if (id.at(-3) == '1') {
            user["totalwork"] -= 1;
            user["leftwork"] -= id.at(-1) == '0'?1:0;
            user["donework"] -= id.at(-1) == '1'?1:0;
        }
        localStorage["user"] = JSON.stringify(user);
        load($);
    }
    else {
        console.error("Id not in list.");
        alert("Not a valid request.");
        return null;
    }
}
function refreshDrop() {
    document.getElementById("chapter-name").value = "";
    document.getElementById("chapter-subject").selectedIndex = 0;
    document.getElementById("chapter-study").checked = true;
    document.getElementById("chapter-work").checked = true;
}