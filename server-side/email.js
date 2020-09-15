const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'stDeliveryIp@gmail.com',
        pass : 'proiectIP2020'
    }
});

exports.SendEmail = (informations) =>{
    var mailOptions = {
        from : 'stDeliveryIp@gmail.com',
        to : informations.email,
        subject : 'Peaky Blinders Command',
        text : buildEmailBody(informations),
    };
    transporter.sendMail(mailOptions, (err,info) =>{
        if(err){
            console.log("Eroare la trimiterea email-ului : " + err)
        }
        else{
            console.log('Email trimis cu succes : ' + info.response)
        }
    })
}

function buildEmailBody(user){
    let result = "We received your command on our website!\n\n"
    products = JSON.parse(user.cart)
    let finalPrice = 0
    products.forEach(product =>{
        let price = parseInt(product.quantity) * parseInt(product.product.pret)
        finalPrice += price
        result += product.product.nume + " " + product.product.categorie + " : " + product.quantity + " pieces = " + price + " lei.\n"
    });
    result += "Total price : " + finalPrice + " lei.\n"
    result += "--------------------------------------\n"
    result + "Your credentials : \n"
    result += "Name : " + user.name + "\n"
    result += "Phone number : " + user.telephone + "\n"
    result += "Address : " + user.address +"\n"
    result += "City : " + user.city + "\n"
    result += "Payment method : " + user.payment + "\n"
    result += "--------------------------------------\n"
    result += "BY THE ORDER OF PEAKY FOOKIN' BLINDERS! THANK YOU, PEAKY BOY!"
    return result
}