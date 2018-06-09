"use strict";
window.addEventListener("DOMContentLoaded", getConstJson);

let constData;
let constJsonData;

let fooData;
let jsonData;
let queueObjects;


async function getConstJson() {
    constData = FooBar.getData(false);
    constJsonData = JSON.parse(constData);

    let beerTypes = constJsonData.beertypes;
    
        for (let i = 0; i < beerTypes.length; i++) {
            let template = document.querySelector("#beerTemp");
            let clone = template.cloneNode(true).content;

            let eachName = beerTypes[i].name;
            let eachAlc = beerTypes[i].alc;
            let eachCat = beerTypes[i].category;
            
            clone.querySelector("#beerName").textContent = eachName;            
            clone.querySelector("#beerCat").textContent = eachCat;
            clone.querySelector("#beerAlc").textContent = eachAlc;

            document.querySelector("#beerContainer").appendChild(clone);
        }
    getDynamicJson();
}

setInterval(function(){
    //empty the jsonData queue objects 
    let table = document.querySelector("#order");
    //fordi at arrayet starter på 0, skal man minus 1, for at få det sidste element med
    // >= sættes fordi, den ikke tager 'head' row med
    for(let i = table.rows.length - 1; i >= 0; i--)
    {
        table.deleteRow(i);
    }

    let serveTable = document.querySelector("#serveOrder");
    //or use :  var table = document.all.tableid;
    for(let i = serveTable.rows.length - 1; i >= 0; i--)
    {
        serveTable.deleteRow(i);
    }
    
    getDynamicJson();
}, 5000);




function getDynamicJson() {
    fooData = FooBar.getData(true);
    jsonData = JSON.parse(fooData);

    getQAmount(jsonData.queue);
    getSAmount(jsonData.serving);

    //store the return from queueData in a variable/container, to use newOrder array
    let orderData = customerData(jsonData.queue);
    let servingData = customerData(jsonData.serving);
    // console.log(servingData);

    orderData.forEach( newElement => {
        let template = document.querySelector("#tableTemp");
        let clone = template.cloneNode(true).content;
        // clone #tableTemp (template)
        // indsæt data fra orderLine i clonen (beertype, beercount)
    
        clone.querySelector(".id").textContent = "Order.No: " + newElement.id;
        clone.querySelector(".beertype").textContent = newElement.type;
        clone.querySelector(".beercount").textContent = newElement.amount;
        oddEven(newElement.id, clone)
        convertTime(newElement.time, clone);

        document.querySelector("#order").appendChild(clone);
    });

    servingData.forEach( serveElement => {
        let template = document.querySelector("#serveTemp");
        let clone = template.cloneNode(true).content;
        
        clone.querySelector(".id").textContent = "Order.No: " + serveElement.id;
        clone.querySelector(".beertype").textContent = serveElement.type;
        clone.querySelector(".beercount").textContent = serveElement.amount;
        oddEven(serveElement.id, clone);
        convertTime(serveElement.time, clone);

        document.querySelector("#serveOrder").appendChild(clone);
    });

}


// find amount of people in queue
function getQAmount(queue){
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
function getSAmount(serving){
    document.querySelector("#serveNumb").textContent = serving.length;

    if(serving.length > 10){
        document.querySelector("#serveCircle").style.backgroundColor = "red";
    }
    else if(serving.length > 5 && 10){
        document.querySelector("#serveCircle").style.backgroundColor = "yellow";
    }
    // console.log(serving);
}

function customerData(specificData){
    let newOrder = [];
    specificData.forEach(element => {
      //find elm. id, clone to temp
        let orderLine = {id: 0, time: 0, type: null, amount: 0};

        element.order.forEach(orderElement => {
            
            if( orderElement === orderLine.type ) {
                orderLine.amount++;
            } else {
                if( orderLine.type!==null ) {
                    newOrder.push( orderLine );
                }
                orderLine = {id: element.id, time: element.startTime, type: orderElement, amount: 1};
            }
        });
        newOrder.push( orderLine );

        // console.log("ny ordre længde",newOrder.length)

    });
    return newOrder;
}


function convertTime(customerTime, tempClone) {

    let time = new Date(customerTime);
        let hours = (time.getHours() < 10) ? "0" + time.getHours() : time.getHours();
        let minutes = (time.getMinutes() < 10) ? "0" + time.getMinutes() : time.getMinutes();
        let formattedTime = hours + ":" + minutes;

    tempClone.querySelector(".time").textContent = "Time: " + formattedTime;
    tempClone.querySelector(".time").textContent = "Time: " + formattedTime;
}


// funktion der deler tallene op i odd and even
function oddEven(customerId, tempClone){
    // If orderLine.id is an even number then set background to pink
    // modulo tager orderline.id og dividerer med 2 og returnerer så resten der er tilbage
    // Hvis resten er lig med 0 må det betyde at orderLine.id er et lige tal.
    // hvor mange gange kan 2 være i id nummeret - resten af det afgør om det er odd/even
    // alle lige tal går op i 2 , alle ulige tal gør ikke
    if (customerId%2==0) {
        tempClone.querySelector(`tr`).style.backgroundColor = "lightgreen";
    } else { // odd 
        tempClone.querySelector(`tr`).style.backgroundColor = "lightblue";   
    }
}











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