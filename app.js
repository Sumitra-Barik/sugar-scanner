let scanCount = 0;
let stream = null;

const scanOverlay = document.getElementById("scanOverlay");
const scanBtn = document.getElementById("scanBtn");
const captureBtn = document.getElementById("captureBtn");
const video = document.getElementById("cameraPreview");
const resultSection = document.getElementById("resultSection");

const productName = document.getElementById("productName");
const sugarVal = document.getElementById("sugarVal");
const calVal = document.getElementById("calVal");
const fatVal = document.getElementById("fatVal");
const carbVal = document.getElementById("carbVal");

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
  { name: "Biscuit Packet", sugar: 15, calories: 450, fat: 16, carbs: 18 },
  { name: "Sugar Packet (100g)", sugar: 100, calories: 387, fat: 0, carbs: 99 }
];

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);




/* ================= START SCAN ================= */
scanBtn.onclick = async () => {

  // ✅ Remove old captured image
  const oldCanvas = video.parentElement.querySelector("canvas");
  if (oldCanvas) oldCanvas.remove();

  scanOverlay.style.display = "none";

  video.style.display = "block";
  captureBtn.style.display = "inline-block";
  resultSection.classList.add("hidden");

  try {
    const constraints = {
      video: isMobile
        ? { facingMode: { ideal: "environment" } }
        : true
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

  } catch (err) {
    console.error("Camera error:", err);
    alert("Camera access denied or not available.");
  }
};




/* ================= CAPTURE ================= */
captureBtn.onclick = () => {

  const oldCanvas = video.parentElement.querySelector("canvas");
  if (oldCanvas) oldCanvas.remove();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  video.parentElement.appendChild(canvas);

  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.zIndex = "1";

  stream.getTracks().forEach(track => track.stop());

  video.style.display = "none";
  captureBtn.style.display = "none";

  scanOverlay.style.display = "block";
  scanOverlay.style.zIndex = "10";

  setTimeout(() => {

    scanOverlay.style.display = "none";

    const product = scanCount === 0 ? demoProducts[0] : demoProducts[1];
    scanCount++;

    showResult(product);
    updateState(product);

  }, 3500);
};




/* ================= RESULT ================= */
function showResult(p){
  resultSection.classList.remove("hidden");
  productName.textContent = p.name;
  sugarVal.textContent = p.sugar+"g";
  calVal.textContent = p.calories+" kcal";
  fatVal.textContent = p.fat+"g";
  carbVal.textContent = p.carbs+"g";
}




/* ================= STATE ================= */
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