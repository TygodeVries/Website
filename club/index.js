function download(name)
{
    var element = document.createElement('a');
    element.setAttribute('href', name);
    element.setAttribute('download', name.split('/').pop());
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
