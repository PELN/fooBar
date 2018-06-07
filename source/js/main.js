"use strict";

window.addEventListener("DOMContentLoaded", getJsonData);

let rawData;
let jsonData;


async function getJsonData() {
    rawData = FooBar.getData();
    jsonData = JSON.parse(rawData);
    // console.log(jsonData.queue[0].id);



//function der finder array object id
    let jsonThing = [];
    jsonData.queue.forEach(element => {
        // start cloning in to template
        let template = document.querySelector("#qTemp");
        let clone = template.cloneNode(true).content;

//objects bliver overskrevet når 
        let queueObjects = {id: 1, order: ""}
        queueObjects.id = element.id;
        // console.log(queueObjects.id)
        clone.querySelector("#qId").textContent = queueObjects.id;

        element.order.forEach(orderElement => {
            queueObjects.order += orderElement;
            clone.querySelector("#order").textContent = queueObjects.order;
        });
        jsonThing.push(queueObjects)

        document.querySelector("#qContainer").appendChild(clone);
    });
}

// wrap for each i en function der bliver kaldt for hver gang der bliver hentet data (getJsonData) 
//tilføj amount til for eachet

//function der finder 











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