alert("Hello")

async function fethCount() {
    const result = await fetch("http://127.0.0.1:9000/users")
    const json = await result.json()
    console.log(json)
}

fethCount()