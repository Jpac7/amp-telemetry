const formatTimestamp = date =>
  `${correctDigit(date.getHours())}:${correctDigit(date.getMinutes())}:${correctDigit(date.getSeconds())}`;

function correctDigit(digit) {
  if (digit < 10) {
    return `0${digit}`;
  }
  return digit;
}

export { formatTimestamp };
