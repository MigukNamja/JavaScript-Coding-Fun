function areaCodeSyntaxOK(str) {
  let syntaxOK = true;
  let arr = stripToDigitsAndParens(str).split("");
  let parenCount = 0;
  let areaCodeCharCount = 0;
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case "(":
        if (parenCount > 0 || i > 2) {
          return false;
        } else {
          parenCount = 1;
        }
        break;
      case ")":
        if (parenCount != 1 || i > 5 || areaCodeCharCount != 3) {
          return false;
        } else {
          parenCount = 2;
        }
        break;
      default:
        if (parenCount == 1) {
          areaCodeCharCount++;
          if (areaCodeCharCount > 3) {
            return false;
          }
        }
    }
  }

  return syntaxOK;
}

function invalidChars(str) {
  let invalid = false;
  let arr = str.slice().split("");
  let validChars = /[0-9\s\(\)\-]/;
  arr.forEach(c => {
    if (!validChars.test(c)) {
      invalid = true;
      //console.log("invalid char '" + c + "'");
    }
  });
  return invalid;
}

function stripToDigits(str) {
  let digits = /[0-9]/g;
  let stripped = str.match(digits).join("");
  //console.log(stripped);
  return stripped;
}

function stripToDigitsAndParens(str) {
  let digits = /[0-9\(\)]/g;
  let stripped = str.match(digits).join("");
  //console.log(stripped);
  return stripped;
}

function validNumOfDigits(str) {
  let justDigits = stripToDigits(str);
  if (justDigits.length == 10 || (justDigits.length == 11 && str[0] === "1")) {
    return true;
  } else {
    return false;
  }
}

function leadingDash(str) {
  return str[0] === "-";
}

function telephoneCheck(str) {
  if (
    !str ||
    leadingDash(str) ||
    !validNumOfDigits(str) ||
    invalidChars(str) ||
    !areaCodeSyntaxOK(str)
  ) {
    return false;
  } else {
    return true;
  }
}

let inOut = [
  ["555-555-5555", true],
  ["1 555-555-5555", true],
  ["1 (555) 555-5555", true],
  ["5555555555", true],
  ["555-555-5555", true],
  ["(555)555-5555", true],
  ["1(555)555-5555", true],
  ["555-5555", false],
  ["5555555", false],
  ["1 555)555-5555", false],
  ["1 555 555 5555", true],
  ["1 456 789 4444", true],
  ["123**&!!asdf#", false],
  ["55555555", false],
  ["(6054756961)", false],
  ["2 (757) 622-7382", false],
  ["0 (757) 622-7382", false],
  ["-1 (757) 622-7382", false],
  ["2 757 622-7382", false],
  ["10 (757) 622-7382", false],
  ["27576227382", false],
  ["(275)76227382", false],
  ["2(757)6227382", false],
  ["2(757)622-7382", false],
  ["555)-555-5555", false],
  ["(555-555-5555", false],
  ["(555)5(55?)-5555", false]
];

inOut.forEach(entry => {
  let result =
    telephoneCheck(entry[0]) === entry[1] ? "... pass ..." : "*** fail ***";
  console.log(`${result} : ${entry[0]} | ${entry[1]}`);
});
