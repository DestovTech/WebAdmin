const CloseGameName = ({ game }: { game: string }) => {
  switch (game) {
    case "0":
      return "Single Digit";
    case "1":
      return "Single Panel";
    case "2":
      return "Double Panel";
    case "3":
      return "Triple Panel";
    case "4":
      return "SP DP TP";
    case "5":
      return "Any Patti";
    case "6":
      return "Family Patti";
    case "7":
      return "Cycle Patti";
    case "8":
      return "Motor Patti";
    default:
      return game;
  }
};

export default CloseGameName;
