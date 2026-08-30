async function loadContent() {
    const response = await fetch('./sessions.json');
    const json = await response.json();

    const content = document.getElementById('content');

    if (content == null) {
        alert("Page content is null!");
        return;
    }

    let html = '';

    for (const year of json.years) {
        html += `
            <div class="year-container">
                <div class="divider"></div>
                <div class="year-title">${year.title}</div>
                <div class="sessions-container">`;

        for (const session of year.sessions) {

            let todayClass = "";

            if (session.today === true) {
                todayClass = "today";
            }

            html += `
                <div class="session"
                     data-year="${year.id}"
                     data-session="${session.id}">
                    <img src="${session.img}"
                         class="session-img"
                         alt="The session ${session.title}">
                    <div class="session-content ${todayClass}">
                        <div class="session-title">${session.title}</div>
                        <div class="session-discr">${session.about}</div>
                    </div>
                </div>`;
        }

        html += `
                </div>
            </div>`;
    }

    content.innerHTML = html;
}

loadContent();


let dragging = null;
let startX = 0;
let scrollLeft = 0;
let hasDragged = false;
let wasDragged = false;


function mousedown(event) {
    const container = event.target.closest('.sessions-container');

    if (!container) return;

    dragging = container;
    hasDragged = false;
    wasDragged = false;

    dragging.style.cursor = 'grabbing';
    dragging.style.scrollBehavior = 'auto';

    startX = event.pageX - dragging.offsetLeft;
    scrollLeft = dragging.scrollLeft;
}


function mousemove(event) {
    if (!dragging) return;

    const x = event.pageX - dragging.offsetLeft;
    const walk = x - startX;

    if (Math.abs(walk) > 5) {
        hasDragged = true;
        wasDragged = true;
    }

    if (hasDragged) {
        event.preventDefault();
        dragging.scrollLeft = scrollLeft - walk;
    }
}


function mouseup() {
    if (!dragging) return;

    dragging.style.cursor = 'grab';
    dragging.style.scrollBehavior = 'smooth';

    dragging = null;
}


document.addEventListener('click', function (event) {
    const session = event.target.closest('.session');

    if (!session) return;

    if (wasDragged) {
        wasDragged = false;
        return;
    }

    const year = session.dataset.year;
    const id = session.dataset.session;

    const url = new URL(
        `session/?year=${encodeURIComponent(year)}&id=${encodeURIComponent(id)}`,
        window.location.href
    );

console.log(url.href);

window.location.href = url.href;
});


document.addEventListener("mousedown", mousedown);
document.addEventListener("mousemove", mousemove);
document.addEventListener("mouseup", mouseup);
document.addEventListener("mouseleave", mouseup);


function discord() {
    window.open(
        "https://discord.gg/S7ag7aC9Eu",
        "_blank"
    ).focus();
}