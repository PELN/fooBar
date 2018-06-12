"use strict";
window.addEventListener("DOMContentLoaded", getConstJson);

let constData;
let constJsonData;

let fooData;
let jsonData;
let queueObjects;

let currentArray = [];
let largestCustomerId = 0;

// An object with all beers and their amount 
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

    //reload graph data
    let beerSold = document.querySelector("#bestContainer").children;
    for(let i = beerSold.length- 1; i > 0; i--)
    {
        document.querySelector("#bestContainer").children[i].remove();
    }

    getDynamicJson();
    kegLvl();
    getBartender();
    getStorage();

}, 5000);


// **************************************** GET DYNAMIC JSON ************************************************
function getDynamicJson() {
    fooData = FooBar.getData(true);
    jsonData = JSON.parse(fooData);

    getQAmount(jsonData.queue);
    getSAmount(jsonData.serving);

    //store the return from queueData in a variable/container, to use newOrder array
    //først brugte jeg orderData = jsonData.queue
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


    
    //for hver servingData, loop gennem elementer og gør følgende 
    for (let i = 0; i < servingData.length; i++) {
        let template = document.querySelector("#serveTemp");
        let clone = template.cloneNode(true).content;
        //for hvert element i serving data, clone det til template
        clone.querySelector(".id").textContent = "No: " + servingData[i].id;
        clone.querySelector(".beertype").textContent = servingData[i].type;
        clone.querySelector(".beercount").textContent = servingData[i].amount;
        oddEven(servingData[i].id, clone);
        convertTime(servingData[i].time, clone);


        // ********************************* CURRENT BEERS SOLD ************************************
        // loop gennem hvert id i servingData, og sammenlign med largestCustomerId, som altid bliver opdateret med det nyeste servingData.id
        // sikrer at den ikke tjekker samme id flere gange
        if (servingData[i].id >= largestCustomerId) {
            // update largestCustomerId with newest servingData.id
            largestCustomerId = servingData[i].id;
            // then push the amount to the array
            currentArray.push(servingData[i].amount);
        

            // når iteratoren (i) er lig servingData.length-1
            // så er den nået til det sidste element i servingData
            // hvilket betyder at den skal få largestCustomerID til at
            // være det lig det næste element i køen
            if (i == servingData.length-1) {
                    //hvis det sidste element er 15, skal largeCustomerId sættes til at være 15
                    //for at den ikke tjekker 15 igen i den næste iteration
                    largestCustomerId++;
            }
            //DO THE MATH 

            // ********************************* BEST SELLING BEER - GRAPH ************************************
            //opdater og gem amount i objektet singleBeerSold{} for hver beer.type
            let newElem = servingData[i].type;
            let amountElem = servingData[i].amount;
            //hvis beer.typen er undefined, findes den ikek i objektet, og den skal sætte dens amount til at være lig med newElem
            if (singleBeerSold[newElem] == undefined){
                singleBeerSold[newElem] = amountElem;
            //hvis typen allerede findes i objektet, skal den add'e amountet til newElem/typen
            } else {
                singleBeerSold[newElem] += amountElem;
            }

            //her skal punkterne i grafen rykke sig, hvis newElem/amount of type stiger i singleBeerSold objektet
            //punkterne rykkes først, når de har været i serving
            let text = document.querySelectorAll(".x-labels text");
            let circleDot = document.querySelectorAll(".data circle");

            //loop gennem x-labels.text.innerHTML, og hvis det er det samme som newElem (beer.type name)
            //skal dens punkter rykkes til det amount der er opbevaret i objektet singleBeerSold[newElem]
            for (let i = 0; i < text.length; i++) {
                if (text[i].innerHTML == newElem){
                    //regn forholdet ud mellem start og slut position, hvor mange pixels skal circledot rykke pr amount added
                    //startpos 0 = 400px, slutpos 50 = 100px
                    //startpos - slutpos = 300px
                    //300px / 50 = 6px (Hver ny amount added skal rykke sig 6px)
                    circleDot[i].setAttribute("cy", 400-singleBeerSold[newElem]*6);
                    circleDot[i].setAttribute("fill", "lime");
                }
            }
        }
        //append clones
        document.querySelector("#serveOrder").appendChild(clone);
    }

    // ************************** DO THE MATH ON CURRENT BEERS SOLD ******************************** 
    //Summen af currentArray: regn ud hvor mange beers der currently er solgt/har været gennem serving (KILDE) 
    //hvis længden af currentArray ikke er lig 0, skal den køre en function - der regner summen af arrayet ud
    if (currentArray.length != 0){
        function getSum(total, num) {
            return total + num;
        }
        document.querySelector("#sum").innerHTML = currentArray.reduce(getSum);
    }
    
}


//find præcise amount af hver beer type
//customerData tager parametret jsonData.queue, fra getDynamicJson, kan nu bruges som specificData
function customerData(specificData){
    let newOrder = [];
    
    // for each queue order, make it an object element
    specificData.forEach(element => {
        let orderLine = {id: 0, time: 0, type: null, amount: 0};

        //for hvert elem i objektet, 
        element.order.forEach(orderElement => {
            // hvis order elementet (beer type) er det samme som orderline.type i objektet
            //increase amount for hver type
            if( orderElement === orderLine.type ) {
                orderLine.amount++;
            //hvis order elementet ikke findes i objektet, skal det pushes til newOrder arrayet
            } else {
                if( orderLine.type!==null ) {
                    newOrder.push( orderLine );
                }
                //ellers skal orderline objektet altid pushes til newOrder arrayet
                orderLine = {id: element.id, time: element.startTime, type: orderElement, amount: 1};
            }
        });
        newOrder.push( orderLine );
    });
    //store the return in getDynamicJson, to use the newOrder array 
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


// find amount of people in queue
function getQAmount(queue){
    //skal ikke clones fordi det kun bliver sat ind ét sted
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
            clone.querySelector("#bartenderBox").style.backgroundColor = "#fdc04e";
            // clone.querySelector("#bartenderBox").style.color = "white";
        }
        document.querySelector("#bartenderContainer").appendChild(clone);
    });
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

        //hvis baren er fyldt 
        if (bar[i] != null){
            //bredden af svg'en er 100%, og det skal konverteres til %
            //tæl gennem lvlArray, og lav tallet om til procent ved at dividere level med capacity og gang det med 100
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

        //show alert on click, if there is anything to alert about, less than 2 kegs
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








