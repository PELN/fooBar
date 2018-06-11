"use strict";
window.addEventListener("DOMContentLoaded", getConstJson);

let constData;
let constJsonData;

let fooData;
let jsonData;
let queueObjects;

let currentArray = [];
let largestCustomerId = 0;
// An object
let singleBeerSold = {};

// BURGER MENU
function openNav() {
    document.querySelector("#mySidenav").style.width = "100%";
}

function closeNav() {
    document.querySelector("#mySidenav").style.width = "0";
}


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
    getBartender();
    getStorage();

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

    //delete bartender status
    let bartenderStatus = document.querySelector("#bartenderContainer").children;
    for(let i = bartenderStatus.length- 1; i > 0; i--)
    {
        document.querySelector("#bartenderContainer").children[i].remove();
    }

    let beerStorage = document.querySelector("#storageContainer").children;
    for(let i = beerStorage.length- 1; i > 0; i--)
    {
        document.querySelector("#storageContainer").children[i].remove();
    }

    getDynamicJson();
    kegLvl();
    getBartender();
    getStorage();

}, 5000);


function getDynamicJson() {
    fooData = FooBar.getData(true);
    jsonData = JSON.parse(fooData);

    getQAmount(jsonData.queue);
    getSAmount(jsonData.serving);

    //store the return from queueData in a variable/container, to use newOrder array
    let orderData = customerData(jsonData.queue);
    let servingData = customerData(jsonData.serving);


    orderData.forEach( newElement => {
        let template = document.querySelector("#tableTemp");
        let clone = template.cloneNode(true).content;
        // clone #tableTemp (template)
        // indsæt data fra orderLine i clonen (beertype, beercount)
        
        clone.querySelector(".id").textContent = "No: " + newElement.id;
        clone.querySelector(".beertype").textContent = newElement.type;
        clone.querySelector(".beercount").textContent = newElement.amount;
        oddEven(newElement.id, clone)
        convertTime(newElement.time, clone);

        document.querySelector("#order").appendChild(clone);
    });
    // wait for the next customer order which will be 1 greater than the current order ID


    

    let iterator = 0;
    servingData.forEach( serveElement => {
        let template = document.querySelector("#serveTemp");
        let clone = template.cloneNode(true).content;
        
        clone.querySelector(".id").textContent = "No: " + serveElement.id;
        clone.querySelector(".beertype").textContent = serveElement.type;
        clone.querySelector(".beercount").textContent = serveElement.amount;
        oddEven(serveElement.id, clone);
        convertTime(serveElement.time, clone);

        // if the current ID is greater than or equal to the largest ID seen before
        // update the largest and then push the element to the array
        if (serveElement.id >= largestCustomerId) {
            largestCustomerId = serveElement.id;
            currentArray.push(serveElement.amount);
            console.log(currentArray)
            if (iterator == servingData.length-1) {
                largestCustomerId++;
            }

            //fordi der er mellemrum mellem navnene,skal den joine dem
            let newElem = serveElement.type//.split(' ').join('_');
            if (singleBeerSold[newElem] == undefined){
                singleBeerSold[newElem] = serveElement.amount;
            } else {
                singleBeerSold[newElem] += serveElement.amount;
            }
            console.log(singleBeerSold)

            // document.querySelector("line").style.strokeDashoffset = 80;

        }
        iterator++;
        document.querySelector("#serveOrder").appendChild(clone);
    });

    if (currentArray.length != 0){
        function getSum(total, num) {
            return total + num;
        }
        
        document.querySelector("#sum").innerHTML = currentArray.reduce(getSum);
    }
}



//find bartender information
function getBartender(){
    let bartender = jsonData.bartenders;

    bartender.forEach(person =>{
        let template = document.querySelector("#bartenders");
        let clone = template.cloneNode(true).content;

        let name = person.name;
        let status = person.status;
        
        clone.querySelector("#bartenderName").textContent = name;
        clone.querySelector("#status").textContent = "STATUS: " + status;

        if(status == "WORKING"){
            clone.querySelector("#bartenderBox").style.backgroundColor = "#f7f8ac";
            // clone.querySelector("#bartenderBox").style.color = "white";
        }


        document.querySelector("#bartenderContainer").appendChild(clone);
    });
}


// find amount of people in queue
function getQAmount(queue){
    document.querySelector("#qNumb").textContent = queue.length;

    if(queue.length > 10){
        document.querySelector("#qCircle").style.backgroundColor = "firebrick";
    }
    else if(queue.length > 5 && 10){
        document.querySelector("#qCircle").style.backgroundColor = "#f7f8ac";
    }
}

// find amount of people in serving
function getSAmount(serving){
    document.querySelector("#serveNumb").textContent = serving.length;

    if(serving.length > 10){
        document.querySelector("#serveCircle").style.backgroundColor = "firebrick";
    }
    else if(serving.length > 5 && 10){
        document.querySelector("#serveCircle").style.backgroundColor = "#f7f8ac";
    }
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

    tempClone.querySelector(".time").textContent = formattedTime;
    tempClone.querySelector(".time").textContent = formattedTime;
}


// funktion der deler tallene op i odd and even, så jeg kan ændre farverne 
function oddEven(customerId, tempClone){
    // If orderLine.id is an even number then set background to pink
    // modulo tager orderline.id og dividerer med 2 og returnerer så resten der er tilbage
    // Hvis resten er lig med 0 må det betyde at orderLine.id er et lige tal.
    // hvor mange gange kan 2 være i id nummeret - resten af det afgør om det er odd/even
    // alle lige tal går op i 2 , alle ulige tal gør ikke
    if (customerId%2==0) {
        tempClone.querySelector(`tr`).style.backgroundColor = "rgb(179, 240, 187)";
    } else { // odd 
        tempClone.querySelector(`tr`).style.backgroundColor = "rgb(179, 233, 240)";   
    }
}


//find keg level on each tap //call the function in the interval and in getconstjson
function kegLvl(){
    let taps = jsonData.taps;
    let level;
    let beer;
    let lvlArray = [];

    //for each element in taps array, get beer, level and capacity // clone to template
    taps.forEach(tapElement => {
       
        beer = tapElement.beer;
        level = tapElement.level;

        let template = document.querySelector("#tapTemp");
        let clone = template.cloneNode(true).content;
        // console.log(clone.querySelector("#beer").textContent)

        clone.querySelector("#beer").textContent =  beer;
        clone.querySelector("#level").textContent =  "Current level: " + level;

        //push level til et array, så jeg kan bruge det som array til at finde lvl til at animere bar
        lvlArray.push(level);

        //if keg lvl = 0 , show keg empty , change color
        if(level < 0){
            document.querySelector("#emptyKeg").style.display = "block";
        }
        document.querySelector("#tapsContainer").appendChild(clone);
    });
      

    // get the bar to move, when the level changes
    let bar = document.querySelectorAll("#bluebar");
    for (let i = -1; i < lvlArray.length; i++) {

        if (bar[i] != null){
            // level / capacity * 100, for at få procent
            bar[i].style = `width:${lvlArray[i] / 2500 * 100}%`;
        }

        if(lvlArray[i] > 1250){
            bar[i].setAttribute("fill", "rgb(113, 192, 89)");
        }
        else if (lvlArray[i] > 626 && 1200) {
            bar[i].setAttribute("fill", "#f7f8ac");
        }
        else if (lvlArray[i] > 0 && 625){
            bar[i].setAttribute("fill", "firebrick");
        } 
    }
}


//tap storage
function getStorage(){
    let storage = jsonData.storage;

    storage.forEach(storElement => {
        let template = document.querySelector("#storTemp");
        let clone = template.cloneNode(true).content;

        let nameOf = storElement.name;
        let amountOf = storElement.amount;

        clone.querySelector("#storageName").textContent =  nameOf;
        clone.querySelector("#storageAmount").textContent = amountOf;
    
        //turn amountOf in to an array, to be used to loop through and make new divs
        let amountArr = [];
        amountArr.push(amountOf);
        // console.log(nameOf,amountArr)

        // create div to contain all the divs - or you could make it in the html and append to that
        const app = document.createElement("div");
            app.setAttribute("id", "app");

        //for each elem in ammountArr, create a new div
        for(let i = 0; i < amountArr; i++) {
            const myDiv = document.createElement("div");
            // console.log(myDiv)

            //change color of divs, depending on amount
            if(amountArr > 5){
                myDiv.style.backgroundColor = "rgb(113, 192, 89)";
            }

            if(amountArr <= 5){
                myDiv.style.backgroundColor = "firebrick";
            }
            //append myDiv to the app container
            app.appendChild(myDiv);
        };

        document.querySelector("#alert").addEventListener("click", ()=>{
            if (amountOf <= 2){
                document.querySelector("#orderMore").style.visibility = "visible";
                document.querySelector("#orderMore").style.transform = "translateY(10px)";
            }
        });
       

        //append app container to storageContainer
        document.querySelector("#storageContainer").appendChild(app);
        //clone to storageContainer 
        document.querySelector("#storageContainer").appendChild(clone);

    });

}








