const TARIF_STOCK = 2;
const TARIF_MANUT = 5;


/* ================= LOAD REFS ================= */

function loadRefsInSelect(select){

 let data = JSON.parse(localStorage.getItem("bonReceptionWMS")) || [];

 select.innerHTML = "<option value=''>Sélectionner Référence</option>";

 data.forEach(item => {

  select.innerHTML += `
   <option value="${item.ref}">
    ${item.ref} - ${item.article}
   </option>
  `;

 });

}


/* ================= ON LOAD ================= */

window.onload = function(){

 let firstSelect = document.querySelector(".refSelect");

 if(firstSelect){
  loadRefsInSelect(firstSelect);
 }

};


/* ================= ADD SELECT ================= */

function addRefSelect(){

 let container = document.getElementById("refsContainer");

 let newSelect = document.createElement("select");

 newSelect.className = "refSelect";
 newSelect.style.marginRight = "10px";

 container.appendChild(newSelect);

 loadRefsInSelect(newSelect);

}


/* ================= SEARCH MULTI ================= */

function searchMultiple(){

 let selects = document.querySelectorAll(".refSelect");

 let data = JSON.parse(localStorage.getItem("bonReceptionWMS")) || [];

 // RESET UI
 document.getElementById("resumeCard").innerHTML = "<h3>Résumé Marchandises</h3>";
 document.getElementById("factureCard").innerHTML = "<h3>Factures</h3>";
 document.getElementById("paiementCard").innerHTML = "<h3>Paiement</h3>";
 document.getElementById("rdvCard").innerHTML = "<h3>Rendez-vous enlèvement</h3>";

 let hasResult = false;

 selects.forEach(select => {

   let ref = select.value;
   if(!ref) return;

   let item = data.find(x => x.ref === ref);

   if(item){

     hasResult = true;

     showResume(item);
     showFacture(item);
     showPaiement(item);
     showRDV(item);

   }

 });

 if(hasResult){
  document.getElementById("resumeCard").style.display = "block";
  document.getElementById("factureCard").style.display = "block";
  document.getElementById("paiementCard").style.display = "block";
  document.getElementById("rdvCard").style.display = "block";
 }else{
  alert("Aucune marchandise sélectionnée");
 }

}



/* ================= RESUME ================= */

function showResume(item){

 let dateEntree = new Date(Date.now() - 5*24*60*60*1000);
 let today = new Date();

 let jours = Math.ceil((today - dateEntree)/(1000*3600*24));

 document.getElementById("resumeCard").innerHTML += `
 <div class="resumeItemCard">

   <div class="resumeHeader">
     <span class="resumeRef">📦 ${item.ref}</span>
   </div>

   <div class="resumeGrid">

     <div>
       <span class="label">Article</span>
       <span class="value">${item.article}</span>
     </div>

     <div>
       <span class="label">Date entrée</span>
       <span class="value">${dateEntree.toLocaleDateString()}</span>
     </div>

     <div>
       <span class="label">Durée stockage</span>
       <span class="value">${jours} jours</span>
     </div>

     <div>
       <span class="label">Nb colis</span>
       <span class="value">${item.qteRecue}</span>
     </div>

   </div>

 </div>
 `;
}


/* ================= FACTURE ================= */

function showFacture(item){

 let jours = 5;

 let montant =
 (jours * TARIF_STOCK * item.qteRecue)
 + TARIF_MANUT
 + TARIF_MANUT;

 let factures = JSON.parse(localStorage.getItem("factures")) || [];

 let facture = factures.find(f => f.ref === item.ref);

 // ⭐ IMPORTANT → SI PAS EXISTE → CREER NON PAYE
 if(!facture){

   facture = {
     ref:item.ref,
     montant:montant,
     statut:"NON_PAYE"
   };

   factures.push(facture);
   localStorage.setItem("factures", JSON.stringify(factures));

 }

 let badge =
 facture.statut === "PAYE"
 ? `<span class="badgePaid">PAYE</span>`
 : `<span class="badgeUnpaid">NON PAYÉ</span>`;

document.getElementById("factureCard").innerHTML += `
 <div class="factureItem">

   <div class="factureHeader">
     <span class="factureRef">${facture.ref}</span>
     ${badge}
   </div>

   <div class="factureAmount">
     ${facture.montant} DT
   </div>

 </div>
`;

}



/* ================= PAIEMENT ================= */

function showPaiement(item){

 document.getElementById("paiementCard").innerHTML += `
 <div style="margin-bottom:15px">
 Réf : ${item.ref}
 <br>
 <button class="btnPrimary" onclick="payer('${item.ref}')">
 Payer
 </button>
 </div>
 `;

}


function payer(ref){

 let factures = JSON.parse(localStorage.getItem("factures")) || [];

 let facture = factures.find(f => f.ref === ref);

 if(facture){
   facture.statut = "PAYE";
 }

 localStorage.setItem("factures", JSON.stringify(factures));

 alert("Paiement réussi");

 searchMultiple();

}



/* ================= RDV ================= */

function showRDV(item){

 let factures = JSON.parse(localStorage.getItem("factures")) || [];

 let facture = factures.find(f => f.ref === item.ref);

 if(!facture || facture.statut !== "PAYE"){

 document.getElementById("rdvCard").innerHTML += `
 <div style="margin-bottom:15px">
 Réf : ${item.ref}<br>
 Paiement requis
 </div>
 `;
 return;

 }

 document.getElementById("rdvCard").innerHTML += `
 <div style="margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:15px">

 <strong>Réf :</strong> ${item.ref}<br><br>

 Date <input id="rdvDate_${item.ref}" type="date"><br><br>
 Heure <input id="rdvHeure_${item.ref}" type="time"><br><br>
 Camion <input id="rdvCamion_${item.ref}"><br><br>

 <button class="btnPrimary" onclick="saveRDV('${item.ref}')">
 Confirmer RDV
 </button>

 </div>
 `;

}



/* ================= SAVE RDV ================= */

function saveRDV(ref){

 let rdvs = JSON.parse(localStorage.getItem("rdvs")) || [];

 rdvs.push({
   ref:ref,
   date:document.getElementById("rdvDate_"+ref).value,
   heure:document.getElementById("rdvHeure_"+ref).value,
   camion:document.getElementById("rdvCamion_"+ref).value
 });

 localStorage.setItem("rdvs", JSON.stringify(rdvs));

 alert("RDV confirmé");

}
