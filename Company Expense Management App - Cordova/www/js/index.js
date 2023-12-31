import { tripId } from './tripId.js';

//(Griffith, 2021)

const IDB = (function init() {
	let db = null;
	let objectStore = null;

	//Creates database
	let tripsDB = window.indexedDB.open("M-Expense", 6);

    //If database was unable to be created
	tripsDB.addEventListener('error', (err) =>
	{
		console.warn(err);
	});

    //If database was created successfully
	tripsDB.addEventListener('success', (ev) =>
	{
		db = ev.target.result;
		console.log('success', db);

	})

    //If database is upgraded
	tripsDB.addEventListener('upgradeneeded', (ev) =>
	{
		db = ev.target.result;
		console.log('upgrade', db);
		//Creating objects stores which are like tables
		if(!db.objectStoreNames.contains('Trips')){
          objectStore =	db.createObjectStore('Trips', {keyPath:'TripID'});
          }

        if(!db.objectStoreNames.contains('Users')){
          objectStore =	db.createObjectStore('Users', {keyPath:'Email'});
        }
		})

    //When the Add trip form is submitted
	document.tripForm.addEventListener('submit', (ev) => {
		ev.preventDefault();

        //Getting value of form inputs
		let res_trip_name = document.getElementById("tripName").value.trim();
		let res_trip_destination = document.getElementById("tripDestination").value.trim();
		let res_dep_date = document.getElementById("depDate").value.trim();
		let res_arr_date = document.getElementById("arrDate").value.trim();
		let risk_assess1 =  document.querySelector('input[name="riskAssess"]:checked').value;
		let res_transport = document.getElementById("transport").value.trim();
		let res_acc_needed = document.querySelector('input[name="accommodation"]:checked').value;
		let res_trip_desc = document.getElementById("tripDesc").value.trim();

        //Creating object
		let trips = {
		    TripID: tripId(),
			res_trip_name,
			res_trip_destination,
			res_dep_date,
			res_arr_date,
			risk_assess1,
			res_transport,
			res_acc_needed,
			res_trip_desc
		}

        //Any operation in IndexedDb needs a transaction
		let transact = makeTransaction('Trips','readwrite');
		transact.oncomplete = (ev) => {
			console.log(ev);
		}

		let store = transact.objectStore('Trips');

		//Adding user input to database
        let request = store.add(trips);

        //Successful addition to database
		request.onsuccess = (ev) => {
			console.log('successfully added an object');
			window.open("viewAllTrips.html")
		  };

         //Error when adding to database
		request.onerror = (err) => {
			console.log('error in request to add');
		};

	})

    //Making the transaction for the operation
	function makeTransaction(storeName, mode){
    	let transact = db.transaction(storeName, mode);

    	transact.onerror = (err) => {
    		console.warn(err);
    	};
    	return transact;
    }
})();

/* References
   Steve Griffith, 2021. IndexedDB Part 1 - Creating and Versioning.
   Available at: https://www.youtube.com/watch?v=gb5ovg7YCig (Accessed 10/11/2022)
*/

