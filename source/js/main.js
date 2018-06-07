"use strict";

window.addEventListener("DOMContentLoaded", init);

let fooBarData;
let jsonData;

//set interval for getting/updating data?
async function init() {
    fooBarData = FooBar.getData();
    jsonData = JSON.parse(fooBarData);
    console.log(jsonData);
}


// 












