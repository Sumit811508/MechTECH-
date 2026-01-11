 const brandData = {
  Car:["Maruti","Hyundai","Tata","Mahindra","Honda"],
  Bike:["Hero","Bajaj","TVS","Yamaha"],
  EV:["Tata EV","MG","Ola","Ather"],
  Truck:["Tata","Ashok Leyland"],
  Tractor:["Mahindra","Sonalika"]
};

const modelData = {
  Maruti:["Swift","Baleno","Brezza"],
  Hyundai:["i20","Creta"],
  Tata:["Nexon","Punch"],
  Mahindra:["Scorpio","XUV700"],
  Hero:["Splendor","HF Deluxe"],
  Bajaj:["Pulsar","Dominar"]
};

const vehicleType = document.getElementById("vehicleType");
const brand = document.getElementById("brand");
const model = document.getElementById("model");

vehicleType.addEventListener("change", () => {
  brand.innerHTML = "<option value=''>Brand</option>";
  model.innerHTML = "<option value=''>Model</option>";

  (brandData[vehicleType.value] || []).forEach(b => {
    brand.innerHTML += `<option>${b}</option>`;
  });
});

brand.addEventListener("change", () => {
  model.innerHTML = "<option value=''>Model</option>";

  (modelData[brand.value] || []).forEach(m => {
    model.innerHTML += `<option>${m}</option>`;
  });
});

document.getElementById("bookingForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Booking data ready for backend integration 🚀");
});

/* LOGIN & SCROLL */
function scrollToBook(){
  document.getElementById("loginModal").style.display = "flex";
}

function closeLogin(){
  document.getElementById("loginModal").style.display = "none";
}

function loginUser(){
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  if(email && pass){
    closeLogin();
    document.getElementById("book").scrollIntoView({ behavior:"smooth" });
  } else {
    alert("Please enter valid login details");
  }
}
/* END LOGIN & SCROLL */