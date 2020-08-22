// const cardsOnTable = [
//   { player_id: 1, card_id: 2 },
//   { player_id: 3, card_id: 6 },
//   { player_id: 5, card_id: 12 },
//   { player_id: 237, card_id: 13 },
// ];

// const cards = [
//   { cardId: 2, cardNo: 8 },
//   { cardId: 6, cardNo: 12 },
//   { cardId: 12, cardNo: 2 },
//   { cardId: 13, cardNo: 10 },
// ];

// // const max = cardsOnTable.reduce((a, b) => {
// //   const cardA = cards.find((card) => card.cardId === a.card_id);
// //   const cardB = cards.find((card) => card.cardId === b.card_id);
// //   console.log('cardA', cardA);
// //   console.log('cardB', cardB);
// //   return Math.max(cardA.cardNo, cardB.cardNo);
// // });

// const mapped = () => {
//   return cardsOnTable.map(
//     ({ card_id }) => cards.find(({ cardId }) => cardId === card_id).cardNo
//   );
// };

// const getMax = () => {
//   console.log('mapped()', mapped());
//   return Math.max(...mapped());
// };

// const max = cardsOnTable.find(
//   ({ card_id }) =>
//     cards.find(({ cardNo }) => cardNo === getMax()).cardId === card_id
// );

// console.log(max);

// // const arr = [1, 2, 3];

// // arr.reduce((a, b) => {
// //   console.log(a);
// //   console.log(b);
// //   return Math.max(a, b);
// // });

// const arr = [1, 2, 3, 4];
// console.log(
//   Math.max(
//     ...arr.map((obj) => {
//       // return obj;
//       return obj <= 3 ? obj : 0;
//     })
//   )
// );

const score = 0;
const score2 = -10;

console.log(score + score2);
