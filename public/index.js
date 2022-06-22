// alert("veikia express")

// html kurimas is duomjenu bazes
const body = document.body
const cardHolder = document.createElement("section")
cardHolder.className = "card_holder"
body.appendChild(cardHolder)

function createElement(object) {
    const card = document.createElement("div")
    const p1 = document.createElement("p")
    const p2 = document.createElement("p")
    const p3 = document.createElement("p")
    const hr = document.createElement("hr")
    const button = document.createElement("button")
    button.addEventListener('click', event => {
        deleteUser(object._id)
    })
    card.className = "user_card"
   
    p1.innerText = `User Name - ${object.name}`
    p2.innerHTML = `Age -${object.age}`
    p3.innerText = `Club member ID - ${object.number}`
    button.innerText = "Delete User"

    card.appendChild(p1)
    card.appendChild(p2)
    card.appendChild(p3)
    card.appendChild(hr)
    card.appendChild(button)
    cardHolder.appendChild(card)
    body.appendChild(cardHolder)
}

fetchGet()

async function fetchGet() {
    const result = await fetch("http://127.0.0.1:9000/users")
    const json = await result.json()
    json.forEach(element => createElement(element))
    return json
}

//  naujo user kurimas
const newUserSubmitData = document.getElementById("userForm")
let newUserData = {}
newUserSubmitData.addEventListener('submit', function (event) {
    event.preventDefault()
    newUserData = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value
    }
    newUserSubmitData.reset()
    fetchCreateUser()
    return newUserData
})



async function fetchCreateUser() {
    const result = await fetch(
        'http://127.0.0.1:9000/users',
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(newUserData),
        },
    );
    fetchGet()
    window.location.replace('http://127.0.0.1:9000/index.html');
    return result.json();
}

async function deleteUser(id) {
    const result = await fetch(`http://127.0.0.1:9000/users/${id}`, {
        method: 'DELETE',
    })
    window.location.replace('http://127.0.0.1:9000/index.html')
    return result
}
