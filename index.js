let btnSearchIp=document.getElementById('btnSearchIp');

let dataIp=document.getElementById('dataIp');
let dataLocation=document.getElementById('dataLocation');
let dataTime=document.getElementById('dataTime');
let dataISP=document.getElementById('dataISP');

let lat=34.04915 ;
let lng =-118.09462;
function viewMap(){
    var coord = {lat:lat ,lng: lng};
    var map = new google.maps.Map(document.getElementById('map'),{
      zoom: 14,
      center: coord,
      disableDefaultUI: true,
      /*panControl:true,
      zoomControl:true,
      mapTypeControl:true,
      scaleControl:true,
      streetViewControl:true,
      overviewMapControl:true,
      rotateControl:true 
      */
    });
    var marker = new google.maps.Marker({
      position: coord,
      map: map,
      icon:'images/icon-location.svg',
    });
}
btnSearchIp.addEventListener('click',()=>{
  let inputIp=document.getElementById('inputIp');
  var isValid = isValidIP(inputIp.value);
  if(isValid){
    const xhttp=new XMLHttpRequest();
    xhttp.open('GET',`https://geo.ipify.org/api/v1?apiKey=at_7GtudJlRcXYBe46vflmvred5Cfcqg&ipAddress=${inputIp.value}`, true);
    xhttp.send();
    xhttp.onreadystatechange=function(){
      if (this.readyState==4 && this.status==200) {
        let datos=JSON.parse(this.responseText);

        /* Ver en el mapa */
        updatemap(datos.location.lat,datos.location.lng);
        /* Pintar los datos */
        dataIp.textContent=datos.ip;
        dataLocation.textContent=datos.location.city+", "+datos.location.region;
        console.log(datos);
        dataTime.textContent=datos.location.timezone;
        dataISP.textContent=datos.isp;
      } 
    };
  }else{
    alert('Direccion ip invalida')
  }
  
});
function updatemap(lt,lg){
  lat=lt;
  lng =lg;
  viewMap()
}

function isValidIP(ip) {
  let verdad = ip.split('.');
  if(verdad.length != 4)
    return false;
  for(i in verdad){
    if(!/^\d+$/g.test(verdad[i])
    ||+verdad[i]>255
    ||+verdad[i]<0
    ||/^[0][0-9]{1,2}/.test(verdad[i]))
      return false;
  }
  return true
}