import { TblCards } from '../entity/TblCards';
import cardsTypeData from './card_type_tbl';

const cardsData: TblCards[] = [];

const getCardTypeByID = (cardTypeID: number = 1) => {
  return cardsTypeData.find(({ cardTypeId }) => cardTypeId === cardTypeID);
};

let cardNumI = 1;
let cardTypeIDI = 1;
for (let i = 1; i <= 52; i++) {
  cardsData.push({
    cardId: i,
    cardNo: cardNumI,
    cardTypeId: cardTypeIDI,
    cardType: getCardTypeByID(cardTypeIDI)!,
  });
  if (cardNumI === 13) {
    cardNumI = 1;
    cardTypeIDI++;
  } else {
    cardNumI++;
  }
}

export default cardsData;
