const ankiApi = 'https://anki.neverdieone.ru'

function addCardToDeck() {
    let selection = window.getSelection();
    let selectionText = selection.toString();
    let translateText = document.getElementById('translateTextAnki').innerText

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

    let translateElement = document.getElementById('translateAnki')
    translateElement.parentNode.removeChild(translateElement)
}

function createPopUp(text, x, y) {
    return `
    <div id="translateAnki" style="top: ${y}px; left: ${x}px;">
        <div id="translateTextAnki">${text}</div>
        <br />
        <br />
        <button id="addToDeckAnki">Добавить в колоду</button>
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

        let translateElement = document.getElementById('translateAnki')
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
        
        addButton = document.getElementById('addToDeckAnki')
        addButton.addEventListener('click', addCardToDeck)
    }

    if (event.code == 'Escape') {
        let translateElement = document.getElementById('translateAnki')
        if (translateElement) {
            translateElement.parentNode.removeChild(translateElement)
        }
    }
}

function onClick(event) {
    let elementId = event.target.id
    if (elementId.includes('translateAnki') || elementId.includes('translateTextAnki')) {
        return
    }

    let translateElement = document.getElementById('translateAnki')
    if (translateElement) {
        translateElement.parentNode.removeChild(translateElement)
    }
}

document.addEventListener('keyup', handleKeyUp, {
    capture: false,
});
document.addEventListener('click', onClick, false)
console.log('Translator is ready')