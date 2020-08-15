const data = require('./roundsAndSequence.json');

const game = {};
game.roundAndSequence = data;

const roundLegnth = game.roundAndSequence.length;
const lastRoundIndex = roundLegnth - 1;
if (roundLegnth <= 0) {
  game.roundAndSequence.push([
    [
      {
        card_id: 1,
        player_id: 3,
      },
    ],
  ]);
} else {
  if (roundLegnth < 4) {
    const rounds = game.roundAndSequence[lastRoundIndex];
    const sequenceLength = rounds.length;
    const lastSequenceIndex = sequenceLength - 1;
    if (sequenceLength <= 13) {
      const sequence = game.roundAndSequence[lastRoundIndex][lastSequenceIndex];
      const cardsLength = sequence.length;
      if (cardsLength < 4) {
        // add a card here
        game.roundAndSequence[lastRoundIndex][lastSequenceIndex].push({
          card_id: 23,
          player_id: 345,
        });
      } else {
        console.log(123);
        if (sequenceLength === 13 && cardsLength === 4) {
          // add new round
          game.roundAndSequence.push([
            [
              {
                card_id: 1,
                player_id: 3,
              },
            ],
          ]);
        } else {
          game.roundAndSequence[lastRoundIndex].push([
            {
              card_id: 1,
              player_id: 3,
            },
          ]);
        }
      }
    } else {
      console.log(123);
      // new round
      game.roundAndSequence.push([
        [
          {
            card_id: 1,
            player_id: 3,
          },
        ],
      ]);
    }
    // console.log('sequenceLength', sequenceLength);
    // console.log('sequenceSelectedIndex', lastSequenceIndex);
    // console.log('rounds', rounds);
  } else {
    // last round
    // const round = this.gameBoards[generatedGameID].roundAndSequence[roundAndSequenceSelectedIndex];
    // const roundLength = round.length;
    // const roundCurrentIndex = roundLength - 1;
    // if(roundLength <= 0) {
    //   // first sequence
    //   this.gameBoards[generatedGameID].roundAndSequence[roundAndSequenceSelectedIndex].push([
    //     {
    //       card_id: playedCard.cardId,
    //       player_id: player.player_id
    //     }
    //   ]);
    // } else {
    //   if(roundLength > 12) {
    //     // last sequence
    //   } else {
    //   }
    // }
  }
}

console.log(game.roundAndSequence);
