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
    let translateText = document.getElementById('translateText').innerText

    chrome.storage.sync.get(['currentDeckId'], async function(items) {
        let deckId = items.currentDeckId
        let response = await fetch(
            `http://127.0.0.1:9999/anki/${deckId}/card?fields=${selectionText}::${translateText}`,
            {
                method: 'POST'
            }
        )
        console.log(response.json())
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
        background-color: #f5f5f5;
        border-radius: 10px;
        z-index: 999;
        text-align: center;
        max-width: 500px;
        box-shadow: 5px 5px 10px gray;"
    >
        <div style="display: inline-block; color: black;" id="translateText">${text}</div>
        <br />
        <br />
        <button
            id="addToDeck"
            style="border-radius: 5px;
            border:1px solid #f5f5f5;
            background-color: #ffffff;
            display: inline-block;
            color: black;"
        >Добавить в колоду</button>
    </div>
    `
}


function onMouseUpdate(e) {
    x = e.pageX;
    y = e.pageY;
  }

async function getTranslation(text) {
    let response = await fetch(`http://127.0.0.1:9999/translate/?text=${text}`)
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