// converter.test.ts
import { convertCZKtoCurrency } from "./converter";

function testConvert() {
  const result = convertCZKtoCurrency(100, 25); // 100 CZK, rate 25 = 4
  if (result !== 4) {
    throw new Error(`Expected 4, but got ${result}`);
  }
  console.log("testConvert passed");
}

testConvert();
