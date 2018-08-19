const { io } = require('../server');

const Usuarios = require('../clases/usuarios')
const { crearMensaje } = require('../utils/utils')

const usuarios = new Usuarios()

io.on('connection', (client) => {

    console.log('CONECTADO USUARIO', client.id);

    client.on('entrarChat', (data, callback) => {
        
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }

        client.join(data.sala)

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala)

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala))
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió`))
    
        callback(personas)
    })

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id)

        let msj = crearMensaje(persona.nombre, data.mensaje)

        client.broadcast.to(data.sala).emit('crearMensaje', msj)
    
        callback(msj)
    })

    client.on('disconnect', () => {

        let persona = usuarios.borrarPersona(client.id)

        client.broadcast.to(persona.sala).emit('crearMensaje', crearMensaje('Administrador', `${persona.nombre} salió`))
        client.broadcast.to(persona.sala).emit('listaPersonas', usuarios.getPersonasPorSala(persona.sala))
    })

    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })
})