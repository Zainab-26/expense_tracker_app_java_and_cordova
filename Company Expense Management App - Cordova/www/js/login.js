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

        //When login form is submitted
		document.loginForm.addEventListener('submit', (ev) => {
		    ev.preventDefault();

                    //Getting value of form inputs
		            let email = document.getElementById("email").value;
                    let password = document.getElementById("password").value;

                    //Any operation in IndexedDb needs a transaction
                    let transact = makeTransaction('Users','readonly');
                    console.log(transact);

                    transact.oncomplete = (ev) =>
                    {
                    };

                    let store = transact.objectStore('Users');
                    let req = store.get(email);
                    console.log(req);

                   req.onsuccess = (ev) => {

                       let user = ev.target.result;
                       console.log(user);

                       if(ev.target.result){
                        //Checking if email and password match
                        if(password != ev.target.result.res_password){
                            alert("Incorrect username or password, please try again.");
                            console.log("Incorrect details");
                         }
                          else{
                            	 console.log("Success");
                            	 alert("Welcome to M-Expense");
                            	 window.open("viewAllTrips.html");
                            }
                           }
                       }
                      req.onerror = (err) => {
                           console.warn(err);
                        };
                   return transact;
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