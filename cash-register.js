// Given an all-caps denomimation, return the dollar amount each piece is worth
// eg. "QUARTER" returns 0.25
function denomToCents(denom) {
  switch (denom) {
    case "PENNY":
      return 1;
    case "NICKEL":
      return 5;
    case "DIME":
      return 10;
    case "QUARTER":
      return 25;
    case "ONE":
      return 100;
    case "FIVE":
      return 500;
    case "TEN":
      return 1000;
    case "TWENTY":
      return 2000;
    case "ONE HUNDRED":
      return 10000;
    default:
      return 0;
  }
}

function dollarsToCents(cash) {
  return cash.map(x => [x[0], Math.round(x[1] * 100)]);
}

function centsToDollars(cash) {
  return cash.map(x => [x[0], x[1] / 100.0]);
}

class CashRegister {
  constructor(cashInDrawer) {
    this.origCid = cashInDrawer;
    this.cid = dollarsToCents(cashInDrawer);
  }

  // Return a 2D-array
  // 1st element is a string for status of either:
  //   "INSUFFICIENT_FUNDS"
  //   "CLOSED"
  //   "OPEN"
  //
  // 2nd element is an array of the change withdrawn, if register contained enough cash, e.g.
  //   [["PENNY", 1.01],
  //    ["NICKEL", 2.05],
  //    ["DIME", 3.1],
  //    ["QUARTER", 4.25],
  //    ["ONE", 90],
  //    ["FIVE", 55],
  //    ["TEN", 20],
  //    ["TWENTY", 60],
  //    ["ONE HUNDRED", 100]]
  withdraw(amount) {
    let withdrawn = this.getDenoms(amount);
    return { status: withdrawn[2], change: withdrawn[0] };
  }

  // Given a dollar amount, look in the cash drawer and return a 3d-array that contains:
  //   0: 2d-array that contains:
  //       0: all-caps string of the denomination
  //       1: currency amount
  //
  //        ex: ["TWENTY", 60]
  //   1: amount left to cash out, if any
  //      If we've reached the pennies and still can't make change, this parameter will be -1
  //
  //   2: status string
  //
  // This is a helper function used to iterate through and make change.
  // The maximum amount of denominations should be returned. For example:
  //    amount = 50;
  //    return = [["TWENTY", 40], 10]
  //
  getDenoms(amount) {
    // Go through the drawer backwards, start with the largest denomination
    // Exit when we have provided the maximum amount for a given denomination
    let withdrawn = [[], amount, "OPEN"];

    // convert from dollars to cents
    let cents = Math.round(amount * 100);

    let i = this.cid.length - 1;
    while (i >= 0 && cents > 0) {
      //console.log(this.cid[i]);
      let denom = this.cid[i][0];
      let denomAmount = denomToCents(denom);
      //console.log(denom, denomAmount);
      let count = 0;

      // While we still have change to cash out
      // AND
      // we still have denoms in that slot, pull denoms from that slot 1 at time
      while (cents >= denomAmount && this.cid[i][1] >= denomAmount) {
        //console.log(cents);
        cents -= denomAmount; // decrement amount owed by the amount of 1 piece of this denomination
        count++; // keep track of how many pieces of this denom we've taken out
        this.cid[i][1] -= denomAmount; // take 1 piece of denomination out of the drawer
      }
      if (count > 0) {
        withdrawn[0].push([denom, denomAmount * count]); // record what denom and how much of that denom was taken out
      }

      count = 0; // reset the count for the denomination
      i--; // step down to next lower denomination in sequence
    }

    // reached the bottom of the cash drawer ?
    if (i < 0) {
      //console.log("Reached bottom of drawer");
      if (cents > 0) {
        // we still owe change, but we have nothing left to give !
        withdrawn[2] = "INSUFFICIENT_FUNDS";
        withdrawn[0] = [];
      } else {
        // cents is 0

        if (this.cid[0][1] == 0) {
          // exhausted all the pennies
          withdrawn[2] = "CLOSED";
          withdrawn[0] = this.origCid;
        } else {
          // still some pennies left !
          // exhausted all the pennies
          withdrawn[0] = centsToDollars(withdrawn[0]);
        }
      }
    } else {
      withdrawn[0] = centsToDollars(withdrawn[0]);
    }

    withdrawn[1] = cents / 100.0; // return the amount left to make change for, in dollars
    return withdrawn;
  }
}

function checkCashRegister(price, cash, cid) {
  if (price > cash) {
    return { status: "INSUFFICIENT_FUNDS", cid };
  }
  let cashRegister = new CashRegister(cid);
  return cashRegister.withdraw(cash - price);
}

let testArray = [
  [
    19.5,
    20,
    [
      ["PENNY", 1.01],
      ["NICKEL", 2.05],
      ["DIME", 3.1],
      ["QUARTER", 4.25],
      ["ONE", 90],
      ["FIVE", 55],
      ["TEN", 20],
      ["TWENTY", 60],
      ["ONE HUNDRED", 100]
    ],
    { status: "OPEN", change: [["QUARTER", 0.5]] }
  ],
  [
    3.26,
    100,
    [
      ["PENNY", 1.01],
      ["NICKEL", 2.05],
      ["DIME", 3.1],
      ["QUARTER", 4.25],
      ["ONE", 90],
      ["FIVE", 55],
      ["TEN", 20],
      ["TWENTY", 60],
      ["ONE HUNDRED", 100]
    ],
    {
      status: "OPEN",
      change: [
        ["TWENTY", 60],
        ["TEN", 20],
        ["FIVE", 15],
        ["ONE", 1],
        ["QUARTER", 0.5],
        ["DIME", 0.2],
        ["PENNY", 0.04]
      ]
    }
  ],
  [
    19.5,
    20,
    [
      ["PENNY", 0.01],
      ["NICKEL", 0],
      ["DIME", 0],
      ["QUARTER", 0],
      ["ONE", 0],
      ["FIVE", 0],
      ["TEN", 0],
      ["TWENTY", 0],
      ["ONE HUNDRED", 0]
    ],
    { status: "INSUFFICIENT_FUNDS", change: [] }
  ],
  [
    19.5,
    20,
    [
      ["PENNY", 0.01],
      ["NICKEL", 0],
      ["DIME", 0],
      ["QUARTER", 0],
      ["ONE", 1],
      ["FIVE", 0],
      ["TEN", 0],
      ["TWENTY", 0],
      ["ONE HUNDRED", 0]
    ],
    { status: "INSUFFICIENT_FUNDS", change: [] }
  ],
  [
    19.5,
    20,
    [
      ["PENNY", 0.5],
      ["NICKEL", 0],
      ["DIME", 0],
      ["QUARTER", 0],
      ["ONE", 0],
      ["FIVE", 0],
      ["TEN", 0],
      ["TWENTY", 0],
      ["ONE HUNDRED", 0]
    ],
    {
      status: "CLOSED",
      change: [
        ["PENNY", 0.5],
        ["NICKEL", 0],
        ["DIME", 0],
        ["QUARTER", 0],
        ["ONE", 0],
        ["FIVE", 0],
        ["TEN", 0],
        ["TWENTY", 0],
        ["ONE HUNDRED", 0]
      ]
    }
  ]
];

function compareResult(a, b) {
  let passFail =
    a.status == b.status && a.change == b.change
      ? "... pass ..."
      : "*** fail ***";
  return passFail;
}

testArray.forEach(x => {
  let result = checkCashRegister(x[0], x[1], x[2]);
  let passFail = compareResult(result, x[3]);
  console.log("expect : " + x[3].status + " " + x[3].change);
  console.log("actual : " + result.status + " " + result.change);
});
