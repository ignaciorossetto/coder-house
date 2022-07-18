let productList = []
let shopBag = []
let prices = []
let ids = []
let total = 0

const add = (shopBagItem, price, id) => {
    const product = productList.find(p => p.id === id)
    product.stock--

    shopBag.push(shopBagItem)
    prices.push(price)
    ids.push(id)
    total = total + price
    displayProducts()
    console.log(product.stock)
}

const pay2 = () => {
    let amount = total.toLocaleString()
    let shopBagTextArray = []
    for (i = 0; i < shopBag.length; i++) {
        shopBagTextArray.push(ids[i], ", ", shopBag[i], "  $", prices[i].toLocaleString(), "\n")
    }
    const shopBagText = shopBagTextArray.join(" ") + "\n" + ` Total es:       $${amount}`
    return window.alert(shopBagText)
}


const pay = async () => {
    try {
        productList = await (await fetch("/api/pay", {
            method: "post",
            body: JSON.stringify(ids),
            headers: {
                "Content-Type": "application/json"
            }
        })).json()
    }
    catch {

        productList = []
        shopBag = []
        prices = []
        ids = []
        total = 0
        window.alert("No hay stock")
        location.reload()
    }
    fetchProduct()

}


const displayProducts = () => {
    let productsHTML = ''


    productList.forEach(element => {
        let availableStock = `<a href="javascript:void(0);" class="alm__comprar" onclick="add('${element.name}',${element.price},${element.id})"><i class="fa-solid fa-bag-shopping"></i></a>`

        if (element.stock <= 0) {
            availableStock = `<a style="pointer-events: none" href="javascript:void(0);" class="alm__comprar" onclick="add('${element.name}',${element.price},${element.id})">Sin Stock</i></a>`
        }

        productsHTML +=
            `<div class="almohadones__${element.id} alm">
        <div id="almohadon_${element.id}" class="img" style="background-image: url(${element.image}); background-size: cover;
        background-position: center">${availableStock}</div>
        <div class="info">
            <div><h3>${element.name}</h3></div>
            <div>$${element.price.toLocaleString()}</div>
            <div>${element.medidas}</div>
        </div>
        </div>`
        // let ddd = document.getElementById(`almohadon_${element.id}`)

        // ddd.style.backgroundImage = "url('../multimedia/almohadones/almohadon_caracol_b_b.jpg')"
    })
    document.getElementById('almohadones_main').innerHTML = productsHTML


}



const fetchProduct = async () => {
    productList = await (await fetch("/api/products")).json()
    displayProducts()
}

window.onload = async () => {
    await fetchProduct()

}