//index.js
import './tracing.js';
//import './session.js';
import './session-id-span-processor.js'
require('./style.css');
const btnEl = document.getElementById("btn");
const birthdayEl = document.getElementById("birthday");
const resultEl = document.getElementById("result");


function calculateAge() {
  const birthdayValue = birthdayEl.value;
  if (birthdayValue === "") {
    alert("Please enter your birthday");
  } else {
    const age = getAge(birthdayValue);
    resultEl.innerText = `Your age is ${age} ${age > 1 ? "years" : "year"} old`;
  }
}

function getAge(birthdayValue) {
  const currentDate = new Date();
  const birthdayDate = new Date(birthdayValue);
  let age = currentDate.getFullYear() - birthdayDate.getFullYear();
  const month = currentDate.getMonth() - birthdayDate.getMonth();

  if (
    month < 0 ||
    (month === 0 && currentDate.getDate() < birthdayDate.getDate())
  ) {
    age--;
  }

  return age;
}

btnEl.addEventListener("click", calculateAge);


//    web-vitals

//import { getCLS, getFID, getLCP } from 'web-vitals';
//
//// Measure CLS
//getCLS(metric => {
//  console.log('Cumulative Layout Shift (CLS):', metric.value);
//});
//
//// Measure FID
//getFID(metric => {
//  console.log('First Input Delay (FID):', metric.value);
//});
//
//// Measure LCP
//getLCP(metric => {
//  console.log('Largest Contentful Paint (LCP):', metric.value);
//});

