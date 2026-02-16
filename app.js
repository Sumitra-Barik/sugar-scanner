let scanCount = 0;
let stream = null;

const scanBtn = document.getElementById("scanBtn");
const captureBtn = document.getElementById("captureBtn");
const video = document.getElementById("cameraPreview");
const loading = document.getElementById("loading");
const resultSection = document.getElementById("resultSection");

const productName = document.getElementById("productName");
const sugarVal = document.getElementById("sugarVal");
const calVal = document.getElementById("calVal");
const fatVal = document.getElementById("fatVal");
const carbVal = document.getElementById("carbVal");
const indicatorFill = document.getElementById("indicatorFill");
const sugarWarning = document.getElementById("sugarWarning");

const countEl = document.getElementById("count");
const totalSugarEl = document.getElementById("totalSugar");
const totalCalEl = document.getElementById("totalCal");
const limitWarning = document.getElementById("limitWarning");
const healthScoreEl = document.getElementById("healthScore");

const circle = document.getElementById("circleProgress");
const circleValue = document.getElementById("circleValue");

const radius = 65;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

let state = { scans: [], totalSugar: 0, totalCal: 0 };
const SUGAR_LIMIT = 50;

const demoProducts = [
  { name: "Biscuit Packet", sugar: 8, calories: 150, fat: 6, carbs: 18 },
  { name: "Sugar Packet (100g)", sugar: 100, calories: 400, fat: 0, carbs: 100 }
];

scanBtn.onclick = async () => {
  video.style.display = "block";
  captureBtn.style.display = "inline-block";
  resultSection.classList.add("hidden");

  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
};

captureBtn.onclick = () => {
  stream.getTracks().forEach(track => track.stop());
  video.style.display = "none";
  captureBtn.style.display = "none";

  loading.style.display = "block";

  setTimeout(() => {
    loading.style.display = "none";

    const product = scanCount === 0 ? demoProducts[0] : demoProducts[1];
    scanCount++;

    showResult(product);
    updateState(product);

  }, 2000);
};

function showResult(p){
  resultSection.classList.remove("hidden");
  productName.textContent = p.name;
  sugarVal.textContent = p.sugar+"g";
  calVal.textContent = p.calories+" kcal";
  fatVal.textContent = p.fat+"g";
  carbVal.textContent = p.carbs+"g";
}

function updateState(p){
  state.scans.push(p);
  state.totalSugar += p.sugar;
  state.totalCal += p.calories;

  countEl.textContent = state.scans.length;
  totalSugarEl.textContent = state.totalSugar+"g";
  totalCalEl.textContent = state.totalCal+" kcal";

  const percent = Math.min(100,(state.totalSugar/SUGAR_LIMIT)*100);
  const offset = circumference - (percent/100)*circumference;

  circle.style.strokeDashoffset = offset;
  circleValue.textContent = state.totalSugar+"g";

  if(state.totalSugar > SUGAR_LIMIT){
    circle.style.stroke = "var(--danger)";
    limitWarning.classList.remove("hidden");
  } else {
    circle.style.stroke = "var(--success)";
    limitWarning.classList.add("hidden");
  }

  healthScoreEl.textContent = Math.max(0,100-state.totalSugar);
}