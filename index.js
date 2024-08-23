import express from 'express';
import cors from 'cors'
// import {enoughAirtime} from './enoughAirtime.js'; 
const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(express.static('public'));  // This serves files from the 'public' directory

//Price of a call
var price_Call = 0.00;
//Price of a SMS
var price_SMS = 0.00;

function longestWord(sen) {
    const words = sen.split(' ');
    let longest = words[0];

    for (const word of words) {
        if (word.length >= longest.length) {
            longest = word;
        }
    }
    return longest
}
function shortestWord(sentence) {
    const words = sentence.split(' ');
    let shortest = words[0];

    for (const word of words) {
        if (word.length <= shortest.length) {
            shortest = word;
        }
    }
    return shortest;
}
function wordLengths(sentence) {
    let len = 0;
    const words = sentence.split(' ');
    for (const word of words) {
        len = len + word.length;
    }
    return len;
}
app.get('/api/word_game', function (req, res) {

    console.log("The  end point works");
    const sentence = req.query.sentence;
    res.json({
        message: sentence,
        longestWord: longestWord(sentence),
        shortestWord: shortestWord(sentence),
        wordLengths: wordLengths(sentence)

    });
});
// Define prices
const SMS_PRICE = 0.65;
const CALL_PRICE = 2.75;

// Function to calculate the total phone bill
function totalPhoneBill(bill) {
    // Split the bill string by commas
    const network = bill.split(',');

    // Initialize counters for SMS and call
    let smsCount = 0;
    let callCount = 0;

    // Count the occurrences of SMS and call
    for (const item of network) {
        const trimmed = item.trim(); // Remove any extra spaces
        if (trimmed === 'sms') {
            smsCount++;
        } else if (trimmed === 'call') {
            callCount++;
        }
    }

    // Calculate total cost
    const totalCost = (smsCount * SMS_PRICE) + (callCount * CALL_PRICE);

    // Return formatted total cost
    return 'R' + totalCost.toFixed(2);
}

// Endpoint to calculate total cost
app.post('/api/phonebill/total', (req, res) => {
    const { bill } = req.body;

    if (typeof bill !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const totalCost = totalPhoneBill(bill);
    res.json({ total: totalCost });
});

// Endpoint to get the prices of SMS and Calls
app.get('/api/phonebill/prices', (req, res) => {
    res.json({
        Call: `R${CALL_PRICE.toFixed(2)}`,
        SMS: `R${SMS_PRICE.toFixed(2)}`
    });
});

// Initial prices
let smsPrice = 0.65;
let callPrice = 2.75;



// GET endpoint to retrieve current prices
app.get('/api/phonebill/prices', function (req, res) {
    res.json({
        smsPrice: smsPrice,
        callPrice: callPrice

    });
});
// POST endpoint to set prices for SMS or calls
app.post('/api/phonebill/price', function (req, res) {
    const { type, price } = req.body;

    // Check if price is a valid number
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid price value'
        });
    }

    // Update price based on type
    if (type === 'sms') {
        smsPrice = price;
        res.json({
            status: 'success',
            message: `The SMS price was set to ${price.toFixed(2)}`
        });
    } else if (type === 'call') {
        callPrice = price;
        res.json({
            status: 'success',
            message: `The call price was set to ${price.toFixed(2)}`
        });
    } else {
        res.status(400).json({
            status: 'error',
            message: 'Invalid type, must be "sms" or "call"'
        });
    }
});

// API endpoint to check airtime
app.post('/api/enough', function(req, res) {
    const usage = req.body.usage;
    const available = req.body.available;
    
    res.json({
        result : enoughAirtime(usage, available) 
    })
});



// let PORT = process.env.PORT || 3002;

app.listen(3002, function () {
    console.log('App starting on port', 3002);
});