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
            let eachImg = beerTypes[i].label;

            clone.querySelector("#beerName").textContent = eachName;
            clone.querySelector("img").src = "source/assets/" + eachImg;
            clone.querySelector("#beerCat").textContent = "Category: " + eachCat;
            clone.querySelector("#beerAlc").textContent = "Alc: " + eachAlc;

            //click on 'read' button, open modal window with description
            //there is a bug - when you click on one read more, closes it, and click another one, it saves the one from before and displays 2 elements. 
            //maybe it can be fixed by refreshing after closed modal?
            clone.querySelector("#read").addEventListener("click", ()=>{
                document.querySelector("#modalContainer").style.visibility = "visible";

                let descTemplate = document.querySelector("#modalTemp");
                let descClone = descTemplate.cloneNode(true).content;

                let description = beerTypes[i].description;

                let aroma = description.aroma;
                let appearance = description.appearance;
                let flavor = description.flavor;
                let mouthfeel = description.mouthfeel;
                let overallImpression = description.overallImpression;
                    
                descClone.querySelector("#beerName").textContent = eachName;
                descClone.querySelector("#aroma").textContent = "Aroma: " + aroma;
                descClone.querySelector("#appearance").textContent = "Appearance: " + appearance;
                descClone.querySelector("#flavor").textContent = "Flavor: " + flavor;
                descClone.querySelector("#mouthfeel").textContent = "Mouthfeel: " + mouthfeel;
                descClone.querySelector("#overallImpression").textContent = "Overall Impression: " + overallImpression;
                
                //close button, close window
                descClone.querySelector("#close").addEventListener("click", ()=>{
                    document.querySelector("#modalContainer").style.visibility = "hidden";
                });

                document.querySelector("#modalContainer").appendChild(descClone);
            });

            document.querySelector("#beerContainer").appendChild(clone);
        }
    getDynamicJson();
    kegLvl()
}


setInterval(function(){
    //empty the jsonData queue objects 
    let table = document.querySelector("#order");
    //fordi at arrayet starter på 0, skal man minus 1, for at få det sidste element med
    // >= sættes fordi, den ikke tager 'head' row med
    for(let i = table.rows.length - 1; i > 0; i--)
    {
        table.deleteRow(i);
    }

    let serveTable = document.querySelector("#serveOrder");
    for(let i = serveTable.rows.length - 1; i > 0; i--)
    {
        serveTable.deleteRow(i);
    }
     
    //længden af tapsContainer children er 8, men der er 7 items, så den skal starte fra det sidste element (-1)
    let lvl = document.querySelector("#tapsContainer").children;
    for(let i = lvl.length- 1; i > 0; i--)
    {
        document.querySelector("#tapsContainer").children[i].remove();
    }

    getDynamicJson();
    kegLvl()
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


//find keg level on each tap //call the function in the interval and in getconstjson
function kegLvl(){
    
    let taps = jsonData.taps;
    let level;
    let beer;
    let lvlArray = [];
    //for each element in taps array, get beer, level and capacity
    // clone to template
    taps.forEach(tapElement => {
       
        beer = tapElement.beer;
        level = tapElement.level;

        let template = document.querySelector("#tapTemp");
        let clone = template.cloneNode(true).content;
        console.log(clone.querySelector("#beer").textContent)
        clone.querySelector("#beer").textContent =  beer;
        clone.querySelector("#level").textContent =  level;
        // console.log(beer, level);

        lvlArray.push(level);

        //if keg lvl = 0 , show keg empty , change color
        if(level < 0){
            document.querySelector("#emptyKeg").style.display = "block";
        }

        document.querySelector("#tapsContainer").appendChild(clone);

    });
      
    let bar = document.querySelectorAll("#bluebar");
    for (let i = -1; i < lvlArray.length; i++) {

        if (bar[i] != null){
            // level / capacity * 100, for at få procent
            bar[i].style = `width:${lvlArray[i] / 2500 * 100}%`;
        }

        if(lvlArray[i] > 1250){
            bar[i].setAttribute("fill", "green");
        }
        else if (lvlArray[i] > 626 && 1200) {
            bar[i].setAttribute("fill", "yellow");
        }
        else if (lvlArray[i] > 0 && 625){
            bar[i].setAttribute("fill", "red");
        }
     
    
    
    }

}






//current beers sold
//current servings



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