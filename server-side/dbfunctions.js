const mysql = require('mysql')
const dbName = 'PeakyBlinders'
const tableName = 'shopping'

const dbConnectionPool = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "password",
    database : dbName
});


exports.createDataBase = () => {
    dbConnectionPool.getConnection((err, dbConnection) => {
        if(err){
            console.log("Eroare la conectarea la serverul bazei de date!")
            return;
        }
        console.log("Conectare realizata cu succes!")
        dbConnection.query("CREATE DATABASE " + dbName, (err, result) => {
            if(err){
                if(err.code === 'ER_DB_CREATE_EXISTS'){
                    console.log("Baza de date exista deja!")
                }
                else{
                    console.log("Eroare la crearea bazei de date!");
                }
            }
            else{
                console.log("Baza de date a fost creata cu succes!")
            }
            return;
        });
        dbConnection.release();
    });
}

exports.createTable = () =>{
    dbConnectionPool.getConnection((err, dbConnection) => {
        if(err){
            console.log("Eroare la conectarea la serverul bazei de date!")
            return;
        }
        console.log("Conectare realizata cu succes!")
        let sql = "CREATE TABLE " + tableName + "(";
        sql += "id INT PRIMARY KEY, "
        sql += "nume VARCHAR(100) NOT NULL, "
        sql += "categorie VARCHAR(50) NOT NULL, "
        sql += "pret INT NOT NULL, "
        sql += "imagine VARCHAR(200) NOT NULL)"
        dbConnection.query(sql, (err, result) => {
            if(err){
                if(err.code === 'ER_TABLE_EXISTS_ERROR'){
                    console.log("Tabela " + tableName + " exista deja!")
                }
                else{
                    console.log(err);
                    console.log("Eroare la crearea tabelei " + tableName + "...");
                }
            }
            else{
                console.log("Tabela " + tableName + " a fost creata cu succes!")
            }
            return;
        });
        dbConnection.release();
    });
}

exports.initDataBase = () => {
    let products = [
        [1, 'GOD', 'tshirt', 50, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/TS-M-_-BLK-PEBL125__232_1400x.jpg?v=1568797428"],
        [2, 'Trust Me', 'tshirt', 60, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/TS-M-_-BLK-PEBL138__232_750x.jpg?v=1568797531" ],
        [3, 'I am a Queen', 'tshirt',65, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/TS-F-_-BLK-PEBL137__232_750x.jpg?v=1567787930"],
        [4, 'Trouble T', 'tshirt', 40, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/TS-M-_-BLK-PEBL126__232_1400x.jpg?v=1568797463"],
        [5, 'Silhouette', 'tshirt', 70, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/TS-M-_-CHA-PEBL036__232_750x.jpg?v=1554195404"],
        [6, 'Inner Circle', 'tshirt', 45, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/TS-M-_-WHI-PEBL025__232_750x.jpg?v=1554206399"],
        [7, 'Window', 'tshirt', 80, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/TS-M-_-NAV-PEBL026__232_750x.jpg?v=1568797100"],
        [8, 'Why?', 'tshirt', 70, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/TS-M-_-BLK-PEBL038__232_750x.jpg?v=1568797250"],

        [9, "Razor Sharp", "hoodie", 100, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/CR-F-_-BLK-PEBL124__232-back_750x.jpg?v=1566398838"],
        [10, "EST 1919", "hoodie", 120, "https://shopify-images-push.s3.amazonaws.com/peakyblindersstore-myshopify-com/product_alt/3856415227938/PB-name-hood%20%281%29.jpg"],
        [11, "Peaky Blinders Tommy", "hoodie", 110, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/HO-M-_-HGR-PEBL099__240_750x.jpg?v=1556533649"],
        [12, "The Garrison Tavern", "hoodie", 110, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/HO-M-_-WHI-PEBL045__232_750x.jpg?v=1554195460"],

        [13, "Pb", "mug", 25, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/MU---_-WHI-PEBL091__232-back_750x.jpg?v=1567768163"],
        [14, "The Shelby Brothers Co", "mug", 30, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/MU---_-WHI-PEBL090__232-back_750x.jpg?v=1567768209"],
        [15, "Friend and Enemies", "mug", 40, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/MU---_-WHI-PEBL092__232_750x.jpg?v=1567768118"],
        [16, "Thomas Shelby", "mug", 25, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/MU---_-WHI-PEBL089__232_750x.jpg?v=1586431368"],

        [17, "Stallion Roll Top", "backpack", 200, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/BG-RT-_-OLI-PEBL123__232_750x.jpg?v=1586431820"],
        [18, "Stallion 13", "backpack", 120, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/BG-LT-_-GRM-PEBL118__232_750x.jpg?v=1586431808"],
        [19, "Stallion Vintage Barrell", "backpack", 250, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/BG-BB-_-VBL-PEBL122__232_750x.jpg?v=1586431699"],
        [20, "Razor Sharp Drawstring", "backpack", 160, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/BG-DS-_-OLI-PEBL119__232_750x.jpg?v=1586431520"],

        [21, "Razor Sharp", "cap", 65, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/CA-6-_-DGR-PEBL116__232_750x.jpg?v=1566398293"],
        [22, "Razor Sharp Beanie", "cap", 80, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/BE---_-BLK-PEBL114__232_750x.jpg?v=1566398209"],
        [23, "Stallion Beanie", "cap", 70, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/BE---_-DGR-PEBL113__232_750x.jpg?v=1566398168"],

        [24, "Peaky Blinders Board Game", "art", 200, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/SI---_---PEBL145__232_750x.jpg?v=1574155010"],
        [25, "By Order Of the Peaky Blinders Book", "art", 80, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/BK---_---PEBL105__0_750x.jpg?v=1570792620"],
        [26, "Framed Collectors Print", "art", 60, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/WA-FP-_---PEBL132__232_750x.jpg?v=1568133807"],
        [27, "Infographic Maxi Poster", "art", 40, "https://cdn.shopify.com/s/files/1/0046/0167/5810/products/WA-PO-_---PEBL128__232_750x.jpg?v=1568133699"],

        [28, "Irish Whiskey", "drink", 90, "https://www.finestore.ro/image/cache/catalog/poze_produse_FS/rom/PD0048-500x615.jpg"],
        [29, "Bourbon Whiskey", "drink", 150, "https://images.selfridges.com/is/image/selfridges/414-3005829-PEAKYBLINDERBOURBON_M?defaultImage=414-3005829-PEAKYBLINDERBOURBON_M&$PDP_M_ZOOM$"],
        [30, "Spiced Dry Gin", "drink", 120, "https://cdn.shopify.com/s/files/1/1043/4574/products/PeakyBlinderSpicedGin_1200x1200.jpg?v=1584368003"],
        [31, "Black Spiced", "drink", 80, "https://specialdrinks.ro/109-large_default/peaky-blinder-black-spiced-rum-07l-70cl-40-rom.jpg"],
        [32, "Black Spiced Rum", "drink", 100, "https://vinuri-alese.ro/wp-content/uploads/2019/07/Peaky-blinder-black-spiced.jpg"],
        [33, "Black IPA", "drink", 20, "https://cdn.shopify.com/s/files/1/0026/8412/5228/products/peaky_blinder_black_IPA.jpg?v=1553175398"],
        [34, "Solomons Finest Old Rum","drink", 45, "https://i.pinimg.com/736x/56/cc/6d/56cc6d9146566dfa7ed2f14c95bdf679.jpg"]
    ]

    dbConnectionPool.getConnection((err, dbConnection) =>{
        if(err){
            console.log("Eroare la conectarea la serverul bazei de date!")
            return
        }
        const sqlBase = "INSERT INTO " + tableName + " VALUES "
        products.forEach(product => {
            let sql = sqlBase + '(';
            sql += product[0] + ", "
            sql += "'" + product[1] + "', "
            sql += "'" + product[2] + "', "
            sql += product[3] + ", "
            sql += "'" + product[4] + "')"

            dbConnection.query(sql, (err, result) => {
                if(err){
                    if(err.code === 'ER_DUP_ENTRY'){
                        console.log('Inregistrarea exista deja in tabela ' + tableName + ' ...')
                    }
                    else{
                        console.log("Eroare la inserarea in tabela " + tableName + "...")
                    }
                }
                else{
                    console.log("Inserarea in tabela " + tableName + " a fost realizata cu succes!");
                }
                return;
            });
        })
        dbConnection.release();
        return;
    })
}

exports.GetElementsByCategory = (res,category) => {
    dbConnectionPool.getConnection((err, dbConnection) =>{
        if(err){
            console.log("Eroare la conectarea la serverul bazei de date..")
            return;
        }
        let sql = "SELECT * FROM " + tableName + " WHERE categorie LIKE '" + category + "'"
        dbConnection.query(sql, (err, result) =>{
            if(err){
                console.log("Eroare la extragerea datelor din tabela de produse...")
            }
            else{
                console.log("Datele categoriei " +  category + " au fost extrase cu succes!")
                res.send(result);
                dbConnection.release();
            }
        })
        return;
    })
}