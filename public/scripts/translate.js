var x = null;
var y = null;

function getMouseX() {
    return x;
  }


function getMouseY() {
    return y;
}


function addCardToDeck(text) {
    chrome.storage.sync.get(['currentDeckId'], function(items) {
        console.log(items.currentDeckId)
    });
}


function createPopUp(text) {
    let posY = getMouseY()
    let posX = getMouseX()

    return `
    <div id="translate" style="position: absolute; top: ${posY}px; left: ${posX}px">
        ${text}
    </div>
    `
}


function onMouseUpdate(e) {
    x = e.pageX;
    y = e.pageY;
  }


function handleKeyUp(event) {
    if (event.altKey && event.code == 'KeyT') {
        event.preventDefault();
        event.stopPropagation();

        let translateElement = document.getElementById('translate')
        if (translateElement) {
            translateElement.parentNode.removeChild(translateElement)
            return
        }

        let selection = window.getSelection();
        let selectionText = selection.toString();
        if (!selectionText) {
            return
        }

        let popup = createPopUp(selectionText)
        document.body.insertAdjacentHTML('beforeend', popup)
    }
}

document.addEventListener('keyup', handleKeyUp, {
    capture: false,
});
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

console.log('blabla')