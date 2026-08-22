/**
 * Canlı yayın durumu — ileride YouTube Live API kontrolüyle
 * değiştirilebilecek biçimde tutuldu.
 *
 * `status` 'live' olduğunda oynatıcının sol üstünde CANLI rozeti belirir.
 * Diğer durumlarda rozet gösterilmez.
 *
 * @typedef {Object} BroadcastInfo
 * @property {'upcoming'|'live'|'ended'} status
 * @property {string} title
 */

/** @type {BroadcastInfo} */
export const broadcast = {
  status: 'upcoming', // 'upcoming' | 'live' | 'ended'
  title: 'Her An Kur\u2019an, Her An Mutluluk \u2014 Canl\u0131 Yay\u0131n',
};
