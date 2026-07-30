async function loadContent() {
    const response = await fetch('./sessions.json');
    const json = await response.json();
    const content = document.getElementById('content');

    let html = '';

    for (const year of json.years) {
        html += `
            <div class="year-container">
                <div class="year-title">${year.title}</div>
                <div class="sessions-container">`;

        for (const session of year.sessions) {

            var todayClass = "";

            if(session.today == true)
            {
                todayClass = "today";
            }

            html += `
                <div class="session">
                    <img src="${session.img}" class="session-img" alt="The session ${session.title}">
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

    content.innerHTML = html; // Set innerHTML only once at the end
}
loadContent();