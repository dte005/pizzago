const url = require('url');

exports.morgan = (req, res)=>{
    let pathUrl = url.parse(req.url, true);
    let path = (pathUrl.pathname).replace(/\/+$/, "");
    let method = req.method.toLowerCase();
    let queryString = pathUrl.query;

    if(path !== "/favicon.ico"){
        console.log(`${method.toUpperCase()} ${path} - Status: ${res.statusCode} QueryString: ${JSON.stringify(queryString)}`);
    }
}