  //Codigo JS practica final Luis Haro 

  
    var nombre = "";
    var datos = "";
    var coordenadasPulsadas = "";
    var coordenadas1 = "";
    var TiempoFoto = 3500;
    var dificultad_Selecc = "Principiante";
	var nombre_juego = "Capitales";
    var cambiosHistorial = 0;
	var Lugar = "";
	var num_fotos = 0;
	var score = 0;
	var num_hist = 0;
    
    
    function InitPantalla() {
        
        $("#comienzo").hide();
        $("#score").hide();
		$("#reiniciar").show();
        $("#fotos").show();
		$("#jugar").hide();
        $("#resolver").show();
        $("#parar").show();
        $("#seleccDif").hide();
        $("#Juegos").hide();  
        $("#ultimosJuegos").hide();  
    };
    
    function getDatos(nombre_fichero, features) {
		var json = null;
		var url = "juegos/" + nombre_fichero + ".json";
		json = $.ajax({
			    'async': false,
			    'global': false,
			    'url': url,
			    'dataType': "json",
			    'success': function (data) {
			    	json = data;	        	
			    }
			});
		if(features === true){		
			aux = json.responseJSON.features;
			return aux;
		}else{
			aux = json.responseJSON;
			return json.responseJSON;
		}
	}

	function iniciarJuego(map, datos, TiempoFoto) {
		Lugar = LugarAleatorio(datos);
		nombre = Lugar.properties.name;
		coordenadas1 = Lugar.geometry.coordinates;
		num_fotos = 1;
		fotos = getFotos(nombre, num_fotos);
		mostrar = setInterval(function() {
			fotos = getFotos(nombre, num_fotos);
			nombre = Lugar.properties.name;
			coordenadas1 = Lugar.geometry.coordinates;
			num_fotos ++;
		}, TiempoFoto);

	}

	function LugarAleatorio(datos) {
		num_aleat =  getRandomInt(0, datos.length);
		return datos[num_aleat];
	}

	function getFotos(name,n) {
		var urlFlicker = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + name + "+city&tagmode=any&format=json&jsoncallback=?";
		var fotos = $.getJSON( urlFlicker, {
			tags: name,
			tagmode: "any",
			format: "json"
		});
		$("#fotos").empty();
		if (n < 20){
		    fotos.done(function(data) {
			    foto = data.items[n];
		        $( "<img id='mostrarimagen'>" ).attr( "src", foto.media.m ).appendTo( "#fotos" );
		    }); 
		}else{
		    terminar();
		}   
	}
    

    function terminar(){
        $("#resolver").hide();
        $("#score").show();
        $("#parar").hide();
        $("#reiniciar").hide();
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
		TiempoFoto= 3500;
		nombre_juego = "Capitales";
        coordenadasPulsadas = "";
        coordenadasJuego = "";
        document.getElementById("distancia").innerHTML = "No has seleccionado ningún punto";
        document.getElementById("lugar").innerHTML = nombre;
        document.getElementById("puntos").innerHTML =  "No has seleccionado ningún punto";           
    }
    
    //Distancia entre coords
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
    
	function getFecha(){
		var f = new Date();
		fecha = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
		hora = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
		fecha = fecha + "//"+ hora;
		return fecha;
	}


	function addHistorial(juego_name, puntuacion) {	
		fecha = getFecha();
		var datosjuego = juego_name + " <> " + dificultad_Selecc + " <>" + puntuacion.toFixed(2) + " <> " + fecha;
		$("#history").append('<li>' + datosjuego +'</li>');
	}

                                                                                                             
jQuery(document).ready(function() {
    
    $("#s").hide();
    $("#resolver").hide();
    $("#score").hide();
    $("#parar").hide();
    $("#reiniciar").hide();
  
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


	//Boton jugar
    $("#jugar").click(function(){	
		InitPantalla()
		datos = getDatos(nombre_juego, true);
    	iniciarJuego(map, datos, TiempoFoto);
    });    
    
    //Boton parar
    $("#parar").click(function(){
        alert("HAS ABANDONADO EL JUEGO");
		$("#resolver").hide();
       	$("#score").hide();
        $("#parar").hide();
        $("#reiniciar").hide();
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
		TiempoFoto= 3500;
		nombre_juego = "Capitales";
        coordenadasPulsadas = "";
        coordenadasJuego = "";
    });
    
    //Boton resolver
    $("#resolver").click(function(){
        if(coordenadasPulsadas === ""){
            alert ("Pulsa primero el sitio sobre el mapa");
        }else{
            $("#resolver").hide();
            $("#score").show();
            $("#parar").hide();
            $("#reiniciar").hide();
			$("#jugar").show();
            $("#seleccDif").show();
            $("#Juegos").show();
            $("#dificultad").show();
            $("#ultimosJuegos").hide();
			$("#fotos").empty();
			$("#fotos").hide();
            clearInterval(mostrar);
        	clearTimeout(mostrar);

            var str = coordenadasPulsadas.split("(");
            str = str[1].split(")");
            str = str[0].split(", ");
            var latitud2 = parseInt(str[0]);
            var longitud2 = parseInt(str[1]); 
			var latitud1 = parseInt(coordenadas1[0])
			var longitud1 = parseInt(coordenadas1[1])
            
            var distancia = dist(latitud1, longitud1, latitud2, longitud2);   //Retorna numero en Km
            if (distancia == 0) {
                alert("ACERTASTE")
            }else{
                alert("FALLASTE")
            }
			score = distancia * num_fotos;
            document.getElementById("distancia").innerHTML = distancia + " Km";
            document.getElementById("lugar").innerHTML = nombre;
            document.getElementById("puntos").innerHTML = score + " puntos"; 

			addHistorial(nombre_juego, score);

            num_fotos = 0;
            coordenadasPulsadas = "";
            coordenadasJuego = "";       
        }                                          
    });
    
    
    //Boton reiniciar
    $("#reiniciar").click(function(){
		clearInterval(mostrar);
    	clearTimeout(mostrar);
		$("#fotos").hide;
        num_fotos = 0;
        InitPantalla()
    	iniciarJuego(map, datos, TiempoFoto);
    });
    
    
    //Elección de dificultad
    $("#dif1").click(function(){
        TiempoFoto = 3500; 
        document.getElementById("dificultad").innerHTML = "PRINCIPIANTE";
        dificultad_Selecc = "Principiante";
    });
    $("#dif2").click(function(){
        TiempoFoto = 3000;
        document.getElementById("dificultad").innerHTML = "NORMAL";
  		dificultad_Selecc = "Normal";
    });
    $("#dif3").click(function(){
        TiempoFoto = 2000; 
        document.getElementById("dificultad").innerHTML = "PROFESIONAL"; 
        dificultad_Selecc = "Profesional";
    });

	
	//Elección de juego
    $("#game1").click(function(){
        document.getElementById("game").innerHTML = "Capitales";
        nombre_juego = "Capitales";
    });
    $("#game2").click(function(){
        document.getElementById("game").innerHTML = "Monumentos";
  		nombre_juego = "Monumentos";
    });       
});    
       
    
