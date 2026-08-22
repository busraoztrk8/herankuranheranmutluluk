/**
 * Videolar bölümünün veri kaynağı.
 *
 * YENİ VİDEO EKLEMEK İÇİN:
 * Listeye bir satır ekle. Kapak görseli YouTube'dan otomatik çekilir,
 * ayrıca resim hazırlaman gerekmez.
 *
 * `youtubeId` = video adresindeki kimlik.
 *   https://www.youtube.com/watch?v=ABC123xyz_Q  ->  'ABC123xyz_Q'
 *
 *
 * @typedef {Object} VideoItem
 * @property {string} id
 * @property {string} title
 * @property {string} youtubeId
 */

/** @type {VideoItem[]} */
export const videoItems = [
  {
    id: 'vid-001',
    title: 'Pazar Sohbeti — 01',
    youtubeId: 'oVZDR9HuuDg',
  },
  {
    id: 'vid-002',
    title: 'Pazar Sohbeti — 02',
    youtubeId: 'VLpSW0Fddb4',
  },
  {
    id: 'vid-003',
    title: 'Pazar Sohbeti — 03',
    youtubeId: 'fe52kGpWlOs',
  },
  {
    id: 'vid-004',
    title: 'Pazar Sohbeti — 04',
    youtubeId: 'b8ohKMfY2Cw',
  },
];
