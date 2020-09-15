const express        = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser     = require('body-parser')
const cookieParser   = require('cookie-parser')
const fs             = require('fs')
const mysqldb        = require('./server-side/dbfunctions.js')
const email          = require('./server-side/email.js')
const register       = require('./server-side/register.js')
const port = 7000;
const app  = express();
var shopping_cart = []

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//mysqldb.createDataBase();
//mysqldb.createTable();
//mysqldb.initDataBase();

/* main [activity] */
app.get('/', (req, res) => {
    if(req.cookies.credentials != null){
        res.clearCookie('error_login');
        let jsn = {data : {credentials : req.cookies.credentials}};
        res.render('index', jsn)
    }
    else{
        let jsn = {data : {credentials : null}};
        res.render('index', jsn)
    }
});

/* gallery [activity] */
app.get('/gallery', (req, res) => {
    let dataImages = fs.readFileSync('jsons/gallery.json');
    if(req.cookies.credentials != null){
        res.render('gallery', {data : {credentials : req.cookies.credentials, images : JSON.parse(dataImages)}})
    }
    else{
        res.render('gallery', {data : {credentials : null, images : JSON.parse(dataImages)}})
    }
});

/* characters [activity and ajax request handler]*/
app.get('/characters', (req, res) => {
    if(req.cookies.credentials != null){
        res.render('characters', {data : {credentials : req.cookies.credentials}})
    }
    else{
        res.render('characters', {data : {credentials : null}})
    }
});
app.get('/characters.json', (req, res) =>
{
    res.send(fs.readFileSync('jsons/characters.json'));
})

/* contact [activity and message handler] */
app.get('/contact_us', (req, res) => {
    let message = null
    if(req.cookies['mesaj_contact'] != null){
        message = req.cookies['mesaj_contact']
        res.clearCookie('mesaj_contact')
    }
    if(req.cookies.credentials != null){
        res.render('contact', {data : {credentials : req.cookies.credentials, 
                                        status_contact : message}})
    }
    else{
        res.render('contact', {data : {credentials : null,
                                       status_contact : message}})
    }
});
app.post('/contact_us', (req, res) =>{
    console.log("Mesaj from user : ");
    console.log(req.body);
    res.cookie('mesaj_contact','Message successfully sent!')
    res.redirect(301,'/contact_us')
});

/* register [activity] */
app.post('/register', (req, res) =>{
    let message = 'Unable to register you, Peaky Boy! Sorry!'
    if(req.body != null){
        if(register.RegisterPeakyBoy(req.body) == true){
            message = 'Welcome to the family, Peaky Boy ' + req.body['last_name'] + '!'
        }
    }
    res.cookie('creare_cont_mesaj',message)
    res.redirect('/creare_cont')
});
app.get('/creare_cont', (req, res) => {
    let status = null
    if(req.cookies['creare_cont_mesaj'] != null){
        res.clearCookie('creare_cont_mesaj');
        status = req.cookies['creare_cont_mesaj']
    }
    else{
        status = null
    }
    if(req.cookies.credentials != null){
        let jsn = {data : {credentials : req.cookies.credentials, account_status : status}}
        res.render('creare_cont', jsn)
    }
    else{
        let jsn = {data : {credentials : null, account_status : status}}
        res.render('creare_cont', jsn)
    }
});



/* login and disconnect [activity and verification] */
app.get('/login', (req, res) => {
    if(req.cookies.error_login != null){
        let jsn = {data : {error_message : req.cookies.error_login, credentials : null}}
        res.render('login', jsn);
    }
    else{
        let jsn = {data : {error_message : null, credentials : null}}
        res.render('login', jsn);
    }
});
app.post('/verificare_login', (req, res) => {
    fs.readFile('jsons/users.json', (err, data) => {
        let attemptUser = req.body;
        if(err){
            console.log(err);
            return ;
        }
        if(data != ""){
            let users = JSON.parse(data)
            for(let index in users){
                if(users[index].email === attemptUser.email){
                    if(users[index].password === attemptUser.password){
                        attemptUser['name'] = users[index].last_name + " " + users[index].first_name
                        res.cookie('credentials', users[index]);
                        shopping_cart = []
                        res.redirect(301,'/');
                        return;
                    }
                }
            }
        }
        res.cookie('error_login','Incorrect credentials! No user detected!');
        res.redirect(301,'/login');
        return;
    });
});
app.get('/disconnect', (req, res) => {
    shopping_cart = []
    res.clearCookie('credentials')
    let jsn = {data : {credentials : null}};
    res.render('index', jsn)
});

/* shopping [activity, add to cart and ajax requests handlers] */
app.get('/cumparaturi', (req, res) => {
    if(req.cookies.credentials != null){
        res.render('cumparaturi', {data : {credentials : req.cookies.credentials}})
    }
    else{
        res.render('cumparaturi', {data : {credentials : null}})
    }
});
app.post('/add_to_cart', (req, res) => {
    shopping_cart.push(req.body)
    res.redirect('/cumparaturi')
});

var items = ['tshirt', 'mug', 'backpack', 'hoodie', 'cap', 'art', 'drink']
items.forEach(item => {
    app.get('/' + item, (req, res) => {
        mysqldb.GetElementsByCategory(res, item)
    })
});

/* shopping cart [activity and send email] */
app.get('/viewcart', (req, res) => {
    if(req.cookies.credentials != null){
        res.render('vizualizare_cos', {data : {credentials : req.cookies.credentials,
            items : shopping_cart,
            message : null}})
        }
    else{
        res.render('vizualizare_cos', {data : {credentials : null,
            items : shopping_cart,
            message : null}})
    }
});       
app.post('/finalizare_comanda', (req, res) =>{
    shopping_cart = []
    email.SendEmail(req.body)
    
    if(req.cookies.credentials != null){
        res.render('vizualizare_cos', {data : {credentials : req.cookies.credentials,
            items : shopping_cart,
            message : "Command sent! Verify your email!"}})
        }
    else{
        res.render('vizualizare_cos', {data : {credentials : null,
            items : shopping_cart,
            message : "Command sent! Verify your email!"
        }});
    }
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));        
        