import { Application, Router } from 'https://deno.land/x/oak@v14.1.1/mod.ts'
import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts'
import { Server } from 'https://deno.land/x/socket_io@0.2.0/mod.ts'

const app = new Application()
app.use(oakCors({ origin: '*' }))

app.use((ctx) => {
  ctx.response.body = 'Hello World!'
})

const io = new Server({ cors: { origin: '*' } })

interface CharacterProperties {
  id: string
  position: number[]
  hairColor: string
  shirtColor: string
  pantsColor: string
}

const characters: CharacterProperties[] = []

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3]
}

const generateRandomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

io.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected`)

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    shirtColor: generateRandomHexColor(),
    pantsColor: generateRandomHexColor()
  })

  socket.on('move', (position) => {
    const character = characters.find((character) => character.id === socket.id)
    character.position = position
    io.emit('characters', characters)
  })

  socket.emit('hello', 'world')

  io.emit('characters', characters)

  socket.on('disconnect', (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`)

    characters.splice(
      characters.findIndex((characters) => characters.id === socket.id),
      1
    )

    io.emit('characters', characters)
  })
})

const handle = io.handler(async (req) => {
  return (await app.handle(req)) || new Response(null, { status: 404 })
})

Deno.serve({
  port: 8000,
  handler: handle
})
