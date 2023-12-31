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

    //When user submits register form
	document.registerUser.addEventListener('submit', (ev) => {
		ev.preventDefault();

        //Getting value of form inputs
		let res_full_name = document.getElementById("fullName").value.trim();
		let res_email = document.getElementById("email").value.trim();
		let res_password = document.getElementById("password").value.trim();

        //Creating object
		let users = {
		    Email: res_email,
			res_full_name,
			res_password
		}

        //Any operation in IndexedDb needs a transaction
		let transact = makeTransaction('Users','readwrite');
		transact.oncomplete = (ev) => {
			console.log(ev);
		}

		let store = transact.objectStore('Users');
		console.log(store);

		//Adding user input to database
        let request = store.add(users);
        console.log(request);

        //Successful addition to database
		request.onsuccess = (ev) => {
			console.log('successfully added an object');
			window.open("viewAllTrips.html");
		  };

        //Error when adding to database
		request.onerror = (err) => {
		    alert("Sorry, the user already exists, try logging in.")
			console.log('error in request to add');
		};

	})

    //Making the transaction for the operation
	function makeTransaction(storeName, mode){
    	et transact = db.transaction(storeName, mode);

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


