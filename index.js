const path = require("path")
const fs = require("fs")

const express = require("express")
const app = express()

app.use('/static', express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    
    const options = {
        root: path.join(__dirname, 'static'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    res.sendFile("index.html", options, (err) => {
        if (err) {
            next(err)
        }
    })
    return
})

app.post("/save", (req, res) => {
    console.log(req.body)
    // fs.writeFileSync("sample.txt", "hello, world!!")
    res.send("save done.")
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})