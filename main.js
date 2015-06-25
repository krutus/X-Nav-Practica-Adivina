    
    var nombre = "";
    var datos = "";
    var coordenadasPulsadas = "";
    var coordenadas1 = "";
    var dificultad = 3500;
    var dificultad_Selecc = "Principiante";
	var nombre_juego = "juegos/Capitales";
    var cambiosHistorial = 0;
	var Lugar = "";
	var num_fotos = 0;
	var score = 0;
	var num_hist = 0;
    
    
    //funcion que prepara la pantalla para cualquier juego (en todos se hace esto)
    function InitPantalla() {
        
        $("#comienzo").hide();
        $("#score").hide();
		$("#nuevo").show();
        $("#fotos").show();
		$("#jugar").hide();
        $("#respuesta").show();
        $("#parar").show();
        $("#seleccDif").hide();
        $("#Juegos").hide();  
        $("#ultimosJuegos").hide();  
    };
    
    function getDatos(nombre_fichero, features) {
	var json = null;
	var url = nombre_fichero + ".json";
	console.log(url);

	json = $.ajax({
	        'async': false,
	        'global': false,
	        'url': url,
	        'dataType': "json",
	        'success': function (data) {
	        	json = data;	        	
	        }
	    });

	if(json.status === 404){
		console.log("no lo encuentra");
		return null;
	}else if(features === true){
		console.log("devuelvo features");
		aux = json.responseJSON;
		localStorage.setItem(nombre_fichero, JSON.stringify(aux)); //guardo en local		
		aux = json.responseJSON.features;
		console.log(aux);
		return aux;
	}else{
		console.log("devuelvo objeto entero");
		aux = json.responseJSON;
		localStorage.setItem(nombre_fichero, JSON.stringify(aux)); //guardo en local
		console.log(aux);
		return json.responseJSON;
	}
}

	function iniciarJuego(map, datos, dificultad) {
		
		Lugar = LugarAleatorio(datos);
		nombre = Lugar.properties.name;
		coordenadas1 = Lugar.geometry.coordinates;	
		console.log(coordenadas1);
		console.log(nombre);
		fotos = getFotos(nombre, num_fotos);
		num_fotos = 1;
		mostrar = setInterval(function() {
			console.log("otra jugada");		
			console.log(nombre);
			fotos = getFotos(nombre, num_fotos);
			nombre = Lugar.properties.name;
			coordenadas1 = Lugar.geometry.coordinates;
			num_fotos ++;
		}, dificultad);

	}

	function LugarAleatorio(datos) {
		num_aleat =  getRandomInt(0, datos.length);
		return datos[num_aleat];
	}

	function getFotos(name,n) {
		var urlFlicker = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + name + "+city&tagmode=any&format=json&jsoncallback=?";
		console.log(name)
		var fotos = $.getJSON( urlFlicker, {
			tags: name,
			tagmode: "any",
			format: "json"
		});
		$("#fotos").empty();
		if (n < 20){
		    fotos.done(function(data) {	
			    console.log("Una Foto de " + name);	
			    console.log(n)
			    foto = data.items[n];
		        $( "<img id='mostrarimagen'>" ).attr( "src", foto.media.m ).appendTo( "#fotos" );
		    }); 
		}else{
			console.log("fin del tiempo");
		    terminar();
		}   
	}
    

    function terminar(){
        $("#respuesta").hide();
        $("#score").show();
        $("#parar").hide();
        $("#nuevo").hide();
		$("#jugar").show();
        $("#seleccDif").hide();
        $("#Juegos").hide();
        $("#dificultad").hide();
        $("#ultimosJuegos").hide();
		$("#fotos").hide;
		$("#fotos").empty();
		clearInterval(mostrar);
    	clearTimeout(mostrar);
		alert("Se te ha acabado el tiempo");
		num_fotos = 0;
		dificultad= 3500;
		nombre_juego = "juegos/Capitales";
        coordenadasPulsadas = "";
        coordenadasJuego = "";
        document.getElementById("distancia").innerHTML = "No has seleccionado ningún punto";
        document.getElementById("lugar").innerHTML = nombre;
        document.getElementById("puntos").innerHTML =  "No has seleccionado ningún punto";           
    }
    
    //funcion que calcula la distancia en km entre dos puntos dando las coordenadas
    function dist(lat1, lon1, lat2, lon2){
        rad = function(x) {return x*Math.PI/180;}

        var R     = 6378.137;                         
        var dLat  = rad( lat2 - lat1 );
        var dLong = rad( lon2 - lon1 );

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;

        return d.toFixed(3);                     
    };
      
	function getRandomInt(min, max) {
  		return Math.floor(Math.random() * (max - min) + min);
	}  
    
    //Funcion que me recorre el historial y me guarda las ultimas partidas jugadas
    function bucleGuardaUltimas(){
        numgo = 0;
        $("#history").html("");
        console.log(cambiosHistorial);
        for (i=1; i<cambiosHistorial;  i++){
                numgo++;
                history.go(-1);
        }
        
        history.go(cambiosHistorial-1);    
    };
                                                                                                             
jQuery(document).ready(function() {
    
    $("#s").hide();
    $("#respuesta").hide();
    $("#score").hide();
    $("#parar").hide();
    $("#nuevo").hide();
  
    //Inicio el mapa
    var map = L.map('map');
    
    map.setView([40.2838, -3.8215], 2);
    
    L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    var popup = L.popup();
    function onMapClick(e) {
        popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
        coordenadasPulsadas = e.latlng.toString();
    }
    map.on('click', onMapClick);
    //------------------------------------------------------------------------------------------------------------>

	//Pulsan el boton jugar
    $("#jugar").click(function(){	
		InitPantalla()
		datos = getDatos(nombre_juego, true);
    	iniciarJuego(map, datos, dificultad);
    });    
    
    //Me pulsan el boton de parar juego a medias de estar jugando
    $("#parar").click(function(){
        alert("HAS ABANDONADO EL JUEGO");
		$("#respuesta").hide();
       	$("#score").hide();
        $("#parar").hide();
        $("#nuevo").hide();
		$("#jugar").show();
        $("#seleccDif").show();
        $("#Juegos").show();
        $("#dificultad").show();
        $("#ultimosJuegos").show();
		$("#fotos").empty();
		$("#fotos").hide();
        clearInterval(mostrar);
    	clearTimeout(mostrar);
        num_fotos = 0;
		dificultad= 3500;
		nombre_juego = "juegos/Capitales";
        coordenadasPulsadas = "";
        coordenadasJuego = "";
        
        
    });
    
    //Despues de pinchar la respuesta en el mapa me pinchan al boton de responder la adivinanza
    $("#respuesta").click(function(){
        
        if(coordenadasPulsadas === ""){
            alert ("Pulsa primero el sitio sobre el mapa");
        
        }else{
            //preparo lo que se va a ver en la pantalla
            $("#respuesta").hide();
            $("#score").show();
            $("#parar").hide();
            $("#nuevo").hide();
			$("#jugar").show();
            $("#seleccDif").show();
            $("#Juegos").show();
            $("#dificultad").show();
            $("#ultimosJuegos").hide();
			$("#fotos").empty();
			$("#fotos").hide();
            clearInterval(mostrar);
			console.log("RESOLVIENDO")
			console.log(nombre)
        	clearTimeout(mostrar);
            //Preparo y saco las coordenadas que me han pulsado en numero.
            var str = coordenadasPulsadas.split("(");
            str = str[1].split(")");
            str = str[0].split(", ");
            var latitud2 = parseInt(str[0]);//latitud que han pulsado
            var longitud2 = parseInt(str[1]);//longitud que han pulsado
            
            //Preparo y saco en numero las coordenadas que tenia el juego guardadas del sitio 
			var latitud1 = parseInt(coordenadas1[0])
			var longitud1 = parseInt(coordenadas1[1])
                       
			console.log(latitud1)
			console.log(latitud2)
			console.log(longitud1)
			console.log(longitud2)
            //calculo la distancia entre los dos puntos
            var distancia = dist(latitud1, longitud1, latitud2, longitud2);   //Retorna numero en Km
            console.log(num_fotos + " fotos");
            console.log(distancia)
            if (distancia == 0) {
                alert("ACERTASTE")
            }else{
                alert("FALLASTE")
            }
			score = distancia * num_fotos;
            console.log(score + " puntos")

            
            //Meto en el html la distancia y score
            document.getElementById("distancia").innerHTML = distancia + " Km";
            document.getElementById("lugar").innerHTML = nombre;
            document.getElementById("puntos").innerHTML = score + " puntos";        
            num_fotos = 0;
            coordenadasPulsadas = "";
            coordenadasJuego = "";       
        }                                          
    });
    
    
    //Cuando me pinchan en el boton de ir a un Juego Nuevo
    $("#nuevo").click(function(){
		clearInterval(mostrar);
    	clearTimeout(mostrar);
		$("#fotos").hide;
        num_fotos = 0;
        InitPantalla()
    	iniciarJuego(map, datos, dificultad);
    });
    
    
    //Elección de dificultad
    $("#dif1").click(function(){
        dificultad = 3500; 
        document.getElementById("dificultad").innerHTML = "PRINCIPIANTE";
        dificultad_Selecc = "Principiante";
		console.log(dificultad_Selecc);
    });
    $("#dif2").click(function(){
        dificultad = 3000;
        document.getElementById("dificultad").innerHTML = "NORMAL";
  		dificultad_Selecc = "Normal";
		console.log(dificultad_Selecc);
    });
    $("#dif3").click(function(){
        dificultad = 2000; 
        document.getElementById("dificultad").innerHTML = "PROFESIONAL"; 
        dificultad_Selecc = "Profesional";
		console.log(dificultad_Selecc);
    });

	
	//Elección de juego
    $("#game1").click(function(){
        document.getElementById("game").innerHTML = "Capitales";
        nombre_juego = "juegos/Capitales";
		console.log(nombre_juego);
    });
    $("#game2").click(function(){
        document.getElementById("game").innerHTML = "Monumentos";
  		nombre_juego = "juegos/Monumentos";
		console.log(nombre_juego);
    });       
});    
       
    
