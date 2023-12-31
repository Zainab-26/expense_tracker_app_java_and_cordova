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
		viewAllTrips();
	})

    //If database is upgraded
	tripsDB.addEventListener('upgradeneeded', (ev) =>
	{
		db = ev.target.result;
		console.log('upgrade', db);
		//Creating objects stores which are like tables
		if(!db.objectStoreNames.contains('Trips')){
          objectStore =	db.createObjectStore('Trips', {keyPath:'TripID',  autoIncrement:true});
         }
        if(!db.objectStoreNames.contains('Users')){
           objectStore =	db.createObjectStore('Users', {keyPath:'Email'});
         }
		})

    //Viewing all Trip data from database
	function viewAllTrips()
	{
		let list = document.querySelector('.listOfTrips');

		let transact = makeTransaction('Trips','readonly');

		transact.oncomplete = (ev) =>
		{

		}

        //Creating the transaction
		let store = transact.objectStore('Trips');

		//Reading all the data from the trips table
		let getReq = store.getAll();

        //If the get request was successful
		getReq.onsuccess = (ev) => {
			let getReq = ev.target;
			console.log({getReq});
			list.innerHTML = getReq.result.map((Trips) => {
				return `<li id="listItems" data-key="${Trips.TripID}">
				<h1>${Trips.res_trip_name}</h1>
				<p id="center">${Trips.res_trip_destination}</p>

				</li>`;
			})
			.join('\n');
		}

        //If the get request was failed
		getReq.onerror = (err) => {
			console.warn(err);
		};
	}

    //When the user clicks on a trip, data is transferred to Edit trip page and is opened
	window.onload = document.querySelector('.listOfTrips').addEventListener('click', (ev) =>{
		let list = ev.target.closest('[data-key]');
		let id = list.getAttribute('data-key');
        window.localStorage.setItem('tripID' , id);
		window.open("editTrip.html");
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
   Steve Griffith, 2021. IndexedDB Part 3 - get and getAll.
   Available at: https://www.youtube.com/watch?v=y--Rjq6QV_o&t=1s (Accessed 10/11/2022)
*/