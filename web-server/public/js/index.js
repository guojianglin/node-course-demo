
const form = document.querySelector('form');
const mes1 = document.querySelector('#message-1');
const mes2 = document.querySelector('#message-2');
const input = document.querySelector('input');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const address = input.value;
    const api = 'http://localhost:3000/weather?address=';
    if (address) {
        fetch(`${api}${address}`).then(res => {
            res.json().then((data) => {
                if (data.error) {
                    // console.log(data.error);
                    mes1.innerHTML = data.error;
                } else {
                    console.log(data);
                    mes1.innerHTML = data.forecast;
                    mes2.innerHTML = data.location;
                    input.value = '';
                }
            })
        })
    } else {
        console.log('please input a address');
    }
})