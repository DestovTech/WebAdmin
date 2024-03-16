const GameName = ({ game }: { game: string }) => {
  switch (game) {
    case "0":
      return "Single Digit";
    case "1":
      return "Jodi Digit";
    case "2":
      return "Red Bracket";
    case "3":
      return "Single Panel";
    case "4":
      return "Double Panel";
    case "5":
      return "Triple Panel";
    case "6":
      return "SP DP TP";
    case "7":
      return "Any Patti";
    case "8":
      return "Family Patti";
    case "9":
      return "Cycle Patti";
    case "10":
      return "Motor Patti";
    case "11":
      return "Half Sangam";
    case "12":
      return "Full Sangam";
    default:
      return game;
  }
};

export default GameName;
