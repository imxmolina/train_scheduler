
var trainName = "";
var trainDestination = "";
var trainFrequency = 0;
var firstTrain = 0;

var firstTimeConverted = 0;
var nextArrival = 0;
var minutesAway = 0;
var diffTime = 0;
var tRemainder = 0;

//initialize firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDYAj7RA9mJaVF4lZCuBtInqaw0_KPOvkc",
    authDomain: "trainscheduler1.firebaseapp.com",
    databaseURL: "https://trainscheduler1.firebaseio.com",
    storageBucket: "trainscheduler1.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {

    //add train button
    $("#submitBtn").on("click", function () {

        console.log("i was clicked!")

        //gets user input
        trainName = $("#name-input").val().trim();
        trainDestination = $("#destination-input").val().trim();
        trainFrequency = $("#frequency-input").val().trim();
        firstTrain = $("#firstTime-input").val().trim();


        //upload train data to database
        database.ref().push({
            name: trainName,
            destination: trainDestination,
            frequency: trainFrequency,
            firstTime: firstTrain
        });


        //clear text-boxes
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#frequency-input").val("");
        $("#firstTime-input").val("");

    });


    //create firebase event for adding train to database
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

        //store in variables
        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainFrequency = childSnapshot.val().frequency;
        var firstTrain = childSnapshot.val().firstTime;

        //console log this info
        console.log("database " + trainName);
        console.log("database " + trainDestination);
        console.log("database " + trainFrequency);
        console.log("database " + firstTrain);

        //convert first time
        firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");

        //calculate time diff
        diffTime = moment().diff(moment(firstTimeConverted), "minutes")

        //calculate remainder
        tRemainder = diffTime % trainFrequency;

        //calculate minutes away
        minutesAway = trainFrequency - tRemainder;
        console.log("minutes away" + minutesAway);

        //calculate next arrival
        nextArrival = moment().add(minutesAway, "minutes");
        console.log("next arrival" + nextArrival);

        //add train data to table 

        $("#train-table > tbody").append(
            "<tr><td class='col-xs-3'>" + trainName +
            "</td>" +
            "<td class='col-xs-2'>" + trainDestination +
            "</td>" +
            "<td class='col-xs-2'>" + trainFrequency +
            "</td>" +
            "<td class='col-xs-2'>" + moment(nextArrival).format("hh:mm") + // Next Arrival Formula ()
            "</td>" +
            "<td class='col-xs-2'>" + minutesAway + // Minutes Away Formula
            "</td><td class='col-xs-1'> <input type='submit' value='X' class='remove-train btn btn-primary btn-sm'></td></tr>");
    

});

$("body").on("click", ".remove-train", function (){
    $(this).closest('tr').remove();
    database.ref.childremove();
})
});



