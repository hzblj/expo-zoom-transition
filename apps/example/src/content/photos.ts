export type Photo = {
  /** The photographer, on Unsplash (picsum.photos serves their photos). */
  author: string
  caption: string
  id: string
  title: string
  /** One URL per photo, at the size the page shows it: the grid, the page and the zoom all load the same cached image. */
  uri: string
}

const photo = (id: string, title: string, caption: string, author: string): Photo => ({
  author,
  caption,
  id,
  title,
  uri: `https://picsum.photos/id/${id}/900/1200`,
})

/** The gallery: portrait photos at a fixed id each, so every view shows the same picture. */
export const PHOTOS: readonly Photo[] = [
  photo('1015', 'Above the fjord', 'A blue fjord between granite walls, seen from the edge.', 'Alexey Topolyanskiy'),
  photo('1069', 'Jellyfish', 'Orange against open blue water.', 'Marat Gilyadzinov'),
  photo('1003', 'Fawn', 'Morning light between the beeches.', 'E+N Photographies'),
  photo('1035', 'Rainbow falls', 'Spray, a rainbow and one very small person.', 'Jared Erondu'),
  photo('1080', 'Strawberries', 'The first punnet of the summer.', 'veeterzy'),
  photo('1022', 'Northern lights', 'A green sky over a lone spruce.', 'Vashishtha Jogi'),
  photo('1040', 'Castle on the hill', 'White towers above a sea of forest.', 'Rachel Davis'),
  photo('1011', 'Still water', 'A canoe on a lake as flat as glass.', 'Roberto Nickson'),
  photo('1074', 'Lioness', 'Eye to eye, at a respectful distance.', 'Samuel Scrimshaw'),
  photo('1060', 'Pour-over', 'Slow coffee from a gooseneck kettle.', 'Karl Fredrickson'),
  photo('1018', 'Green ridge', 'A road winding under the cliffs.', 'Andrew Ridley'),
  photo('1025', 'Otto', 'A pug, a picnic blanket and no plans.', 'Matthew Wiebe'),
  photo('1016', 'Red rock', 'The canyon rim in the last of the sun.', 'Philippe Wuyts'),
  photo('1084', 'Walruses', 'An afternoon nap on the beach.', 'Jay Ruzesky'),
  photo('1039', 'Hidden falls', 'Moss, ferns and a long drop.', 'Andrew Coelho'),
]

export const findPhoto = (id: string | undefined) => PHOTOS.find(entry => entry.id === id)
