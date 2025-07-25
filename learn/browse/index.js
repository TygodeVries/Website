const params = new URLSearchParams(window.location.search);
const error = params.get('error');

var halt = false;

if (error != undefined) {
	var errorText = 'Something went wrong!';

	if (error == 'course_not_found') {
		errorText = 'This course could not be found.';
	}

	if (error == 'quests_file_lost') {
		errorText =
			'We could not load the quests at this point, Check back later.';
		halt = true;
	}

	Swal.fire({
		icon: 'error',
		title: 'Error!',
		text: errorText,
		showConfirmButton: true,
		footer: 'Error code: ' + error,
	}).then(() => {
		window.location.href = '?';
	});
}

async function loadCourses() {
	const response = await fetch('./data/quests.json');

	if (!response.ok) {
		window.location.href = '?error=quests_file_lost';
		return;
	}

	const data = await response.json();
	data['quests'].forEach((quest) => {
		var generated = '<div class="quest">';
		generated += '<h2>' + quest.name + '</h2>';

		quest['lessons'].forEach((lesson) => {
			var checked = 'unchecked';
			if (`${localStorage.getItem(lesson.id)}` === 'true') {
				// wow this is dumb.
				checked = 'checked';
			}

			generated += `<input type="checkbox" class="course-checkbox" id="${lesson.id}" ${checked}>`;
			generated += `<a href="../course/?lesson=${lesson.id}" class="quest-link">${lesson.name}</a><br>`;
		});

		generated += '</div>';

		document.getElementById('quests').innerHTML += generated;
	});

	const checkboxes = document.querySelectorAll('.course-checkbox');

	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('change', (event) => {
			const isChecked = event.target.checked;
			const id = event.target.id;

			console.log(
				`Checkbox ${id} is now ${isChecked ? 'checked' : 'unchecked'}`
			);

			if(isChecked)
				createConfetti();
			
			localStorage.setItem(id, isChecked);
		});
	});
}

if (!halt) {
	loadCourses();
}


function createConfetti()
{
	const defaults = {
  spread: 360,
  ticks: 100,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
};

function shoot() {
  confetti({
    ...defaults,
    particleCount: 30,
    scalar: 1.2,
    shapes: ["circle", "square"],
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  });

  confetti({
    ...defaults,
    particleCount: 20,
    scalar: 2,
    shapes: ["emoji"],
    shapeOptions: {
      emoji: {
        value: ["🦄", "🌈"],
      },
    },
  });
}

setTimeout(shoot, 0);
setTimeout(shoot, 100);
setTimeout(shoot, 200);
}