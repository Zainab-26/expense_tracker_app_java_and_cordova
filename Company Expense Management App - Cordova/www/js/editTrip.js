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

    //If database was unable to be created
	tripsDB.addEventListener('success', (ev) =>
	{
		db = ev.target.result;
		console.log('success', db);
        viewTrip();
        let tripId = window.localStorage.getItem('tripID');
        console.log(tripId);
	})

    //If database is upgraded
	tripsDB.addEventListener('upgradeneeded', (ev) =>
	{
		db = ev.target.result;
		console.log('upgrade', db);
		if(!db.objectStoreNames.contains('Trips')){

          objectStore =	db.createObjectStore('Trips', {keyPath:'TripID',  autoIncrement:true});
          }
                if(!db.objectStoreNames.contains('Users')){
                    objectStore =	db.createObjectStore('Users', {keyPath:'Email'});
                  }
		})


    //Function to view a specific trip
    function viewTrip()
    {
            //Getting Trip id from previous page
            let tripId = window.localStorage.getItem('tripID');

            //Making transaction
        	let transact = makeTransaction('Trips', 'readonly');
                        console.log(transact);
                		transact.oncomplete = (ev) =>
                		{

                		};

                		let store = transact.objectStore('Trips');

                		//Getting trip details based on TripID
                		let req = store.get(tripId);
                		console.log(req);

                        //If the request was successful
                		req.onsuccess = (ev) => {

                			let trips = ev.target.result;
                			console.log(trips);

                            //setting value of form inputs
                			document.getElementById("tripName").value = trips.res_trip_name;
                			document.getElementById("tripDestination").value = trips.res_trip_destination
                			document.getElementById("depDate").value = trips.res_dep_date;
                			document.getElementById("arrDate").value = trips.res_arr_date;

                			 if(trips.risk_assess1 == "Yes")
                			 {
                			 	document.getElementById('riskYes').checked = true;
                			 }else{
                			 	document.getElementById('riskNo').checked = true;
                			 }

                			document.getElementById("transport").value = trips.res_transport;

                			if(trips.res_acc_needed == "Yes")
                			{
                			    document.getElementById('accYes').checked = true;
                			}else{
                			    document.getElementById('accNo').checked = true;
                			}

                			document.getElementById("tripDesc").value = trips.res_trip_desc;
                			document.tripForm.setAttribute('data-key', trips.TripID);
                		}

                		req.onerror = (err) => {
                			console.warn(err);
                		};
                		return transact;
    }

    //When the edit form is submitted
    document.getElementById("editBtn").addEventListener('click', (ev) => {
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
		let tripId = document.tripForm.getAttribute('data-key');

		if(tripId){
		    //Creating object
            let trips = {
                        TripID: tripId,
            			res_trip_name,
            			res_trip_destination,
            			res_dep_date,
            			res_arr_date,
            			risk_assess1,
            			res_transport,
            			res_acc_needed,
            			res_trip_desc
            		}

                    //Creating transaction
            		let transact = makeTransaction('Trips','readwrite');
            		transact.oncomplete = (ev) => {
            			console.log(ev);
            		}

            		let store = transact.objectStore('Trips');

            		//Updating data entered in Edit trip form
                    let request = store.put(trips);

                    //If edit was successful
            		request.onsuccess = (ev) => {
            		    alert("Trip has been successfully updated.");
            		    window.open("viewAllTrips.html");
            			console.log('successfully updated an object');
            		  };

                    //If edit failed
            		request.onerror = (err) => {
            		    alert("The trip could not update, please try again.");
            			console.log('error in request to add');
            		};

		}
    });

    //If user wants to delete specific trip
    document.getElementById("deleteBtn").addEventListener('click', (ev) => {
        ev.preventDefault();

        //Getting tripId from previous page
        let tripId = window.localStorage.getItem('tripID');
        if(tripId){

            //Making the transaction
            let transact = makeTransaction('Trips','readwrite');
            		transact.oncomplete = (ev) => {
            			console.log(ev);
            		}

            		let store = transact.objectStore('Trips');

            		//Deleting trip data based on tripId
                    let request = store.delete(tripId);

                    //On successful delete
            		request.onsuccess = (ev) => {
            		    alert("Trip has been successfully deleted.");
            		    window.open("viewAllTrips.html");
            			console.log('successfully deleted an object');
            		  };

                    //On failed delete
            		request.onerror = (err) => {
            		    alert("The trip could not be deleted, please try again.");
            			console.log('error in request to delete');
            		};
        }
    });

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
   Steve Griffith, 2021. IndexedDB Part 4 - insert, update, and delete.
   Available at: https://www.youtube.com/watch?v=8UFOSQXT_pg (Accessed 10/11/2022)
*/



