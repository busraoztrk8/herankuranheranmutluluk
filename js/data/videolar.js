/**
 * Videolar bölümünün tek veri kaynağı.
 *
 * YENİ VİDEO EKLEMEK İÇİN:
 * Listeye bir satır ekle. Kapak görseli YouTube'dan otomatik çekilir,
 * ayrıca resim hazırlaman gerekmez. Sıralama buradaki sıradır.
 *
 * `youtubeId` = video adresindeki kimlik.
 *   https://www.youtube.com/watch?v=ABC123xyz_Q  ->  'ABC123xyz_Q'
 *   https://youtu.be/ABC123xyz_Q                 ->  'ABC123xyz_Q'
 *   (?si=... ve &t=5s gibi ekler önemsiz, atılabilir)
 *
 * `title` boş bırakılabilir; o zaman "Video 01" gibi görünür.
 *
 * @typedef {Object} VideoItem
 * @property {string} youtubeId
 * @property {string} [title]
 */

/** @type {VideoItem[]} */
export const videolarItems = [
  { youtubeId: 'QzxCOVdJcDA', title: '' },
  { youtubeId: 'yVqK1Kqtx7k', title: '' },
  { youtubeId: 'eHIOHrR3jG8', title: '' },
  { youtubeId: 'WWtUY_rrEuc', title: '' },
];

/** Bölüm başlığı ve alt bağlantı. */
export const videolarMeta = {
  title: 'VİDEOLAR',
  cta: 'Kanaldaki tüm videolar',
  ctaUrl: 'https://www.youtube.com/@HeranKuranHeranMutluluk',
};
