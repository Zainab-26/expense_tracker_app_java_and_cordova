export const tripId = () => {
  let time =  Date.now().toString(5).toLocaleUpperCase();
  let random = parseInt(Math.random()*Number.MAX_SAFE_INTEGER);
  random = random.toString(5).slice(0,12).padStart(12,0).toLocaleUpperCase();
  return ''.concat(time, random);

  //(Griffith, 2021)
};

/* References
   Steve Griffith, 2021. IndexedDB Part 1 - Creating and Versioning.
   Available at: https://www.youtube.com/watch?v=gb5ovg7YCig (Accessed 10/11/2022)
*/