var socket = io();

var params = new URLSearchParams(window.location.search)

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor')

    socket.emit('entrarChat', usuario, function(res){
        console.log('Usuarios conectados ', res)
    })
})

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor')
})

// Escuchar información
socket.on('crearMensaje', function(mensaje){
    console.log(mensaje);
})

socket.on('listaPersonas', function(mensaje){
    console.log(mensaje)
})

socket.on('mensajePrivado', function(mensaje){    
    console.log('Mensaje Privado: ', mensaje);
})