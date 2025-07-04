codeElements = [];
nextLesson = "unknown";

async function loadLesson() {
	const params = new URLSearchParams(window.location.search);
	const lesson = params.get("lesson").replace(">", "/");
	console.log("Loading: " + lesson);

	const response = await fetch("./course-info/" + lesson + ".json");

	if (!response.ok) {
		window.location.href = "../browse/?error=course_not_found";
		return;
	}

	const data = await response.json();

	document.title = data["title"];
	document.getElementById("title").innerText = data["title"];
	document.getElementById("description").innerText = data["description"];

	var content = "";
	const sections = data["sections"];

	nextLesson = data["next"];

	var codeBlockIndex = 0;
	sections.forEach((section) => {
		if (section["type"] === "text") {
			content +=
				'<pre><p class="content-text">' +
				section["content"] +
				"</p></pre>";
		} else if (section["type"] === "code") {
			content +=
				'<button onclick="copyCode(' +
				codeBlockIndex +
				')" class="copy-button">Copy</button>';
			content +=
				'<pre><code class="' +
				section["lang"] +
				'">' +
				section["content"] +
				"</code></pre>";
			codeElements[codeBlockIndex] = section["content"];
			codeBlockIndex++;
		} else if (section["type"] === "image") {
			content += '<button class="image-box" onclick="zoom(this)">';
			content +=
				"<image src=" + section["content"] + ' class="zoom"></image>';
			content +=
				'<div class="content-text">' + section["context"] + "</div>";
			content += "</button>";
		} else {
			content +=
				'<pre><p class="content-text content-invalid">Invalid Type: ' +
				section["type"] +
				" (Corrupt Course?)</p></pre>";
		}
	});

	var contentHtml = document.getElementById("content");

	if (contentHtml == undefined) {
		console.error("Could not find content tag!");
	}

	contentHtml.innerHTML = content;

	Prism.highlightAll();
}

function copyCode(index) {
	const code = codeElements[index];
	navigator.clipboard.writeText(code);

	Swal.fire({
		icon: "success",
		title: "Copied!",
		text: "The text has been copied to your clipboard.",
		showConfirmButton: false,
		timer: 1500,
	});
}

function zoom(element) {
	console.log(element.innerHTML);
	Swal.fire({
		html: element.innerHTML,
		width: "90%",
		confirmButtonText: "Close",
	});
}

loadLesson();

function help() {
	Swal.fire({
		title: "How do you want help?",
		showDenyButton: true,
		showCancelButton: true,

		confirmButtonColor: "#6a9942",
		confirmButtonText: "Ask a Human 🙋‍♂️",

		denyButtonColor: "#4d84a1",
		denyButtonText: `Ask ChatGPT 🤖`,
	}).then((result) => {
		if (result.isConfirmed) {
			window.open("https://discord.gg/U92cNGZyrT"); // Discord URL Yay
		} else if (result.isDenied) {
			const params = new URLSearchParams(window.location.search);
			const lesson = params.get("lesson");

			const prompt =
				"I am following a beginners programming course.\nI am currently on the page https://thesheep.dev/learn/course?lesson=" +
				lesson +
				", raw course data (JSON) https://thesheep.dev/learn/course/course-info/" +
				lesson +
				".json\nUse it to help me, explain everything clearly.\nIf you cannot understand the problem based on the available data, do not guess — ask the user to contact a human on the page instead.\nMy question is: ";
			const encodedPrompt = encodeURIComponent(prompt);
			const url = `https://chat.openai.com/?&prompt=${encodedPrompt}`;

			window.open(url, "_blank", "noopener,noreferrer");
		}
	});
}

function next() {
	window.location.href = "?lesson=" + nextLesson;
}

function exit() {
	window.location.href = "../browse/";
}
