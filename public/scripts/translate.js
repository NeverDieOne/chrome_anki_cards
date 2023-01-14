const ankiApi = 'https://anki.neverdieone.ru'


function createPopUp(from, text, x, y) {
    return `
    <div id="translateAnki" style="top: ${y}px; left: ${x}px;">
        <div id="translateTextAnki" data-translate-from="${from}">${text}</div>
        
        <div style="margin: auto;">
            <svg class="addToDeckIcon" width="52" height="52" version="1.1" id="addToDeckAnki" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
            y="0px" viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve">
            <g>
                <path d="M38.8,22.3h-5.1v-5.1c0-1-0.8-1.8-1.8-1.8s-1.8,0.8-1.8,1.8v5.1h-5.1c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8h5.1v5.1
                    c0,1,0.8,1.8,1.8,1.8s1.8-0.8,1.8-1.8v-5.1h5.1c1,0,1.8-0.8,1.8-1.8S39.8,22.3,38.8,22.3z"/>
                <path d="M49.8,1.3H14.2c-2.8,0-5,2.3-5,5v33.9c0,1.4,0.6,2.7,1.6,3.6l18.7,17.6c0.9,0.9,2.2,1.4,3.5,1.4h17c2.8,0,5-2.3,5-5V6.3
                    C54.8,3.5,52.6,1.3,49.8,1.3z M15.2,43.2h13.5c0.8,0,1.5,0.6,1.5,1.4v12.7L15.2,43.2z M51.3,57.7c0,0.8-0.7,1.5-1.5,1.5H33.8V44.6
                    c0-2.7-2.3-4.9-5-4.9H12.7V6.3c0-0.8,0.7-1.5,1.5-1.5h35.6c0.8,0,1.5,0.7,1.5,1.5V57.7z"/>
            </g>
            </svg>
        </div>
    </div>
    `
}


function deletePopup() {
    let translateElement = document.getElementById('translateAnki')
    if (translateElement) {
        translateElement.parentNode.removeChild(translateElement)
    }
}


function addCardToDeck() {
    let translateText = document.getElementById('translateTextAnki').innerText
    let from = document.getElementById('translateTextAnki').dataset.translateFrom
    console.log(from)


    chrome.storage.sync.get(['currentDeckId'], async function(items) {
        let deckId = items.currentDeckId
        let response = await fetch(
            `${ankiApi}/anki/${deckId}/card?fields=${from}::${translateText}`,
            {
                method: 'POST'
            }
        )
        console.log(response.json())
    });

    deletePopup()
}


async function getTranslation(text) {
    let response = await fetch(`${ankiApi}/translate/?text=${text}`)
    return response.json() 
}


async function handleKeyUp(event) {
    if (event.code == 'Escape') {
        deletePopup()
    }
}


async function onClick(event) {
    let selection = window.getSelection();
    let selectionText = selection.toString();
    if (selectionText && event.ctrlKey) {
        deletePopup();

        let oRange = selection.getRangeAt(0); //get the text range
        let oRect = oRange.getBoundingClientRect();

        let translation = await getTranslation(selectionText)
        let popup = createPopUp(
            selectionText,
            translation,
            oRect.right - oRect.width / 2,
            oRect.bottom + window.scrollY
        )
        document.body.insertAdjacentHTML('beforeend', popup)
        
        addButton = document.getElementById('addToDeckAnki')
        addButton.addEventListener('click', addCardToDeck)
        return
    }

    let elementId = event.target.id
    if (elementId.includes('translateAnki') || elementId.includes('translateTextAnki')) {
        return
    }

    deletePopup()
}


document.addEventListener('keyup', handleKeyUp, {
    capture: false,
});
document.addEventListener('click', onClick, false)
console.log('Translator is ready')