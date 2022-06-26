const deleteText = document.querySelectorAll('.fa-trash')
const thumbText = document.querySelectorAll('.fa-thumbs-up')


Array.from(deleteText).forEach(x => x.addEventListener('click', deleteSong))
Array.from(thumbText).forEach(x => x.addEventListener('click', addLike))

async function deleteSong() {
    const sName = this.parentNode.childNodes[1].innerText
    const bName = this.parentNode.childNodes[3].innerText
    try {
        const response = await fetch('deleteSong', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'title': sName,
                'artist': bName
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }
}

async function addLike() {
    const sName = this.parentNode.childNodes[1].innerText
    const bName = this.parentNode.childNodes[3].innerText
    const tLikes = Number(this.parentNode.childNodes[5].innerText)
    try {
        const response = await fetch('addOneLike', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'title': sName,
                'artist': bName,
                'likes': tLikes
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }
}