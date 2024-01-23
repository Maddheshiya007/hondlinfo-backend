const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4000
const mongoose = require('mongoose');
const axios = require('axios')
require('dotenv').config();

// middlweare
app.use(express.json());
app.use(cors());

// creating Schema and model

const Stocks = mongoose.model('Stocks', {
    name: {
        type: String
    },
    last: {
        type: Number
    },
    buy: {
        type: Number
    },
    sell: {
        type: Number
    },
    volume: {
        type: Number
    },
    base_unit: {
        type: String
    }
})


app.get('/fetchdata', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.URL}`);
        // console.log(response);
        stocksdata = Object.values(response.data).slice(0, 10).map((onestock) => ({
            name: onestock.name,
            last: onestock.last,
            buy: onestock.buy,
            sell: onestock.sell,
            volume: onestock.volume,
            base_unit: onestock.base_unit
        }));

        stocksdata.map((item) => {
            let product = new Stocks(item);
            product.save();
        })

        console.log("data stored in db")
        res.json(stocksdata);

    }
    catch (err) {
        console.log(err)

    }
})

try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("database is conntected now !")
} catch (err) {
    console.error(err);
}

app.get('/getdata', async (req, res) => {
    try {

        let data = await Stocks.find({});
        res.send(data);
    }
    catch (err) {
        console.log(err)
    }
})

// port listening

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`sever is listening on the port ${PORT}`)
    }

})