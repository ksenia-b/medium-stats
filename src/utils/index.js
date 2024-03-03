//"earnings": {
//       "__typename": "PostEarnings",
//       "total": {
//         "__typename": "Money",
//         "currencyCode": "USD",
//         "nanos": 870000000,
//         "units": 1
//       }
//     }


export const calculateEarnings = (data) => {
  if (!data || !data.nanos) {
    return 0;
  }

  const cents = (data.nanos / 10000000) / 100;

  console.log('data.units: + cents ', data.units, cents);
  return data.units + cents;
}
