/* ===== Salon Email Setup (via EmailJS) =====
   Neeche apni EmailJS ki 3 values daal dein.
   Yeh aapko https://www.emailjs.com par FREE account bana kar milengi:

   1) EMAILJS_PUBLIC_KEY  -> Account > General > Public Key
   2) EMAILJS_SERVICE_ID  -> Email Services me apna Gmail/Outlook connect karke jo Service ID milegi
   3) EMAILJS_TEMPLATE_ID -> Email Templates me naya template banao, jo ID milegi

   Template banate waqt in variable names ka use karna (double curly braces me),
   taaki email me sahi data aaye:
   {{from_name}}  {{from_email}}  {{phone}}  {{service}}  {{price}}
   {{date}}  {{time}}  {{notes}}  {{to_email}}

   "To Email" field me EmailJS template settings ke andar apna salon email
   (Krupalinail@gmail.com) fix kar dena, taaki booking hamesha wahi par aaye.
   ========================== */
const EMAILJS_PUBLIC_KEY = "sjp-A1OMcASwbKIu9";
const EMAILJS_SERVICE_ID = "service_rn8uejc";
const EMAILJS_TEMPLATE_ID = "template_623ebal";
const SALON_EMAIL = "krupalinails@gmail.com";

emailjs.init(EMAILJS_PUBLIC_KEY);

const NAIL_IMG = "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80";
document.getElementById("heroImg").src = NAIL_IMG;

const services = {
  manicures: [
    {name:"Classic Manicure", price:35, time:"30 min"},
    {name:"Gel Manicure", price:50, time:"45 min"},
    {name:"Dip Powder Manicure", price:55, time:"50 min"},
    {name:"French Manicure", price:45, time:"40 min"}
  ],
  pedicures: [
    {name:"Classic Pedicure", price:45, time:"40 min"},
    {name:"Spa Pedicure", price:60, time:"55 min"},
    {name:"Gel Pedicure", price:65, time:"60 min"},
    {name:"Deluxe Pedicure", price:75, time:"75 min"}
  ],
  enhancements: [
    {name:"Acrylic Full Set", price:70, time:"90 min"},     
    {name:"Acrylic Fill", price:45, time:"60 min"},
    {name:"Gel Full Set", price:75, time:"90 min"},
    {name:"Gel Fill", price:50, time:"60 min"}
  ],
  art: [
    {name:"Nail Design (per nail)", price:5, time:"5 min"},
    {name:"3D Nail Art (per nail)", price:8, time:"10 min"},
    {name:"Chrome / Cat Eye", price:15, time:"15 min"},
    {name:"Ombré", price:15, time:"20 min"}
  ],
  extras: [
    {name:"Nail Repair (per nail)", price:5, time:"5 min"},
    {name:"Nail Polish Change", price:15, time:"15 min"},
    {name:"Paraffin Wax Treatment", price:15, time:"15 min"},
    {name:"French Tip", price:10, time:"10 min"},
    {name:"Nail Stamping", price:8, time:"10 min"},
    {name:"Gel Removal", price:20, time:"20 min"}
  ]
};

const select = document.getElementById("service");
let flatIndex = 0;
const flatServices = [];

Object.keys(services).forEach(cat=>{
  const grid = document.querySelector(`.grid[data-cat="${cat}"]`);
  services[cat].forEach(s=>{
    flatServices.push(s);
    const i = flatIndex++;
    grid.innerHTML += `<article class="card"><div class="photo"><img src="${NAIL_IMG}" alt="${s.name}"></div><div class="card-body"><h3>${s.name}</h3><div class="price">$${s.price}</div><div class="meta">${s.time} • Professional finish</div><button class="btn light" type="button" onclick="choose(${i})">Book this service</button></div></article>`;
    select.innerHTML += `<option value="${i}">${s.name} — $${s.price}</option>`;
  });
});

function choose(i){select.value=i;document.getElementById("booking").scrollIntoView({behavior:"smooth"});update()}
function update(){
  const s=flatServices[select.value];const d=document.getElementById("date").value,t=document.getElementById("time").value;
  document.getElementById("preview").textContent=s?(s.name+" • $"+s.price+(d?" • "+new Date(d+"T00:00:00").toLocaleDateString("en-AU"):"")+(t?" • "+t:"")):"Select your service, date and time.";
}
select.onchange=update;document.getElementById("date").onchange=update;document.getElementById("time").onchange=update;
const date=document.getElementById("date");date.min=new Date().toISOString().split("T")[0];

document.getElementById("bookingForm").onsubmit=e=>{
  e.preventDefault();

  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const s=flatServices[select.value],d=new Date(date.value+"T00:00:00").toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});
  const customerName=document.getElementById("name").value;
  const customerPhone=document.getElementById("phone").value;
  const customerEmail=document.getElementById("email").value;
  const notes=document.getElementById("notes").value || "None";
  const timeVal=document.getElementById("time").value;

  const templateParams = {
    to_email: SALON_EMAIL,
    from_name: customerName,
    from_email: customerEmail,
    phone: customerPhone,
    service: s.name,
    price: s.price,
    date: d,
    time: timeVal,
    notes: notes
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function(){
      document.getElementById("successText").textContent=`Thanks, ${customerName}! Your ${s.name} appointment is requested for ${d} at ${timeVal}. We'll confirm with you shortly by email or phone.`;
      e.target.style.display="none";
      document.getElementById("success").style.display="block";
    })
    .catch(function(error){
      console.error("EmailJS error:", error);
      alert("Sorry, something went wrong while sending your booking request. Please try again or contact us directly.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Confirm Appointment";
    });
};