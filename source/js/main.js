"use strict";
window.addEventListener("DOMContentLoaded", getJsonData);

let rawData;
let jsonData;
let queueObjects;

async function getJsonData() {
    rawData = FooBar.getData();
    jsonData = JSON.parse(rawData);

    getQNumber(jsonData.queue);
    getSNumber(jsonData.serving);
    console.log("serving amount",jsonData.serving);

    jsonData.queue.forEach(element => {

        const newOrder = [];
        let orderLine = {id: 0, type: null, amount: 0};

        element.order.forEach(orderElement => {

            if( orderElement === orderLine.type ) {
                orderLine.amount++;
            } else {
                if( orderLine.type!==null ) {
                    newOrder.push( orderLine );
                }
                orderLine = {type: orderElement, amount: 1};
            }
        });
        newOrder.push( orderLine );

        // Nu indeholder newOrder et array over øl-typer og amount
        newOrder.forEach( newElement => {
            // clone #tableTemp (template)
            // indsæt data fra orderLine i clonen (beertype, beercount)

            //find elm. id, clone to temp
            orderLine.id = element.id;
        
            let template = document.querySelector("#tableTemp");
            let clone = template.cloneNode(true).content;
            
            clone.querySelector(".id").textContent = "Order.No: " + orderLine.id;
            clone.querySelector(".beertype").textContent = newElement.type;
            clone.querySelector(".beercount").textContent = newElement.amount;
            
            // find måde at dele tallene op i odd and even
            // If orderLine.id is an even number then set background to pink
            // modulo tager orderline.id og dividerer med 2 og returnerer så resten der er tilbage
            // Hvis resten er lig med 0 må det betyde at orderLine.id er et lige tal.
            // hvor mange gange kan 2 være i id nummeret - resten af det afgør om det er odd/even
            // alle lige tal går op i 2 , alle ulige tal gør ikke
            if (orderLine.id%2==0) {
                clone.querySelector(`tr`).style.backgroundColor = "lightgreen";
            } else { // odd 
                clone.querySelector(`tr`).style.backgroundColor = "lightblue";   
            }

            // append clonen til #order
            document.querySelector("#order").appendChild(clone);

        });
    });
}


// find amount of people in queue
function getQNumber(queue){
    document.querySelector("#qNumb").textContent = queue.length;

    if(queue.length > 10){
        document.querySelector("#qCircle").style.backgroundColor = "red";
    }
    else if(queue.length > 5 && 10){
        document.querySelector("#qCircle").style.backgroundColor = "yellow";
    }
    // console.log(queue);
}

// find amount of people in serving
function getSNumber(serving){
    document.querySelector("#serveNumb").textContent = serving.length;

    if(serving.length > 10){
        document.querySelector("#serveCircle").style.backgroundColor = "red";
    }
    else if(serving.length > 5 && 10){
        document.querySelector("#serveCircle").style.backgroundColor = "yellow";
    }
    // console.log(serving);
}




// setInterval(function(){
//     //empty the jsonData queue objects
//     console.log(delete jsonData[queueObjects])

//         getJsonData();
//     }, 3000);









// PART 7
// En base på en anden planet
// let firebase = {El_Hefe: 2, GitHop: 5};

// beear = ["Hollaback Lager",
//             "Steampunk",
// 			"El Hefe",
//             "El Hefe",
//             "GitHop",
//             "Steampunk",
//             "Tis",
//             "Tis"]

// // Databasen som man henter ind
// beerSold = firebase;

// beear.forEach(element => {
//     let newElem = element.split(' ').join('_');
//     if (beerSold[newElem] == undefined){
// 		beerSold[newElem] = 1;
// 	} else {
//         beerSold[newElem]++;
//     }
// })
// beerSold