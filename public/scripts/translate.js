const ankiApi = 'https://anki.neverdieone.ru'

function addCardToDeck() {
    let selection = window.getSelection();
    let selectionText = selection.toString();
    let translateText = document.getElementById('translateText').innerText

    chrome.storage.sync.get(['currentDeckId'], async function(items) {
        let deckId = items.currentDeckId
        let response = await fetch(
            `${ankiApi}/anki/${deckId}/card?fields=${selectionText}::${translateText}`,
            {
                method: 'POST'
            }
        )
        console.log(response.json())
    });

    let translateElement = document.getElementById('translate')
    translateElement.parentNode.removeChild(translateElement)
}

function createPopUp(text, x, y) {
    return `
    <div 
        id="translate"
        style="position: absolute;
        top: ${y}px;
        left: ${x}px;
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

async function getTranslation(text) {
    let response = await fetch(`${ankiApi}/translate/?text=${text}`)
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

        let oRange = selection.getRangeAt(0); //get the text range
        let oRect = oRange.getBoundingClientRect();

        let translation = await getTranslation(selectionText)
        let popup = createPopUp(translation, oRect.right, oRect.bottom)
        document.body.insertAdjacentHTML('beforeend', popup)
        
        addButton = document.getElementById('addToDeck')
        addButton.addEventListener('click', addCardToDeck)
    }

    if (event.code == 'Escape') {
        let translateElement = document.getElementById('translate')
        if (translateElement) {
            translateElement.parentNode.removeChild(translateElement)
        }
    }
}

function onClick(event) {
    let elementId = event.target.id
    if (elementId.includes('translate') || elementId.includes('translateText')) {
        return
    }

    let translateElement = document.getElementById('translate')
    if (translateElement) {
        translateElement.parentNode.removeChild(translateElement)
    }
}

document.addEventListener('keyup', handleKeyUp, {
    capture: false,
});
document.addEventListener('click', onClick, false)
console.log('Translator is ready')