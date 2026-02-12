window.onload = function(){

 let data = JSON.parse(localStorage.getItem("bonReceptionWMS")) || [];

 if(data.length === 0){
  document.getElementById("wmsDoc").innerHTML = "Aucune donnée";
  return;
 }

 let html = `

<div class="wmsDocument">

<!-- HEADER -->
<div class="wmsHeader">
 <img src="logo_oaca.jpg" class="wmsLogo" style="width:130px;height:auto;">

 <div>
   <h3>OACA</h3>
   <p>Office de l’Aviation Civile et des Aéroports</p>
   <p>Zone Cargo Aéroport</p>
   <p>Email: contact@infobridge.oaca.com</p>
 </div>
</div>

<!-- TITRE -->
<div class="wmsTitle">
 BON DE RÉCEPTION WMS
</div>

<!-- INFOS -->
<div class="wmsInfoGrid">

 <div>
   <p><strong>N° :</strong> BR-${Date.now()}</p>
   <p><strong>Date :</strong> ${new Date().toLocaleDateString()}</p>
   <p><strong>Heure :</strong> ${new Date().toLocaleTimeString()}</p>
   <p><strong>Entrepôt :</strong> Warehouse A</p>
 </div>

 <div>
   <p><strong>Fournisseur :</strong> Tunisair Cargo</p>
   <p><strong>Provenance :</strong> CDG - Paris</p>
   <p><strong>N° BL :</strong> BL-45872</p>
   <p><strong>Vol :</strong> TU722</p>
 </div>

</div>

<!-- TABLE -->
<table class="wmsTable">

<tr>
 <th>Réf</th>
 <th>Article</th>
 <th>Qté BL</th>
 <th>Qté Reçue</th>
 <th>Qté Endommagée</th>
 <th>Etat</th>
 <th>Conforme</th>
</tr>
`;

 data.forEach(item => {

  html += `
  <tr>
   <td>${item.ref || "-"}</td>
   <td>${item.article}</td>
   <td>${item.qteBL}</td>
   <td>${item.qteRecue}</td>
   <td>${item.qteEndommagee}</td>
   <td>${item.etat}</td>
   <td>${item.conforme}</td>
  </tr>
  `;

 });

 html += `
</table>

<!-- FOOTER -->
<div class="wmsFooter">

 <div>
   <p><strong>Observations :</strong></p>
   <div class="signatureBox"></div>
 </div>

 <div>
   <p><strong>Réceptionné par :</strong> __________</p>
   <p><strong>Date réception :</strong> ${new Date().toLocaleDateString()}</p>
   <div class="signatureBox"></div>
 </div>

</div>

</div>
`;

 document.getElementById("wmsDoc").innerHTML = html;

}


// ========================
// ENVOI VERS WMS
// ========================

function sendToWMS(){

 let data = JSON.parse(localStorage.getItem("bonReceptionWMS")) || [];

 if(data.length === 0){
   alert("Aucune donnée à envoyer");
   return;
 }

 alert("Bon envoyé vers WMS ✅");

}
