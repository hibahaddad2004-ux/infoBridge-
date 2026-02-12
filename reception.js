window.onload = function(){

 const data = JSON.parse(localStorage.getItem("bonLivraison")) || [];
 const tbody = document.querySelector("#receptionTable tbody");

 data.forEach(item => {

  tbody.innerHTML += `
   <tr>

    <td>${item.ref || "REF-" + Math.floor(Math.random()*10000)}</td>

    <td>${item.article}</td>

    <td>${item.qteBL}</td>

    <td>
      <input type="number" class="qteRecue" value="${item.qteBL}">
    </td>

    <td>
     <select class="etatSelect">
      <option>Bon</option>
      <option>Endommagé</option>
     </select>
    </td>

    <td>
     <input type="number" class="qteEndommagee"
     placeholder="Qté"
     style="display:none; width:80px">
    </td>

    <td>
     <input type="checkbox" class="conformeCheck" checked>
    </td>

   </tr>
  `;
 });

 // Gestion état endommagé
 document.querySelectorAll(".etatSelect").forEach(select => {

  select.addEventListener("change", function(){

   let row = this.closest("tr");
   let inputEnd = row.querySelector(".qteEndommagee");
   let conforme = row.querySelector(".conformeCheck");

   if(this.value === "Endommagé"){
    inputEnd.style.display = "inline-block";
    conforme.checked = false;
   } else {
    inputEnd.style.display = "none";
    inputEnd.value = "";
    conforme.checked = true;
   }

  });

 });

}


// ========================
// GENERER APERCU BR
// ========================

function generateWMS(){

 let rows = document.querySelectorAll("#receptionTable tbody tr");

 if(rows.length === 0){
  alert("Aucune marchandise réceptionnée !");
  return;
 }

 let result = `
 <h3>Bon de Réception</h3>
 <table style="width:100%; border-collapse:collapse">
 <tr>
  <th>Réf</th>
  <th>Article</th>
  <th>Qté BL</th>
  <th>Qté Reçue</th>
  <th>Etat</th>
  <th>Qté Endommagée</th>
  <th>Conforme</th>
 </tr>
 `;

 rows.forEach(row => {

  let ref = row.cells[0].innerText;
  let article = row.cells[1].innerText;
  let qteBL = row.cells[2].innerText;

  let qteRecue = row.querySelector(".qteRecue").value;
  let etat = row.querySelector(".etatSelect").value;
  let qteEnd = row.querySelector(".qteEndommagee").value || "0";
  let conforme = row.querySelector(".conformeCheck").checked ? "Oui" : "Non";

  result += `
  <tr>
   <td>${ref}</td>
   <td>${article}</td>
   <td>${qteBL}</td>
   <td>${qteRecue}</td>
   <td>${etat}</td>
   <td>${qteEnd}</td>
   <td>${conforme}</td>
  </tr>
  `;

 });

 result += "</table>";

 document.getElementById("wmsResult").innerHTML = result;
}


// ========================
// CREER DOCUMENT WMS
// ========================

function createWMSDocument(){

 let rows = document.querySelectorAll("#receptionTable tbody tr");

 if(rows.length === 0){
  alert("Aucune marchandise !");
  return;
 }

 let wmsData = [];

 rows.forEach(row => {

  wmsData.push({

   ref: row.cells[0].innerText,
   article: row.cells[1].innerText,
   qteBL: row.cells[2].innerText,

   qteRecue: row.querySelector(".qteRecue").value,
   etat: row.querySelector(".etatSelect").value,
   qteEndommagee: row.querySelector(".qteEndommagee").value || "0",
   conforme: row.querySelector(".conformeCheck").checked ? "Oui" : "Non"

  });

 });

 localStorage.setItem("bonReceptionWMS", JSON.stringify(wmsData));

 window.location.href = "bon_reception_wms.html";
}
