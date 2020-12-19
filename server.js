const express = require('express');
//const path = require('path');
const app = express();


app.use(express.static('./src'));

app.get('/*', function(req, res){
    res.sendFile( 'index.html', {root:'src/'});
});

app.listen(process.env.PORT || 8080);