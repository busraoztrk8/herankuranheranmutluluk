/**
 * Instagram — bölümün tek veri kaynağı.
 *
 * YENİ REEL/GÖNDERİ EKLEMEK İÇİN:
 * Listeye bir satır ekle. Kapak ve içerik doğrudan Instagram'dan gelir,
 * ayrıca görsel hazırlaman gerekmez.
 *
 * `code` = paylaşım adresindeki kısa kod.
 *   https://www.instagram.com/reel/DGGkgmMsLNu/?igsi=...  ->  'DGGkgmMsLNu'
 *   https://www.instagram.com/p/ABC123xyz/                ->  'ABC123xyz'
 *
 * `type`: 'reel' (video) veya 'p' (normal gönderi). Yazmazsan 'reel' sayılır.
 *
 * @typedef {Object} InstagramPost
 * @property {string} code
 * @property {'reel'|'p'} [type]
 */

/** @type {InstagramPost[]} */
export const instagramPosts = [
  { code: 'DGGkgmMsLNu', type: 'reel' },
  { code: 'DTA1P1WDCu0', type: 'reel' },
  { code: 'DbYmCgKtBBJ', type: 'reel' },
  { code: 'DSh2Z2mjNPw', type: 'reel' },
  { code: 'DcJnyPotVTM', type: 'reel' },
  { code: 'DbD-0Fttquy', type: 'reel' },
  { code: 'DbqnVFttRbu', type: 'reel' },
];

/** Bölüm ayarları. Listeye eklediğin her gönderi doğrudan rayda görünür. */
export const instagramMeta = {
  profileUrl: 'https://www.instagram.com/herankuranheranmutluluk',
};
