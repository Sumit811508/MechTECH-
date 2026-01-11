 const brandData = {
  Car:["Maruti","Hyundai","Tata","Mahindra","Honda","skoda","Toyota","Ford","Volkswagen","Kia"],
  HybridCar:["Toyota_Hybrid","Honda_Hybrid","Ford_Hybrid","Hyundai_Hybrid","Kia_Hybrid","Maruti_Hybrid"],
  Bike:["Hero","Bajaj","TVS","Yamaha","Royal Enfield","KTM","honda"],
  CarEV:["Tata EV","MG","mahindra","honda EV","Hundai EV","Volvo EV"],
  BikeEV:["Ola","Ather","TVS","Bounce","Revolt","Hero EV"],
  Truck:["TataTruck","Ashok_Leyland","MahindraTruck","Eicher"],
  Tractor:["Mahindra","Sonalika"]
};

const modelData = {
  // Car Models
  Maruti:["Swift","Baleno","Brezza","Dzire","Ertiga","Alto","WagonR","Celerio",],
  Hyundai:["i20","Creta","Venue","Alcazar","Verna","Grand i10 Nios",],
  Tata:["Nexon","Punch","Altroz","Harrier","Safari","Tiago"],
  Mahindra:["Scorpio","XUV700","Thar","Bolero","XUV300",],
  skoda:["Kushaq","Slavia","Octavia","Rapid",],
  Toyota:["Innova Crysta","Fortuner","Glanza","Urban Cruiser",],
  Ford:["EcoSport","Endeavour","Figo","Mustang",],
  Volkswagen:["Polo","Vento","T-Roc","Taigun",],
  Kia:["Seltos","Sonet","Carnival","Carens",],

  // Bike Models
  Hero:["Splendor","HF Deluxe","Xtreme","Passion Pro","Super Splendor","PLEASURE+","Destiny"],
  Bajaj:["Pulsar","Dominar","CT 100","Avenger","Platina","Discover","PULSOR NS200",],
  honda:["CB Shine","Activa","Unicorn","CBR",],
  TVS:["Apache","Jupiter","Ntorq","Sport",],
  Yamaha:["FZ","R15","MT-15","FZ-S",],
  Royal_Enfield:["Classic 350","Bullet 350","Himalayan","Interceptor 650",],
  KTM:["Duke 200","RC 200","390 Duke","RC 390",],

  // EV Car Models
   TataEV:["Nexon EV","Tigor EV","Altroz EV",],
   MG:["ZS EV","Hector EV","Marvel R EV",],
   mahindra:["eKUV100","eXUV300","eVerito",],
   hondaEV:["Honda e","Honda Jazz EV",],
   HundaiEV:["Kona Electric","Ioniq 5","Ioniq Electric",],
   VolvoEV:["XC40 Recharge","C40 Recharge",],

   //Bike EV Models
    Hero_EV:["Optima HX","Photon HX","Zir","Nyx",],
    Revolt:["RV400","RV300",],
    Bounce:["Infinity E1","Infinity E2",],
    Ola:["S1","S1 Pro","S1 Air",],
    Ather:["450X","450 Plus","340",],
    TVS_EV:["iQube","Creon","Apache RTR Electric",],


  //Truck Models
    TataTruck:["Signa","Prima","Ultra",],
    Ashok_Leyland:["Captain","Ecomet","Dost",],
    MahindraTruck:["Blazo","Furio","Jeeto",], 
    Eicher:["Pro 1049","Pro 1110","Pro 3015",], 

   //Hybrid Car Models
    Toyota_Hybrid:["Camry Hybrid","Vellfire Hybrid","Highlander Hybrid",],
    Honda_Hybrid:["Accord Hybrid","CR-V Hybrid","City Hybrid",],
    Ford_Hybrid:["Escape Hybrid","Explorer Hybrid","Fusion Hybrid",],
    Hyundai_Hybrid:["Sonata Hybrid","Tucson Hybrid","Santa Fe Hybrid",],
    Kia_Hybrid:["Sorento Hybrid","Sportage Hybrid","Niro Hybrid",],
    Maruti_Hybrid:["Ciaz Hybrid","Eeco Hybrid","Ertiga Hybrid",],
     // Tractor Models
   Mahindra:["Arjun","Jupiter","Yuvraj","Trakstar",],
   Sonalika:["Sultan RX","Tiger DI","Powertrac Euro 50",],
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