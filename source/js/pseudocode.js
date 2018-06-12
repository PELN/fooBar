


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
        clone.querySelector(".id").textContent = "No: " + serveElement.id;
        clone.querySelector(".beertype").textContent = serveElement.type;
        clone.querySelector(".beercount").textContent = serveElement.amount;
        oddEven(serveElement.id, clone);
        convertTime(serveElement.time, clone);


        // ********************************* CURRENT BEERS SOLD ************************************
        // loop gennem hvert id i servingData, og sammenlign med largestCustomerId, som altid bliver opdateret med det nyeste servingData.id
        // sikrer at den ikke tjekker samme id flere gange
        if (servingData[i].id >= largestCustomerId) {
            // update largestCustomerId with newest servingData.id
            largestCustomerId = servingData[i].id;
            // then push the amount to the array
            currentArray.push(servingData[i].amount);
        }

        // hvis den er nået til sidste element i servingData, som er lig med længden -1
        if (servingData[i].id == servingData.length-1) {
            // skal largestCustomerId være større end servingData.id
            // for at kunne køre samme iteration med næste element, som må være større end det sidste
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










// ******************************************************** OOLD *************************************************


    //tæller hvor mange gange den er gået igennem for eachet
    let iterator = 0;
    
    servingData.forEach( serveElement => {
        let template = document.querySelector("#serveTemp");
        let clone = template.cloneNode(true).content;

        //for hvert element i serving data, clone det til template
        clone.querySelector(".id").textContent = "No: " + serveElement.id;
        clone.querySelector(".beertype").textContent = serveElement.type;
        clone.querySelector(".beercount").textContent = serveElement.amount;
        oddEven(serveElement.id, clone);
        convertTime(serveElement.time, clone);
 
        //get current beers sold
        //find amount for hvert id - push til et array, så det kan addes sammen, for at få current beers sold
        //if the current ID is greater than or equal to the largest ID seen before (counts from 0 on reload)
        //then push the amount to currentArray
        //both are 0 to begin with, so equal to is to get the first id
        //this makes sure, that we don't check the same id twice
        if (serveElement.id >= largestCustomerId) {
            // update the largest with the serveElm.id
            largestCustomerId = serveElement.id;
            // and then push the element to the array
            currentArray.push(serveElement.amount);

            //når iteratoren er løbet igennem alle servings, og fx er nået til 2, må næste serving være højere end 2 
            //in the last iteration should the largestcustomerid be larger than servingData.length
            //servingData.length -1 for at få sidste element med, fordi man tæller fra 0 index
            if (iterator == servingData.length-1) {
            //og skal derfor increment largestCustomerId, for at den tæller fra 
                largestCustomerId++;
            }
            
            //opdater og gem amount i objektet singleBeerSold{} for hver beer type
            let newElem = serveElement.type;
            //hvis typen er undefined, findes den ikke i objektet, og skal tilføjes med 1 amount
            if (singleBeerSold[newElem] == undefined){
                singleBeerSold[newElem] = serveElement.amount;
            //hvis typen allerede findes i objektet, skal den add'e amountet til typen (1 = 1 + 2 (=3))
            } else {
                singleBeerSold[newElem] += serveElement.amount;
            }

            // vises først, når de har været i serving
            let text = document.querySelectorAll(".x-labels text");
            let circleDot = document.querySelectorAll(".data circle");

            for (let i = 0; i < text.length; i++) {
                if (text[i].innerHTML == newElem){
                    circleDot[i].setAttribute("cy", 400-singleBeerSold[newElem]*6);
                    circleDot[i].setAttribute("fill", "lime");
                }
            }
        } 
        //fordi det er et for each loop, ved man ikke hvornår det er det sidste element, og derfor skal man increment iteratoren
        iterator++;

        document.querySelector("#serveOrder").appendChild(clone);
    });

    //regn ud hvor mange beers der currently er solgt / har været gennem serving (KILDE)
    if (currentArray.length != 0){
        function getSum(total, num) {
            return total + num;
        }

        document.querySelector("#sum").innerHTML = currentArray.reduce(getSum);
    }


