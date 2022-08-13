const targetElement = document.querySelector("#app");
const form = document.querySelector("form");
const addressInput = document.querySelector(".address");
const txnOrder = document.querySelector("#ascending");

function turnResponseIntoJS(res) {
  return res.json();
}

function handleData(data) {
  let html = [];

  html += "<h2>Transaction History</h2>";
  data.result.forEach(function (txn) {
    const transactionFee = txn.gasPrice * txn.gasUsed * Math.pow(10, -18); //gasPrice is expressed in wei

    const unixTimeStamp = txn.timeStamp;
    const milliseconds = unixTimeStamp * 1000;
    const dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString();

    html += `
    <p> Timestamp: ${humanDateFormat}</p>
    <p> Transaction Hash: ${txn.hash}</p>
    <p> Method: ${txn.functionName}</p>
    <p> Transaction Fee: ${transactionFee.toFixed(7)} ETH</p>
    <hr>
    `;
  });

  targetElement.innerHTML = html;
}

function addressLookup(event) {
  event.preventDefault();
  targetElement.innerHTML = "<h2>Loading...</h2>";

  const url = "https://api.etherscan.io/api";
  const parameters = `?module=account&action=txlist&address=${
    addressInput.value
  }&startblock=0&endblock=99999999&offset=10000&sort=${
    txnOrder.checked ? "asc" : "desc"
  }&apikey=`;
  const firstApiKey = process.env.FIRST_API_KEY;
  const endpoint = url + parameters + firstApiKey;

  fetch(endpoint).then(turnResponseIntoJS).then(handleData);
}

form.addEventListener("submit", addressLookup);
