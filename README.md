## Introduction

This single page application calculates the total transaction fees used over the lifetime of an Ethereum Address.

This was built using vanilla JavaScript.

Style of the website is a homage to my first experiences using the computer i.e. using WordArt in MS Word.

## How does it work?

1. User enters in ethereum address
2. User selects whether to display transactions in ascending or descending order
3. User presses enter or clicks button
4. The function `addressLookup` fetches price data from Coingecko API and transaction data from Etherscan API
5. The callback function `turnResponseIntoJS` is called by the `then` method. This fucntion converts the data into an array of two objects (one object for the price data and another for the transaction data)
6. The `handleData` function extracts the relevant transaction data, calculates the relevant information and formats it into html that is inserted into index.html
7. The `textDisappear()` function takes an array of DOM elements and applies the fadeout animation to each element

## Things I learned

- How to use `Promise all` to fetch two APIs
- How to use Higher order functions such as `.map` and `.reduce`
- How to use environment variables
