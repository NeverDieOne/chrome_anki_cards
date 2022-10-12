var x = null;
var y = null;

function getMouseX() {
    return x;
  }


function getMouseY() {
    return y;
}


function addCardToDeck() {
    let selection = window.getSelection();
    let selectionText = selection.toString();

    let translateText = document.getElementById('translateText')

    console.log(translateText.innerText)
    console.log(selectionText)

    chrome.storage.sync.get(['currentDeckId'], function(items) {
        console.log(items.currentDeckId)
    });

    let translateElement = document.getElementById('translate')
    translateElement.parentNode.removeChild(translateElement)
}


function createPopUp(text) {
    let posY = getMouseY()
    let posX = getMouseX()

    return `
    <div 
        id="translate"
        style="position: absolute;
        top: ${posY}px;
        left: ${posX}px;
        border:1px solid #eeeeee;
        padding: 15px;
        background-color: #8dcaff;
        border-radius: 10px;
        z-index: 999;
        text-align: center;"
    >
        <div style="display: inline-block" id="translateText">${text}</div>
        <br />
        <br />
        <button
            id="addToDeck"
            style="border-radius: 5px;
            border:1px solid #f5f5f5;
            background-color: #7fcbff;
            display: inline-block;"
        >Добавить в колоду</button>
    </div>
    `
}


function onMouseUpdate(e) {
    x = e.pageX;
    y = e.pageY;
  }

async function getTranslation(text) {
    let response = await fetch(`http://127.0.0.1:9999/anki/translate?text=${text}`)
    return response.json() 
}


async function handleKeyUp(event) {
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

        let translation = await getTranslation(selectionText)
        let popup = createPopUp(translation)
        document.body.insertAdjacentHTML('beforeend', popup)
        
        addButton = document.getElementById('addToDeck')
        addButton.addEventListener('click', addCardToDeck)
    }
}

document.addEventListener('keyup', handleKeyUp, {
    capture: false,
});
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);



console.log('Translator is ready')