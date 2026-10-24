export type AlbumPhoto = {
  author: string
  id: string
  uri: string
}

export type Album = {
  /** The cover's photographer. */
  author: string
  /** 16:10, the same URL on the card and on the album's page. */
  cover: string
  dates: string
  id: string
  photos: readonly AlbumPhoto[]
  place: string
  /** The album's text, a paragraph each. */
  story: readonly string[]
  title: string
}

const cover = (id: string) => `https://picsum.photos/id/${id}/1200/750`

const square = (id: string, author: string): AlbumPhoto => ({author, id, uri: `https://picsum.photos/id/${id}/600/600`})

/** Trips and themes, each a cover, a few paragraphs and four more photos. Enough of them for the list to recycle. */
export const ALBUMS: readonly Album[] = [
  {
    author: 'Annie Spratt',
    cover: cover('1052'),
    dates: '12 to 16 October',
    id: 'north-atlantic',
    photos: [
      square('1019', 'Patrick Fore'),
      square('1041', 'Tim Marshall'),
      square('1053', 'Anna Popović'),
      square('1049', 'Rosan Harmens'),
    ],
    place: 'Atlantic coast',
    story: [
      'We drove out at first light, when the beach was still a strip of black between the surf and the fog. The sea stacks appeared one at a time, darker than the sky behind them.',
      'By noon the wind had turned. Every wave came in at an angle and folded over itself in long green sheets, and we spent an hour on the rocks doing nothing but watching the water break.',
      'The last evening was calm. The tide went out far enough to leave a rock standing in its own reflection, and nobody said much on the drive back.',
    ],
    title: 'North Atlantic',
  },
  {
    author: 'Marcelo Quinan',
    cover: cover('1038'),
    dates: '3 to 9 April',
    id: 'fjords',
    photos: [
      square('1051', 'Ales Krivec'),
      square('1036', 'Wolfgang Lutz'),
      square('1045', 'Aleksandra Boguslawska'),
      square('1006', 'Vladimir Kudinov'),
    ],
    place: 'Western fjords',
    story: [
      'The ferry left before the sun had reached the snow on the peaks. From the deck the water looked black and the mountains looked painted on.',
      'We camped two nights on the ridge above the second fjord, the tents dug into the snow, and woke both mornings inside a cloud that took until noon to lift.',
      'On the way back we found an old wooden pier reaching into a lake so still that it doubled the mountains. We stayed until the light went.',
    ],
    title: 'Fjords by boat',
  },
  {
    author: 'Christian Joudrey',
    cover: cover('1043'),
    dates: '21 to 25 June',
    id: 'granite',
    photos: [
      square('1044', 'Steve Carter'),
      square('1037', 'Jordan McQueen'),
      square('1020', 'Adam Willoughby-Knox'),
      square('177', 'Danka & Peter'),
    ],
    place: 'High Sierra',
    story: [
      'The valley floor is all river and pine, and the walls go straight up from it. For the first day we kept stopping in the middle of the trail just to look up.',
      'On the third morning a bear crossed the path ahead of us, unhurried, and went on down to the water as if we were not there at all.',
      'We walked out over the pass in thick cloud, and when it tore open for a minute the whole range was below us, gold at the edges.',
    ],
    title: 'Granite and pines',
  },
  {
    author: 'Stefan Kunze',
    cover: cover('1057'),
    dates: '2 to 6 August',
    id: 'coast-road',
    photos: [
      square('1050', 'Joseph Barrientos'),
      square('1061', 'Rob Bye'),
      square('1056', 'Susanne Feldt'),
      square('1001', 'Danielle MacInnes'),
    ],
    place: 'Pacific coast',
    story: [
      'The road hangs on the cliffs for most of the way, with the ocean on one side and the hills on the other. We drove it slowly, and with the windows down.',
      'There is a cove below almost every bend. We climbed down to three of them, and in the last one the water was so clear that the rocks seemed to float.',
      'On the final day the sea and the sky were the same colour, and the horizon disappeared somewhere out past the kelp.',
    ],
    title: 'Coast road',
  },
  {
    author: 'Vadim Sherbakov',
    cover: cover('142'),
    dates: '14 to 19 May',
    id: 'old-towns',
    photos: [
      square('193', 'Vadim Sherbakov'),
      square('164', 'Linh Nguyen'),
      square('1065', 'Bertrand Zuchuat'),
      square('163', 'Linh Nguyen'),
    ],
    place: 'By train',
    story: [
      'Five towns in six days, each one an hour or two down the line from the last, with a castle, a canal or a cathedral waiting at the end of every walk from the station.',
      'The best afternoon was the least planned one: a narrow street that ended at the sea, and a café at the bottom of it with exactly one free table.',
      'We came home with sore feet, a bag of postcards nobody will send, and far too many photos of doorways.',
    ],
    title: 'Old towns',
  },
  {
    author: 'freddie marriage',
    cover: cover('1029'),
    dates: '8 to 10 November',
    id: 'city-weekend',
    photos: [
      square('1031', 'Mike Wilson'),
      square('1048', 'Anthony DELANOIX'),
      square('1047', 'sergee bee'),
      square('1078', 'Vladimir Kudinov'),
    ],
    place: 'Three days, one city',
    story: [
      'From the observation deck the park is a green rectangle cut into the grid, and the towers around it look like a fence someone built to keep it in.',
      'We spent most of Saturday looking up: glass, steel and a strip of sky between them. Our necks hurt by dinner.',
      'At night every window is its own small picture. We counted the lit ones on one floor of the building across the street, and lost count twice.',
    ],
    title: 'A weekend in the city',
  },
  {
    author: 'Annie Spratt',
    cover: cover('999'),
    dates: 'All winter',
    id: 'slow-mornings',
    photos: [
      square('998', 'Joanna Kosinska'),
      square('1068', 'Padurariu Alexandru'),
      square('1062', 'Matthew Wiebe'),
      square('1060', 'Karl Fredrickson'),
    ],
    place: 'At home',
    story: [
      'Breakfast on the big table, the good plates, and no phone until the coffee is finished. It became a rule in January and lasted until spring.',
      'The dog had his own version of it: under a blanket, on the warm side of the bed, refusing to come out until somebody brought him toast.',
      'This album is mostly crumbs, light through the kitchen window and letters we kept meaning to answer.',
    ],
    title: 'Slow mornings',
  },
  {
    author: 'jamie mink',
    cover: cover('1072'),
    dates: '27 to 29 September',
    id: 'old-cars',
    photos: [
      square('1071', 'Tim Stief'),
      square('1070', 'Sean Stratton'),
      square('111', 'Gabe Rodriguez'),
      square('133', 'Dietmar Becker'),
    ],
    place: 'Car show',
    story: [
      'A field full of chrome, and an old truck at the far end of it that nobody had polished in fifty years. It drew a bigger crowd than anything else there.',
      'The owners love to talk. One of them let us sit behind a wheel the size of a dinner plate and explained every dial on the dashboard, twice.',
      'On the way out we passed two coupes parked nose to nose in front of a yellow garage door, as if they had stopped there to have a chat.',
    ],
    title: 'Old cars',
  },
]

export const findAlbum = (id: string | undefined) => ALBUMS.find(entry => entry.id === id)

export const albumTitle = (id: string | undefined) => findAlbum(id)?.title ?? ''

/** The album's photographers, in the order they appear, each once. */
export const albumAuthors = (album: Album) => [...new Set([album.author, ...album.photos.map(photo => photo.author)])]

/** An album the example names by id: a missing one is a typo in the example, not a state to render. */
export const albumById = (id: string) => {
  const album = findAlbum(id)

  if (!album) {
    throw new Error(`No album "${id}"`)
  }

  return album
}
