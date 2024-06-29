import { Application } from 'https://deno.land/x/oak@v14.1.1/mod.ts'
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
  name: string
  position: number[]
  hairColor: string
  shirtColor: string
  pantsColor: string
}

const characters: CharacterProperties[] = []

const items = {
  table: {
    name: 'Table',
    size: [4, 7]
  },
  armChair: {
    name: 'ArmChair',
    size: [4, 4]
  },
  grill: {
    name: 'Grill',
    size: [4, 4]
  },
  bookShelf: {
    name: 'BookShelf',
    size: [2, 4]
  }
}

const map = {
  size: [20, 20],
  gridDivision: 2,
  items: [
    {
      ...items.armChair,
      gridPosition: [5, 2]
    },
    {
      ...items.armChair,
      gridPosition: [2, 8],
      rotation: 1
    },
    {
      ...items.bookShelf,
      gridPosition: [1, 1],
      rotation: 1
    },
    {
      ...items.table,
      gridPosition: [10, 8]
    },
    {
      ...items.grill,
      gridPosition: [20, 20],
      rotation: 1
    }
  ]
}

const generateRandomPosition = () => {
  return [Math.random() * map.size[0], 0, Math.random() * map.size[1]]
}

function generateRandomHexColor() {
  let hex = '#'
  const characters = '0123456789ABCDEF'
  for (let i = 0; i < 6; i++) {
    hex += characters[Math.floor(Math.random() * 16)]
  }
  return hex
}

function generateRandomName() {
  const prefixes = [
    'Alex',
    'Chris',
    'Jordan',
    'Taylor',
    'Morgan',
    'Sam',
    'Jamie',
    'Casey',
    'Robin',
    'Avery'
  ]
  const suffixes = [
    'Smith',
    'Johnson',
    'Williams',
    'Jones',
    'Brown',
    'Davis',
    'Miller',
    'Wilson',
    'Moore',
    'Taylor'
  ]

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]

  return `${prefix} ${suffix}`
}

io.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected`)

  characters.push({
    id: socket.id,
    name: generateRandomName(),
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    shirtColor: generateRandomHexColor(),
    pantsColor: generateRandomHexColor()
  })

  socket.on('move', (position) => {
    const character = characters.find((character) => character.id === socket.id)

    if (!character) return
    character.position = position
    io.emit('characters', characters)
  })

  socket.emit('hello', {
    map,
    characters,
    id: socket.id,
    items
  })

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
