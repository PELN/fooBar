"use strict";

// **************************************** GET CONST JSON ************************************************
var getConstJson = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var beerTypes, _loop, i;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        constData = FooBar.getData(false);
                        constJsonData = JSON.parse(constData);

                        beerTypes = constJsonData.beertypes;

                        _loop = function _loop(i) {
                            var template = document.querySelector("#beerTemp");
                            var clone = template.cloneNode(true).content;

                            var eachName = beerTypes[i].name;
                            var eachAlc = beerTypes[i].alc;
                            var eachCat = beerTypes[i].category;
                            var eachImg = beerTypes[i].label;

                            clone.querySelector("#beerName").textContent = eachName;
                            clone.querySelector("img").src = "dist/assets/" + eachImg;
                            clone.querySelector("#beerCat").textContent = "Category: " + eachCat;
                            clone.querySelector("#beerAlc").textContent = "Alc: " + eachAlc;

                            //click on read, open modal
                            clone.querySelector("#read").addEventListener("click", function () {
                                document.querySelector("#modalContainer").style.visibility = "visible";

                                var descTemplate = document.querySelector("#modalTemp");
                                var descClone = descTemplate.cloneNode(true).content;

                                var description = beerTypes[i].description;

                                var aroma = description.aroma;
                                var appearance = description.appearance;
                                var flavor = description.flavor;
                                var mouthfeel = description.mouthfeel;
                                var overallImpression = description.overallImpression;

                                descClone.querySelector("#beerName").textContent = eachName;
                                descClone.querySelector("#aroma").textContent = "Aroma: " + aroma;
                                descClone.querySelector("#appearance").textContent = "Appearance: " + appearance;
                                descClone.querySelector("#flavor").textContent = "Flavor: " + flavor;
                                descClone.querySelector("#mouthfeel").textContent = "Mouthfeel: " + mouthfeel;
                                descClone.querySelector("#overallImpression").textContent = "Overall Impression: " + overallImpression;

                                //close button, close modal
                                descClone.querySelector("#close").addEventListener("click", function () {
                                    document.querySelector("#modalContainer").style.visibility = "hidden";
                                });

                                document.querySelector("#modalContainer").appendChild(descClone);
                            });

                            document.querySelector("#beerContainer").appendChild(clone);
                        };

                        for (i = 0; i < beerTypes.length; i++) {
                            _loop(i);
                        }
                        getDynamicJson();
                        kegLvl();
                        getBartender();
                        getStorage();

                    case 9:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getConstJson() {
        return _ref.apply(this, arguments);
    };
}();

// **************************************** SET INTERVAL ************************************************


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

window.addEventListener("DOMContentLoaded", getConstJson);

// **************************************** GLOBALE VARIABLER ************************************************
var constData = void 0;
var constJsonData = void 0;

var fooData = void 0;
var jsonData = void 0;
var queueObjects = void 0;

var currentArray = [];
var largestCustomerId = 0;

var singleBeerSold = {};

// **************************************** BURGER MENU ************************************************
function openNav() {
    document.querySelector("#mySidenav").style.width = "100%";
}

function closeNav() {
    document.querySelector("#mySidenav").style.width = "0";
}

// **************************************** JQUERY ************************************************
// https://codepen.io/Nirajanbasnet/pen/KWapvP
$(document).ready(function () {
    $(document).on("scroll", onScroll);

    //smoothscroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");

        $('a').each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');

        var target = this.hash,
            $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top + 2
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
});

function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('nav a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('nav a').removeClass("active");
            currLink.addClass("active");
        } else {
            currLink.removeClass("active");
        }
    });
}setInterval(function () {
    //delete rows in queue
    var table = document.querySelector("#order");
    //arrayet starter på 0, hvis man minusser 1, får man det sidste element med
    for (var i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
    //delete rows in serving
    var serveTable = document.querySelector("#serveOrder");
    for (var _i = serveTable.rows.length - 1; _i > 0; _i--) {
        serveTable.deleteRow(_i);
    }

    //reload taps level data
    //længden af tapsContainer children er 8, men der er 7 items, så den skal fjerne fra det sidste element (-1)
    var lvl = document.querySelector("#tapsContainer").children;
    for (var _i2 = lvl.length - 1; _i2 > 0; _i2--) {
        document.querySelector("#tapsContainer").children[_i2].remove();
    }

    //reload bartender status
    var bartenderStatus = document.querySelector("#bartenderContainer").children;
    for (var _i3 = bartenderStatus.length - 1; _i3 > 0; _i3--) {
        document.querySelector("#bartenderContainer").children[_i3].remove();
    }

    //reload storage data
    var beerStorage = document.querySelector("#storageContainer").children;
    for (var _i4 = beerStorage.length - 1; _i4 > 0; _i4--) {
        document.querySelector("#storageContainer").children[_i4].remove();
    }

    //reload graph data
    var beerSold = document.querySelector("#bestContainer").children;
    for (var _i5 = beerSold.length - 1; _i5 > 0; _i5--) {
        document.querySelector("#bestContainer").children[_i5].remove();
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

    //current people in queue and serving
    getQAmount(jsonData.queue);
    getSAmount(jsonData.serving);

    //store the return from customerData in a variable, to use newOrder array
    var orderData = customerData(jsonData.queue);
    var servingData = customerData(jsonData.serving);
    // console.log("order data",orderData)


    //clone each order element to template, with the new array
    orderData.forEach(function (newElement) {
        var template = document.querySelector("#tableTemp");
        var clone = template.cloneNode(true).content;

        clone.querySelector(".id").textContent = "No: " + newElement.id;
        clone.querySelector(".beertype").textContent = newElement.type;
        clone.querySelector(".beercount").textContent = newElement.amount;
        oddEven(newElement.id, clone);
        convertTime(newElement.time, clone);

        document.querySelector("#order").appendChild(clone);
    });

    //for hver servingData, loop gennem elementer, clone dem
    for (var i = 0; i < servingData.length; i++) {
        var template = document.querySelector("#serveTemp");
        var clone = template.cloneNode(true).content;

        clone.querySelector(".id").textContent = "No: " + servingData[i].id;
        clone.querySelector(".beertype").textContent = servingData[i].type;
        clone.querySelector(".beercount").textContent = servingData[i].amount;
        oddEven(servingData[i].id, clone);
        convertTime(servingData[i].time, clone);

        // ********************************* CURRENT BEERS SOLD ************************************
        // loop through every id in servingData, and compare with largestCustomerId
        if (servingData[i].id >= largestCustomerId) {
            // update largestCustomerId with the newest servingData.id
            largestCustomerId = servingData[i].id;
            // push the amount of the id to the array
            currentArray.push(servingData[i].amount);

            // når iteratoren (i) er lig servingData.length-1 - er den nået til sidste element i servingData
            // hvilket betyder at den skal få largestCustomerID til at være det lig det næste element i køen
            if (i == servingData.length - 1) {
                largestCustomerId++;
            }
            // ********** DO THE MATH ***********

            // ********************************* BEST SELLING BEER - GRAPH ************************************
            //opdater og gem amount i objektet singleBeerSold{} for hver beer.type
            var newElem = servingData[i].type;
            var amountElem = servingData[i].amount;
            //hvis beer.typen er undefined, findes den ikek i objektet, og den skal sætte dens amount til at være lig med newElem
            if (singleBeerSold[newElem] == undefined) {
                singleBeerSold[newElem] = amountElem;
                //hvis typen allerede findes i objektet, skal den add'e amountet til newElem/typen
            } else {
                singleBeerSold[newElem] += amountElem;
            }

            //punkterne i grafen skal rykke sig, hvis newElem/amount of type stiger i singleBeerSold objektet
            var text = document.querySelectorAll(".x-labels text");
            var circleDot = document.querySelectorAll(".data circle");

            //loop gennem x-labels.text.innerHTML, og hvis det er det samme som newElem (beer.type name)
            //skal dens punkter rykkes til det amount der er opbevaret i objektet singleBeerSold[newElem]
            for (var _i6 = 0; _i6 < text.length; _i6++) {
                if (text[_i6].innerHTML == newElem) {
                    //regn forholdet ud mellem start og slut position, hvor mange pixels skal circledot rykke pr amount added
                    //startpos 0 = 400px, slutpos 50 = 100px
                    //startpos - slutpos = 300px
                    //300px / 50 = 6px (Hver ny amount added skal rykke sig 6px)
                    circleDot[_i6].setAttribute("cy", 400 - singleBeerSold[newElem] * 6);
                    circleDot[_i6].setAttribute("fill", "#39AEA9");
                }
            }
        }
        document.querySelector("#serveOrder").appendChild(clone);
    }

    // ************************** DO THE MATH ON CURRENT BEERS SOLD ******************************** 
    //Summen af currentArray: regn ud hvor mange beers der currently er solgt/har været gennem serving (KILDE) 
    if (currentArray.length != 0) {
        var getSum = function getSum(total, num) {
            return total + num;
        };

        document.querySelector("#sum").innerHTML = currentArray.reduce(getSum);
    }
}

// ********************************* EXACT AMOUNT OF BEER ************************************
function customerData(specificData) {
    var newOrder = [];
    // console.log("Specific data",specificData)

    //for each element i arrayet, lav et objekt
    specificData.forEach(function (element) {
        var orderLine = { id: 0, time: 0, type: null, amount: 0 };

        element.order.forEach(function (orderElement) {

            //increase amount for hver eksisterende type
            if (orderElement === orderLine.type) {
                orderLine.amount++;
            } else {

                //hvis typen findes i objektet skal den overskrive og pushe orderLine til arrayet
                if (orderLine.type !== null) {
                    newOrder.push(orderLine);
                }

                //ellers findes typen ikke i objektet 
                orderLine = { id: element.id, time: element.startTime, type: orderElement, amount: 1 };
            }
        });
        //push det overskrevne orderLine til arrayet
        newOrder.push(orderLine);
    });
    //opbevar newOrder i getDynamicJson
    return newOrder;
}

// ********************************* CONVERT TIME ************************************
function convertTime(customerTime, tempClone) {
    var time = new Date(customerTime);
    var hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    var minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    var formattedTime = hours + ":" + minutes;

    tempClone.querySelector(".time").textContent = formattedTime;
    tempClone.querySelector(".time").textContent = formattedTime;
}

// ********************************* ODD / EVEN NUMBER ************************************
// funktion der deler tallene op i odd and even, så jeg kan ændre farverne 
function oddEven(customerId, tempClone) {
    // modulo operator tager et id/orderline.id og dividerer med 2, og returnerer resten der er tilbage (hvor mange gange kan 2 være i id nummeret? resten afgør om det er odd/even)
    // alle lige tal går op i 2 , alle ulige tal gør ikke. Hvis resten er lig med 0 må det betyde at orderLine.id er et lige tal
    if (customerId % 2 == 0) {
        tempClone.querySelector("tr").style.backgroundColor = "rgba(106, 180, 178, 0.589)";
    } else {
        // odd 
        tempClone.querySelector("tr").style.backgroundColor = "rgba(96, 132, 139, 0.507)";
    }
}

// ********************************* AMOUNT OF PEOPLE IN QUEUE ************************************
// find amount of people in queue
function getQAmount(queue) {
    //skal ikke clones fordi det kun bliver sat ind ét sted
    document.querySelector("#qNumb").textContent = queue.length;

    if (queue.length > 10) {
        document.querySelector("#qCircle").style.backgroundColor = "#EA4F67";
    } else if (queue.length > 5 && 10) {
        document.querySelector("#qCircle").style.backgroundColor = "#F2EDAF";
    }
}

// ********************************* AMOUNT OF PEOPLE IN SERVING ************************************
// find amount of people in serving
function getSAmount(serving) {
    document.querySelector("#serveNumb").textContent = serving.length;

    if (serving.length > 10) {
        document.querySelector("#serveCircle").style.backgroundColor = "#EA4F67";
    } else if (serving.length > 5 && 10) {
        document.querySelector("#serveCircle").style.backgroundColor = "#F2EDAF";
    }
}

// ********************************* BARTENDER INFO ************************************
//find bartender information
function getBartender() {
    var bartender = jsonData.bartenders;

    bartender.forEach(function (person) {
        var template = document.querySelector("#bartenders");
        var clone = template.cloneNode(true).content;

        var name = person.name;
        var status = person.status;

        clone.querySelector("#bartenderName").textContent = name;
        clone.querySelector("#status").textContent = "STATUS: " + status;

        if (status == "WORKING") {
            clone.querySelector("#bartenderBox").style.backgroundColor = "rgb(245, 237, 175)";
        }
        document.querySelector("#bartenderContainer").appendChild(clone);
    });
}

// ********************************* TAP LEVEL ************************************
//find keg level on each tap //call the function in the interval and in getconstjson
function kegLvl() {
    var taps = jsonData.taps;
    var level = void 0;
    var beer = void 0;
    var lvlArray = [];

    //for each element in taps array, get beer, level and capacity // clone to template
    taps.forEach(function (tapElement) {

        beer = tapElement.beer;
        level = tapElement.level;

        var template = document.querySelector("#tapTemp");
        var clone = template.cloneNode(true).content;

        clone.querySelector("#beer").textContent = beer;
        clone.querySelector("#level").textContent = "Current level: " + level;

        //push level til et array, så jeg kan bruge det som array til at finde lvl til at animere bar
        lvlArray.push(level);

        //if keg lvl = 0 , show keg empty , change color
        if (level < 0) {
            document.querySelector("#emptyKeg").style.display = "block";
        }
        document.querySelector("#tapsContainer").appendChild(clone);
    });

    // get the bar to move, when the level changes
    var bar = document.querySelectorAll("#bluebar");
    for (var i = -1; i < lvlArray.length; i++) {

        //hvis baren er fyldt 
        if (bar[i] != null) {
            //bredden af svg'en er 100%, og det skal konverteres til %
            //tæl gennem lvlArray, og lav tallet om til procent ved at dividere level med capacity og gang det med 100
            bar[i].style = "width:" + lvlArray[i] / 2500 * 100 + "%";
        }

        if (lvlArray[i] > 1250) {
            bar[i].setAttribute("fill", "#A9D8B1");
        } else if (lvlArray[i] > 626 && 1200) {
            bar[i].setAttribute("fill", "#F2EDAF");
        } else if (lvlArray[i] > 0 && 625) {
            bar[i].setAttribute("fill", "#EA4F67");
        }
    }
}

// ********************************* TAP / KEG STORAGE ************************************
//tap storage
function getStorage() {
    var storage = jsonData.storage;

    storage.forEach(function (storElement) {
        var template = document.querySelector("#storTemp");
        var clone = template.cloneNode(true).content;

        var nameOf = storElement.name;
        var amountOf = storElement.amount;

        clone.querySelector("#storageName").textContent = nameOf;
        clone.querySelector("#storageAmount").textContent = amountOf;

        //turn amountOf in to an array, to be used to loop through and make new divs
        var amountArr = [];
        amountArr.push(amountOf);
        // console.log(nameOf,amountArr)

        // create div to contain all the divs - or you could make it in the html and append to that
        var app = document.createElement("div");
        app.setAttribute("id", "app");

        //for each elem in ammountArr, create a new div
        for (var i = 0; i < amountArr; i++) {
            var myDiv = document.createElement("div");
            // console.log(myDiv)

            //change color of divs, depending on amount
            if (amountArr > 5) {
                myDiv.style.backgroundColor = "#A9D8B1";
            }

            if (amountArr <= 5) {
                myDiv.style.backgroundColor = "#EA4F67";
            }
            //append myDiv to the app container
            app.appendChild(myDiv);
        };

        //show alert on click, if there is anything to alert about, less than 2 kegs
        document.querySelector("#alert").addEventListener("click", function () {
            if (amountOf <= 2) {
                document.querySelector("#orderMore").style.visibility = "visible";
                document.querySelector("#orderMore").style.transform = "translateY(10px)";
            }
        });

        document.querySelector("#storageContainer").appendChild(app);
        document.querySelector("#storageContainer").appendChild(clone);
    });
}
