let bpm;
let songLength = 0;
let audio = null;
let intervalId = null;

document.getElementById("clip").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener("loadedmetadata", function () {
        songLength = audio.duration;
        console.log(songLength);
    });
});

document.querySelector(".bpm input").addEventListener("input", function (event) {
    bpm = parseFloat(event.target.value);
});

document.getElementById("play-button").addEventListener("click", function () {
    if (!audio || !bpm) {
        alert("select an audio file and enter BPM.");
        return;
    }

    clearInterval(intervalId);
    audio.currentTime = 0;
    audio.play();
    highlightProgress();
});

document.getElementById("stop-button").addEventListener("click", function () {
    
    if(audio.paused)
    {
        audio.play();
    }
    else {
        audio.pause();
    }
});

function load() {
    if (bpm == null || songLength == null) {
        alert("Please fill out the data first");
        return;
    }

    const editor = document.getElementById("editor");
    editor.innerHTML = "";

    const beatInterval = 60 / bpm;
    const totalBeats = Math.floor(songLength / beatInterval);
    const totalSteps = Math.floor(totalBeats);

    for (let i = 0; i < totalSteps; i++) {
        const row = document.createElement("div");
        row.classList.add("measure-row");
        row.dataset.index = i;

        const time = (i * beatInterval).toFixed(2);
        const timeLabel = document.createElement("span");
        timeLabel.textContent = `${time}s`;

        row.appendChild(timeLabel);

        for (let j = 0; j < 4; j++) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.style.marginRight = "10px";
            row.appendChild(checkbox);
        }

        if(document.getElementById("lighting").checked)
        {
            const lightCheckbox = document.createElement("select");
            lightCheckbox.options.add(new Option("Don't Change", "keep"));
            lightCheckbox.options.add(new Option("Regular", "regular"));
            lightCheckbox.options.add(new Option("Dark", "dark"));
            lightCheckbox.options.add(new Option("Bright", "bright"));
            lightCheckbox.options.add(new Option("Spot", "spot"));
            row.appendChild(lightCheckbox);
        }

        editor.appendChild(row);
    }
}

function exportFile() {


    var output = "";
    var checkboxes = document.querySelectorAll("input[type='checkbox']");
    var lightingOptions = document.querySelectorAll("select");
    checkboxes.forEach(element => {
        if(element.checked) {
            output += "X"
        }
        else {
            output += "."
        }

        if ((Array.from(checkboxes).indexOf(element) + 1) % 4 === 0) {
            if(document.getElementById("lighting").checked)
            {
                lightingOptions[Math.floor(Array.from(checkboxes).indexOf(element) / 4)].value;
                output += " " + lightingOptions[Math.floor(Array.from(checkboxes).indexOf(element) / 4)].value;
            }
            
            output += "\n";
        }
    });

    download("beatmap.txt", output);
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function highlightProgress() {
    clearInterval(intervalId);

    var beatInterval = 60 / bpm;
    var measureDuration = beatInterval;

    var rows = document.querySelectorAll(".measure-row");
    var totalSteps = rows.length;
    var progressSlider = document.getElementById("progress-slider");
    var containerHeight = document.getElementById("editor").offsetHeight;

    progressSlider.innerHTML = "";
    var sliderBar = document.createElement("div");
    sliderBar.style.width = "100%";
    sliderBar.style.height = "20px";
    sliderBar.style.background = "#04ff00ff";
    sliderBar.style.position = "relative";
    progressSlider.appendChild(sliderBar);

    intervalId = setInterval(() => {
        if (!audio) {
            clearInterval(intervalId);
            return;
        }

        var timeNow = audio.currentTime;
        var current = Math.floor(timeNow / measureDuration);

        rows.forEach((row, index) => {
            if (index === current) {
                row.style.background = "#17ff23ff";
            } else {
                row.style.background = "transparent";
            }
        });

        var pr = current / totalSteps;
        var topOffset = pr * containerHeight;
        sliderBar.style.transform = `translateY(${topOffset}px)`;
    }, 100);
}
