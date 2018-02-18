const express = require('express')
const app = express()
const path = require('path');

app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/patient_form.html')))

app.listen(3000, () => console.log('Example app listening on port 3000!'))