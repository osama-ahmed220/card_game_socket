export const generateGameID = (game_id: number) => {
  const prefix = `game_`;
  return `${prefix}${game_id}`;
};

export const generatePlayerID = (player_id: number) => {
  const prefix = `player_`;
  return `${prefix}${player_id}`;
};

export const generateWatcherID = (watcher_id: number) => {
  const prefix = `watcher_`;
  return `${prefix}${watcher_id}`;
};
