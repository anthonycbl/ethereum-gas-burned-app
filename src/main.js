// define DOM Elements
const targetElement = document.querySelector("#app");
const form = document.querySelector("form");
const addressInput = document.querySelector(".address");
const txnOrder = document.querySelector("#ascending");

function turnResponseIntoJS(responses) {
  return Promise.all(responses.map((response) => response.json()));
}

function handleData(data) {
  // define each dataset from dual API fetch
  const ethPrice = data[0].ethereum.usd;
  const txnArray = data[1].result;

  // calculate total gas fee and output html
  const totalFees = txnArray
    .map((txn) => txn.gasPrice * txn.gasUsed * Math.pow(10, -18))
    .reduce((acc, current) => acc + current, 0);
  const totalFeesInUsd = totalFees * ethPrice;
  let html = `<h3>This address has spent <span class="highlight">
  ${totalFees.toFixed(5)} ETH</span> on gas fees.</h3>
  <h3>That is currently worth <span class="highlight">
  ${totalFeesInUsd.toFixed(2)} USD</span>, 
  with 1 ETH being worth ${ethPrice} USD.</h3>
  `;

  // output individual transaction data to html
  html += "<h2>Transaction History:</h2>";
  txnArray.forEach((txn) => {
    // convert Unix time to readable format
    const unixTimeStamp = txn.timeStamp;
    const milliseconds = unixTimeStamp * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString();
    // calculate each Transaction fee (gasPrice is expressed in wei)
    const transactionFee = txn.gasPrice * txn.gasUsed * Math.pow(10, -18);
    // output to html
    html += `
    <div class="transaction">
    <p>Timestamp: ${humanDateFormat}</p>
    <span>Transaction Hash: </span>
    <a href="https://etherscan.io/tx/${txn.hash}">${txn.hash}</a>
    <p>Method: ${txn.functionName === "" ? txn.methodId : txn.functionName}</p>
    <p>Transaction Fee: ${transactionFee.toFixed(7)} ETH</p>
    </div>
    `;
  });

  targetElement.innerHTML = html;

  // add css effect to have the fees fade out
  const highlightSpan = document.querySelectorAll(".highlight");
  textDisappear(highlightSpan);
}

function textDisappear(domNodeArray) {
  domNodeArray.forEach((domNode) => {
    domNode.addEventListener("mouseover", () => {
      domNode.classList.add("fade-out");
    });
  });
}

function addressLookup(event) {
  event.preventDefault();
  // add loading text
  targetElement.innerHTML = "<h2>Loading...</h2>";

  // define endpoint to get Ethereum price
  const priceEndpoint =
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

  // define endpoint to get Transaction data for user-specified address
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
      targetElement.innerHTML = `<h2>Error: Please check address or enter new address</h2>`;
      console.error(error);
    });
}

form.addEventListener("submit", addressLookup);
