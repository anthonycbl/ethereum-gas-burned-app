//define DOM Elements
const targetElement = document.querySelector("#app");
const form = document.querySelector("form");
const addressInput = document.querySelector(".address");
const txnOrder = document.querySelector("#ascending");

function turnResponseIntoJS(res) {
  return Promise.all(res.map((res) => res.json()));
}

function handleData(data) {
  const ethPrice = data[0].ethereum.usd;
  const txnArray = data[1].result;
  const totalFees = txnArray
    .map((txn) => txn.gasPrice * txn.gasUsed * Math.pow(10, -18))
    .reduce((acc, current) => acc + current);
  const totalFeesInUsd = totalFees * ethPrice;

  let html = `<h3>You've spent ${totalFees.toFixed(4)} ETH on gas</h3>
  <h3>That's ${totalFeesInUsd.toFixed(2)} 
  USD with currently 1 ETH being worth ${ethPrice} USD</h3>
  `;

  html += "<h2>Transaction History</h2>";
  txnArray.forEach((txn) => {
    //Calcualte Transaction fee (gasPrice is expressed in wei)
    const transactionFee = txn.gasPrice * txn.gasUsed * Math.pow(10, -18);

    // Convert Unix time to readable format
    const unixTimeStamp = txn.timeStamp;
    const milliseconds = unixTimeStamp * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString();

    html += `
    <p> Timestamp: ${humanDateFormat}</p>
    <p> Transaction Hash: ${txn.hash}</p>
    <p> Method: ${txn.functionName === "" ? txn.methodId : txn.functionName}</p>
    <p> Transaction Fee: ${transactionFee.toFixed(7)} ETH</p>
    <hr>
    `;
  });

  targetElement.innerHTML = html;
}

function addressLookup(event) {
  event.preventDefault();
  targetElement.innerHTML = "<h2>Loading...</h2>";

  // Define endpoint for Ethereum price
  const priceEndpoint =
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

  // Define endpoint for Transaction data
  const url = "https://api.etherscan.io/api";
  const parameters = `?module=account&action=txlist&address=${
    addressInput.value
  }&startblock=0&endblock=99999999&offset=10000&sort=${
    txnOrder.checked ? "asc" : "desc"
  }&apikey=`;
  const firstApiKey = process.env.FIRST_API_KEY;
  const txnEndpoint = url + parameters + firstApiKey;

  Promise.all([fetch(priceEndpoint), fetch(txnEndpoint)])
    .then(turnResponseIntoJS)
    .then(handleData)
    .catch((error) => {
      targetElement.innerHTML = `<h3>Error: ${error.message}</h3>`;
      console.error(error);
    });
}

form.addEventListener("submit", addressLookup);
