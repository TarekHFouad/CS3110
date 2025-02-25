const refreshDancers = () => {
    fetch('/api')
	.then(body => body.json())
	.then(dancers =>  {
        dancers.forEach((dancer) => {
		    const im = document.createElement('img')
		    im.scr = dancer.who + '.gif'
		    im.style.top = dancer.y + 'vh'
		    im.style.left = dancer.x + 'VW'
		    document.body.append(im)
    })})
}
refreshDancers()

document.body.addEventListener(
    'click',
    (ev) => {
        const { width, height} = document.body.getBoundingClientRect()
        const x = ev.x / width * 100
        const y = ev.y / height * 100
        fetch('/api' , {
            method: 'POST',
            body: JSON.stringify({name: 'rick', x, y})
        }).then(refreshDancers)
        console.log(ev)
    }
)