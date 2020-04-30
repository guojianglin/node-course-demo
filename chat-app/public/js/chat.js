const socket = io();

// Elements
const $form = document.querySelector('#form')
const $input = document.querySelector('#message')
const $submitButton = document.querySelector('#submit')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    const containerHeight = $messages.offsetHeight
    const containerScrollHeight = $messages.scrollHeight

    if (containerScrollHeight > containerHeight) {
        $messages.scrollTo({
            top: containerScrollHeight - containerHeight,
            behavior: 'smooth'
        })
    }

}

socket.on('message', (mes) => {
    const html = Mustache.render($messageTemplate, {
        username: mes.username,
        message: mes.text,
        createdAt: moment(mes.createddAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    // console.log(mes)
    autoScroll()
})

socket.on('locationMessage', (location) => {
    const html = Mustache.render($locationTemplate, {
        username: location.username,
        url: location.url,
        createAt: moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    console.log(location)
    autoScroll()
})

socket.on('roomDate', ({room, users}) => {
    const html = Mustache.render($sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
})

$form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (e.target.elements.message.value) {
        $submitButton.setAttribute('disabled', 'disabled')
        socket.emit('sendMessage', e.target.elements.message.value, (error) => {
            $submitButton.removeAttribute('disabled')
            $input.value = ''
            if (error) {
                alert(error)
            }
            console.log('message delivered')
        })
    } else {
        alert('Can not send empty message')
    }
})

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported in your browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const {longitude, latitude} = position.coords
        console.log(longitude)
        socket.emit('sendLocation', {longitude, latitude}, (error) => {
            if (error) {
                alert(error)
                location.href = '/'
            }
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

