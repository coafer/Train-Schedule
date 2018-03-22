// Initialize Firebase
var config = {
    apiKey: "AIzaSyAv8eUbjo_7z6KyFvBH8_a02oJf6mot5bs",
    authDomain: "train-scheduler-7cf9e.firebaseapp.com",
    databaseURL: "https://train-scheduler-7cf9e.firebaseio.com",
    projectId: "train-scheduler-7cf9e",
    storageBucket: "train-scheduler-7cf9e.appspot.com",
    messagingSenderId: "593960490023"
};
firebase.initializeApp(config);

//Create var for db    
var database = firebase.database();

// Capture Button Click
$("#add-train").on("click", function() {
    event.preventDefault();
    // Don't refresh the page!
    var trainName = $("#train-name").val().trim();  
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();

    //Create object with input data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency 
    };  
    // Push Object to DB
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.frequency);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("frequency").val("");

});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;  
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;

    //One year back    
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    //Current time calc
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    //MomentJS method for calc the difference in time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    //Calc the remaining time
    var tRemainder = diffTime % frequency;
    console.log(tRemainder); 

    //Next train arrival
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextT = moment(nextTrain).format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm")); 

    //Minutes remaining to the arrival
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);



    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
    frequency + "</td><td>" + nextT + "</td><td>" + tMinutesTillTrain);
});