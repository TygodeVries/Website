const params = new URLSearchParams(window.location.search);

const year = params.get('year');
const id = params.get('id');

console.log(year); // "2"
console.log(id);   // "test"

function back() {
    history.go(-1);
}

async function loadContent() {
    const response = await fetch('../sessions.json');
    const json = await response.json();

    const yearData = json.years.find(y => y.id === year);

    if (!yearData) {
        back();
        return;
    }

    const session = yearData.sessions.find(s => s.id === id);

    if (!session) {
        back();
        return;
    }

    document.getElementById('title').innerText = session.title;

    document.getElementById('session-description').innerText =
        session.content?.text ?? session.about ?? "No content available.";


    var downloadContent = "";
    session.content.downloads.forEach(element => {
        downloadContent += `<a href="${element.link}" class="download-button">
                <span>${element.name}</span>
            </a>`;
    });

    document.getElementById('downloads').innerHTML += downloadContent;
}

loadContent();