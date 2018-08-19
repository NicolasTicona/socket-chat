const { io } = require('../server');

const Usuarios = require('../clases/usuarios')
const { crearMensaje } = require('../utils/utils')

const usuarios = new Usuarios()

io.on('connection', (client) => {

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
    
        callback(personas)
    })

    client.on('crearMensaje', (data) => {
        
        let persona = usuarios.getPersona(client.id)

        let msj = crearMensaje(persona.nombre, data.mensaje)

        client.broadcast.to(persona.sala).emit('crearMensaje', msj)
    })

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id)

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala())
    })

    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })
})