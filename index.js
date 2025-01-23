function isMobile()
{
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}


document.title = "Home | TheSheep.Dev";
var header_images = [
    document.getElementById('header1'), 
    document.getElementById('header2'), 
    document.getElementById('header3'), 
    document.getElementById('header4') ];

var selected = 0;
var goal = 0;

window.onresize = function(e)
{
    redraw();
}

function rescale(real_mouse_x)
{
    var mousePrecent = real_mouse_x / window.innerWidth;

    mouse_x = Math.floor(mousePrecent * 5);

    if(mouse_x != goal && mouse_x != (goal + 1)) {

        if(mouse_x < goal)
        {
            goal = mouse_x;
        }

        if(mouse_x > goal)
        {
            goal = mouse_x - 1;
        }
    }
    redraw();
}

redraw();

function redraw() {
    var totalWidth = window.innerWidth;
    var imageWidth = totalWidth / (header_images.length + 1);

    for (let i = 0; i < header_images.length; i++) {
        header_images[i].style.height = window.innerHeight + "px";

        // We want to make the selected one twice as big
        if (i == Math.round(selected)) {
            header_images[i].style.width = (imageWidth * 2) + "px";
        } else {
            header_images[i].style.width = (imageWidth - 10 ) + "px";
        }
    }
}

function update()
{
    selected = goal;
    rescale(mouseX);
}

setInterval(update, 1000 / 5);


/// Mouse Location
let mouseX = 0;
let mouseY = 0;

window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
    }
});

window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});