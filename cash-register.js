class CashRegister {
  constructor(cashInDrawer) {
    this.cid = cashInDrawer;
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
    let status = "OPEN";
    return [status, this.cid];
  }
}

function checkCashRegister(price, cash, cid) {
  var change;
  // Here is your change, ma'am.
  return change;
}

// Example cash-in-drawer array:
// [["PENNY", 1.01],
// ["NICKEL", 2.05],
// ["DIME", 3.1],
// ["QUARTER", 4.25],
// ["ONE", 90],
// ["FIVE", 55],
// ["TEN", 20],
// ["TWENTY", 60],
// ["ONE HUNDRED", 100]]

checkCashRegister(19.5, 20, [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
]);
