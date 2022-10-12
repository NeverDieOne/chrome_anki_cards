

function handleKeyUp(event) {
    if (event.altKey && event.code == 'KeyT') {
        event.preventDefault();
        event.stopPropagation();

        console.log('Translate')
        let selection = window.getSelection();
        let selectionText = selection.toString();


        let deckId = localStorage.getItem('currentDeckId')
        console.log(deckId)
        
    }
}

document.addEventListener('keyup', handleKeyUp, {
    capture: false,
});


console.log('blabla')