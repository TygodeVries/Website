// A function that will download a file when called from a spesific path (r/package/example.unitypackage)
function downloadFile() {
    var element = document.createElement('a');
    element.setAttribute('href', '/r/package/example.unitypackage');
    element.setAttribute('download', 'example.unitypackage');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}