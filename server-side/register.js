const fs  = require('fs')

exports.RegisterPeakyBoy = (boyData) =>{
    let jsonString = JSON.stringify(boyData)
    fs.readFile('jsons/users.json', (err, data) => {
        if(err){
            console.log(err);
            return ;
        }
        let content = ""
        if(String.fromCharCode(data[0]) == '['){
            content = data
        }
        else{
            content = '[' + data
        }
        content[content.length - 1] = ','.charCodeAt(0) 
        content += jsonString
        content += "]"
        fs.writeFileSync('jsons/users.json', content, (err) => {
            console.log(err)
        });
        return;
    });
    return true
}