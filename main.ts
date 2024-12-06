import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts'
import { Application } from 'https://deno.land/x/oak@v14.1.1/mod.ts'
import { Server } from 'https://deno.land/x/socket_io@0.2.0/mod.ts'
import pathfinding from 'npm:pathfinding'

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
  path: any
  hairColor: string
  shirtColor: string
  pantsColor: string
}

const characters: CharacterProperties[] = []

interface CharacterPropertiesFP {
  id: string
  name: string
  position: number[]
}

const charactersFP: CharacterPropertiesFP[] = []

interface Item {
  name: string
  size: [number, number]
  scale?: number
  wall?: boolean
  walkable?: boolean
  overlap?: boolean
}

interface Items {
  [key: string]: Item
}

interface PositionedItem extends Item {
  gridPosition: [number, number]
  rotation?: number
}

interface Weapon {
  name: string
  size: [number, number]
}

interface Dummy {
  name: string
  size: number
}

interface Weapons {
  [key: string]: Weapon
}

interface Dummies {
  [key: string]: Dummy
}

interface PositionedWeapon extends Weapon {
  position: [number, number, number]
  rotation?: number
}

interface PositionedDummy extends Dummy {
  position: [number, number, number]
  rotation?: number
  animationDummy?: string
}

interface Map {
  size: [number, number]
  gridDivision: number
  items: PositionedItem[]
  weapons: PositionedWeapon[]
  dummies: PositionedDummy[]
}

const dummies: Dummies = {
  man: {
    name: 'man',
    size: 0.5
  }
}

const weapons: Weapons = {
  assaultRifle: {
    name: 'assaultRifle',
    size: [0.5, 0.5]
  },
  revolver: {
    name: 'revolver',
    size: [0.5, 0.5]
  },
  shotgun: {
    name: 'shotgun',
    size: [0.5, 0.5]
  },
  kitchenKnife: {
    name: 'kitchenKnife',
    size: [0.5, 0.5]
  }
}

const items: Items = {
  washer: {
    name: 'washer',
    size: [2, 2]
  },
  toiletSquare: {
    name: 'toiletSquare',
    size: [2, 2]
  },
  trashcan: {
    name: 'trashcan',
    size: [1, 1]
  },
  bathroomCabinetDrawer: {
    name: 'bathroomCabinetDrawer',
    size: [2, 2]
  },
  bathtub: {
    name: 'bathtub',
    size: [4, 2]
  },
  bathroomMirror: {
    name: 'bathroomMirror',
    size: [2, 1],
    wall: true
  },
  bathroomCabinet: {
    name: 'bathroomCabinet',
    size: [2, 1],
    wall: true
  },
  bathroomSink: {
    name: 'bathroomSink',
    size: [2, 2]
  },
  showerRound: {
    name: 'showerRound',
    size: [2, 2]
  },
  tableCoffee: {
    name: 'tableCoffee',
    size: [4, 2]
  },
  loungeSofaCorner: {
    name: 'loungeSofaCorner',
    size: [5, 5]
  },
  bear: {
    name: 'bear',
    size: [2, 1],
    wall: true
  },
  loungeSofaOttoman: {
    name: 'loungeSofaOttoman',
    size: [2, 2]
  },
  tableCoffeeGlassSquare: {
    name: 'tableCoffeeGlassSquare',
    size: [2, 2]
  },
  loungeDesignSofaCorner: {
    name: 'loungeDesignSofaCorner',
    size: [5, 5]
  },
  loungeDesignSofa: {
    name: 'loungeDesignSofa',
    size: [5, 2]
  },
  loungeSofa: {
    name: 'loungeSofa',
    size: [5, 2]
  },
  bookcaseOpenLow: {
    name: 'bookcaseOpenLow',
    size: [2, 1]
  },
  kitchenBar: {
    name: 'kitchenBar',
    size: [2, 1]
  },
  bookcaseClosedWide: {
    name: 'bookcaseClosedWide',
    size: [3, 1]
  },
  bedSingle: {
    name: 'bedSingle',
    size: [3, 5]
  },
  bench: {
    name: 'bench',
    size: [2, 1]
  },
  bedDouble: {
    name: 'bedDouble',
    size: [5, 5]
  },
  benchCushionLow: {
    name: 'benchCushionLow',
    size: [2, 1]
  },
  loungeChair: {
    name: 'loungeChair',
    size: [2, 2]
  },
  cabinetBedDrawer: {
    name: 'cabinetBedDrawer',
    size: [1, 1]
  },
  cabinetBedDrawerTable: {
    name: 'cabinetBedDrawerTable',
    size: [1, 1]
  },
  table: {
    name: 'table',
    size: [4, 2]
  },
  tableCrossCloth: {
    name: 'tableCrossCloth',
    size: [4, 2]
  },
  plant: {
    name: 'plant',
    size: [1, 1]
  },
  plantSmall: {
    name: 'plantSmall',
    size: [1, 1]
  },
  rugRounded: {
    name: 'rugRounded',
    size: [6, 4],
    walkable: true
  },
  rugRound: {
    name: 'rugRound',
    size: [4, 4],
    walkable: true
  },
  rugSquare: {
    name: 'rugSquare',
    size: [4, 4],
    walkable: true
  },
  rugRectangle: {
    name: 'rugRectangle',
    size: [8, 4],
    walkable: true
  },
  televisionVintage: {
    name: 'televisionVintage',
    size: [4, 2]
  },
  televisionModern: {
    name: 'televisionModern',
    size: [4, 2]
  },
  kitchenCabinetCornerRound: {
    name: 'kitchenCabinetCornerRound',
    size: [2, 2]
  },
  kitchenCabinetCornerInner: {
    name: 'kitchenCabinetCornerInner',
    size: [2, 2]
  },
  kitchenCabinet: {
    name: 'kitchenCabinet',
    size: [2, 2]
  },
  kitchenBlender: {
    name: 'kitchenBlender',
    size: [1, 1]
  },
  dryer: {
    name: 'dryer',
    size: [2, 2]
  },
  chairCushion: {
    name: 'chairCushion',
    size: [1, 1]
  },
  chair: {
    name: 'chair',
    size: [1, 1]
  },
  deskComputer: {
    name: 'deskComputer',
    size: [3, 2]
  },
  desk: {
    name: 'desk',
    size: [3, 2]
  },
  chairModernCushion: {
    name: 'chairModernCushion',
    size: [1, 1]
  },
  chairModernFrameCushion: {
    name: 'chairModernFrameCushion',
    size: [1, 1]
  },
  kitchenMicrowave: {
    name: 'kitchenMicrowave',
    size: [1, 1]
  },
  coatRackStanding: {
    name: 'coatRackStanding',
    size: [1, 1]
  },
  kitchenSink: {
    name: 'kitchenSink',
    size: [2, 2]
  },
  lampRoundFloor: {
    name: 'lampRoundFloor',
    size: [1, 1]
  },
  lampRoundTable: {
    name: 'lampRoundTable',
    size: [1, 1]
  },
  lampSquareFloor: {
    name: 'lampSquareFloor',
    size: [1, 1]
  },
  lampSquareTable: {
    name: 'lampSquareTable',
    size: [1, 1]
  },
  toaster: {
    name: 'toaster',
    size: [1, 1]
  },
  kitchenStove: {
    name: 'kitchenStove',
    size: [2, 2]
  },
  laptop: {
    name: 'laptop',
    size: [1, 1]
  },
  radio: {
    name: 'radio',
    size: [1, 1]
  },
  speaker: {
    name: 'speaker',
    size: [1, 1]
  },
  speakerSmall: {
    name: 'speakerSmall',
    size: [1, 1]
  },
  stoolBar: {
    name: 'stoolBar',
    size: [1, 1]
  },
  stoolBarSquare: {
    name: 'stoolBarSquare',
    size: [1, 1]
  },
  carSUV: {
    name: 'carSUV',
    size: [4, 8]
  },
  wall: {
    name: 'wall',
    size: [1, 4]
  },
  bloodsplat: {
    name: 'bloodSplat',
    size: [1, 1]
  },
  streetStraight: {
    name: 'streetStraight',
    size: [16, 16],
    wall: true,
    overlap: true
  },
  evidenceMarker1: {
    name: 'evidenceMarker1',
    size: [1, 1],
    wall: true
  },
  evidenceMarker2: {
    name: 'evidenceMarker2',
    size: [1, 1],
    wall: true
  },
  evidenceMarker3: {
    name: 'evidenceMarker3',
    size: [1, 1],
    wall: true
  },
  evidenceMarker4: {
    name: 'evidenceMarker4',
    size: [1, 1],
    wall: true
  },
  evidenceMarker5: {
    name: 'evidenceMarker5',
    size: [1, 1],
    wall: true
  },
  evidenceMarker6: {
    name: 'evidenceMarker6',
    size: [1, 1],
    wall: true
  },
  evidenceMarker7: {
    name: 'evidenceMarker7',
    size: [1, 1],
    wall: true
  },
  evidenceMarker8: {
    name: 'evidenceMarker8',
    size: [1, 1],
    wall: true
  },
  evidenceMarker9: {
    name: 'evidenceMarker9',
    size: [1, 1],
    wall: true
  }
}

const map: Map = {
  size: [50, 50],
  gridDivision: 2,
  items: [
    {
      ...items.showerRound,
      gridPosition: [0, 0]
    },
    {
      ...items.toiletSquare,
      gridPosition: [0, 3],
      rotation: 1
    },
    {
      ...items.washer,
      gridPosition: [5, 0]
    },
    {
      ...items.bathroomSink,
      gridPosition: [7, 0]
    },
    {
      ...items.trashcan,
      gridPosition: [0, 5],
      rotation: 1
    },
    {
      ...items.bathroomCabinetDrawer,
      gridPosition: [3, 0]
    },
    {
      ...items.bathtub,
      gridPosition: [4, 4]
    },
    {
      ...items.bathtub,
      gridPosition: [0, 8],
      rotation: 3
    },
    {
      ...items.bathroomCabinet,
      gridPosition: [3, 0]
    },
    {
      ...items.bathroomMirror,
      gridPosition: [0, 8],
      rotation: 1
    },
    {
      ...items.bathroomMirror,
      gridPosition: [0, 10],
      rotation: 1
    },
    {
      ...items.tableCoffee,
      gridPosition: [10, 8]
    },
    {
      ...items.rugRectangle,
      gridPosition: [8, 7]
    },
    {
      ...items.loungeSofaCorner,
      gridPosition: [6, 10]
    },
    {
      ...items.bear,
      gridPosition: [0, 3],
      rotation: 1
    },
    {
      ...items.plant,
      gridPosition: [11, 13]
    },
    {
      ...items.cabinetBedDrawerTable,
      gridPosition: [13, 19]
    },
    {
      ...items.cabinetBedDrawer,
      gridPosition: [19, 19]
    },
    {
      ...items.bedDouble,
      gridPosition: [14, 15]
    },
    {
      ...items.bookcaseClosedWide,
      gridPosition: [12, 0],
      rotation: 2
    },
    {
      ...items.speaker,
      gridPosition: [11, 0]
    },
    {
      ...items.speakerSmall,
      gridPosition: [15, 0]
    },
    {
      ...items.loungeChair,
      gridPosition: [10, 4]
    },
    {
      ...items.loungeSofaOttoman,
      gridPosition: [14, 4]
    },
    {
      ...items.loungeDesignSofa,
      gridPosition: [18, 0],
      rotation: 1
    },
    {
      ...items.kitchenCabinetCornerRound,
      gridPosition: [2, 18],
      rotation: 2
    },
    {
      ...items.kitchenCabinetCornerInner,
      gridPosition: [0, 18],
      rotation: 2
    },
    {
      ...items.kitchenStove,
      gridPosition: [0, 16],
      rotation: 1
    },
    {
      ...items.dryer,
      gridPosition: [0, 14],
      rotation: 1
    },
    {
      ...items.lampRoundFloor,
      gridPosition: [0, 12]
    },
    {
      ...items.carSUV,
      gridPosition: [30, 17]
    },
    {
      ...items.carSUV,
      gridPosition: [33, 9]
    },
    {
      ...items.wall,
      gridPosition: [0, 21],
      rotation: 1
    },
    {
      ...items.wall,
      gridPosition: [4, 21],
      rotation: 1
    },
    {
      ...items.bloodsplat,
      gridPosition: [1, 36],
      scale: 0.15
    },
    {
      ...items.bloodsplat,
      gridPosition: [3, 36],
      scale: 0.25
    },
    {
      ...items.bloodsplat,
      gridPosition: [6, 36],
      scale: 0.35
    },
    {
      ...items.bloodsplat,
      gridPosition: [10, 36],
      scale: 0.45
    },
    {
      ...items.streetStraight,
      gridPosition: [24, 24]
    },
    {
      ...items.streetStraight,
      gridPosition: [24, 8]
    },
    {
      ...items.evidenceMarker1,
      gridPosition: [1, 34]
    },
    {
      ...items.evidenceMarker2,
      gridPosition: [2, 34]
    },
    {
      ...items.evidenceMarker3,
      gridPosition: [3, 34]
    },
    {
      ...items.evidenceMarker4,
      gridPosition: [4, 34]
    },
    {
      ...items.evidenceMarker5,
      gridPosition: [5, 34]
    },
    {
      ...items.evidenceMarker6,
      gridPosition: [6, 34]
    },
    {
      ...items.evidenceMarker7,
      gridPosition: [7, 34]
    },
    {
      ...items.evidenceMarker8,
      gridPosition: [8, 34]
    },
    {
      ...items.evidenceMarker9,
      gridPosition: [9, 34]
    }
  ],
  weapons: [
    { ...weapons.assaultRifle, position: [1, 1, 20] },
    { ...weapons.revolver, position: [2, 1, 20] },
    { ...weapons.shotgun, position: [3, 1, 20] },
    { ...weapons.kitchenKnife, position: [6, 1, 20] }
  ],
  dummies: [
    {
      ...dummies.man,
      position: [0, 0, 0],
      animationDummy: 'HumanArmature|Man_Idle'
    }
  ]
}

const grid = new pathfinding.Grid(
  map.size[0] * map.gridDivision,
  map.size[1] * map.gridDivision
)

const finder = new pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true
})

const findPath = (start: any[], end: any[]) => {
  const gridClone = grid.clone()
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone)
  return path
}

const updateGrid = () => {
  for (let x = 0; x < map.size[0] * map.gridDivision; x++) {
    for (let y = 0; y < map.size[0] * map.gridDivision; y++) {
      grid.setWalkableAt(x, y, true)
    }
  }

  if (map.items === null) return
  map.items.forEach((item) => {
    if (item?.walkable || item?.wall || item?.overlap) {
      return
    }
    const width =
      item?.rotation === 1 || item?.rotation === 3 ? item.size[1] : item.size[0]
    const height =
      item?.rotation === 1 || item?.rotation === 3 ? item.size[0] : item.size[1]

    if (item.gridPosition[0] && item.gridPosition[1]) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          grid.setWalkableAt(
            item?.gridPosition[0] + x,
            item?.gridPosition[1] + y,
            false
          )
        }
      }
    }
  })
}

updateGrid()

const generateRandomPosition = () => {
  for (let i = 0; 1 < 100; i++) {
    const x = Math.floor(Math.random() * map.size[0] * map.gridDivision)
    const y = Math.floor(Math.random() * map.size[1] * map.gridDivision)

    if (grid.isWalkableAt(x, y)) {
      return [x, y]
    }
  }
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

  charactersFP.push({
    id: socket.id,
    name: generateRandomName(),
    position: generateRandomPosition()
  })

  io.emit('characters', characters)

  io.emit('charactersFP', charactersFP)

  socket.on('move', (from, to) => {
    const character = characters.find((character) => character.id === socket.id)

    const path = findPath(from, to)

    if (!path) return

    if (!character) return
    character.position = from
    character.path = path
    io.emit('playerMove', character)
  })

  socket.on('moveFP', (position) => {
    const characterFP = characters.find(
      (character) => character.id === socket.id
    )

    if (!characterFP) return
    console.log(characterFP)
    characterFP.position = position
    io.emit('playerMoveFP', characterFP)
  })

  socket.on('itemsUpdate', (items) => {
    if (items === null) return
    map.items = items
    /* characters.forEach((character) => {
      character.path = []
      character.position = generateRandomPosition()
    }) */
    updateGrid()
    io.emit('mapUpdate', {
      map,
      characters
    })
  })

  socket.on('weaponsUpdate', (weapons) => {
    if (weapons === null) return
    map.weapons = weapons
    updateGrid()
    io.emit('mapUpdate', {
      map
    })
  })

  socket.on('dummiesUpdate', (dummies) => {
    if (dummies === null) return
    map.dummies = dummies
    updateGrid()
    io.emit('mapUpdate', {
      map
    })
  })

  io.emit('hello', {
    map,
    characters,
    charactersFP,
    id: socket.id,
    items,
    weapons,
    dummies
  })

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
