let btnSearchIp=document.getElementById('btnSearchIp');

let dataIp=document.getElementById('dataIp');
let dataLocation=document.getElementById('dataLocation');
let dataTime=document.getElementById('dataTime');
let dataISP=document.getElementById('dataISP');

let lat = 34.04915 ;
let lng =-118.09462;

/* Obtener la ip del cliente */
async function getIpClient(update) {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    console.log(response);
    viewMapByIp(response.data.ip, update)
  } catch (error) {
    console.error(error);
  }
}
getIpClient(false);


function getLocation(){
  /* Obtener coordenadas del cliente */
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      updatemap(lat,lng)
    },err => {
      getIpClient(true);
    });
  }
}
getLocation();


/* Ver el mapa */
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
  viewMapByIp(inputIp.value,true)
});

/* Funcion para ver el mapa por ip que pasemos */
function viewMapByIp(ip, update){
  var isValid = isValidIP(ip);
  if(isValid){
    const xhttp=new XMLHttpRequest();
    xhttp.open('GET',`https://geo.ipify.org/api/v1?apiKey=at_7GtudJlRcXYBe46vflmvred5Cfcqg&ipAddress=${ip}`, true);
    xhttp.send();
    xhttp.onreadystatechange=function(){
      if (this.readyState==4 && this.status==200) {
        let datos=JSON.parse(this.responseText);

        /* Actualizar el mapa */
        if (update){
          updatemap(datos.location.lat,datos.location.lng);
        }
        

        viewData(datos);
      } 
    };
  }else{
    alert('Direccion ip invalida')
  }
}


/* Pintar los datos */
function viewData(datos){
  dataIp.textContent=datos.ip;
  dataLocation.textContent=datos.location.city+", "+datos.location.region;
  console.log(datos);
  dataTime.textContent=datos.location.timezone;
  dataISP.textContent=datos.isp;
}

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