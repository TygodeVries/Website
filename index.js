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

document.body.ontouchmove = function(e)
{
    if(isMobile())
    {
        console.log("we are on mobile")
        rescale(e.touches[0].clientX);

    }
}

document.body.ontouchstart = function(e)
{
    if(isMobile())
    {
        console.log("we are on mobile")
        rescale(e.touches[0].clientX);

    }
}


document.onmousemove = (e) => { rescale(e.clientX) };

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

    console.log(goal + ", " + selected)
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
}

function lerp(a, b, t)
{
    return a + (b - a) * t;
}

setInterval(update, 1000 * 0.2);