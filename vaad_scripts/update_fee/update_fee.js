const THREE_BEDROOM_APARTMENT_PAYMENT = 255;
const FOUR_BEDROOM_APARTMENT_PAYMENT = 323;
const FIVE_BEDROOM_APARTMENT_PAYMENT = 383;
const PENTHOUSES_PAYMENT = 482;
const INTERVAL_BETWEEN_REQUESTS_IN_MS = 10000 // 10 seconds 

const TOKEN = 'ENTER_YOUR_TOKEN_HERE';

const threeBedroomApartmentNumbers = [1, 2];
const fourBedroomApartmentNumbers = Array.from({ length: 30 }, (_, index) => index * 2 + 3);
const fiveBedroomApartmentNumbers = Array.from({ length: 30 }, (_, index) => index * 2 + 4);
const penthousesNumbers = [63, 64];

function createApartments(apartmentsNumbers, payment) {
  return apartmentsNumbers.map(apartmentNumber => ({ payment, apartmentNumber }));
}

const threeBedroomApartment = createApartments(
  threeBedroomApartmentNumbers,
  THREE_BEDROOM_APARTMENT_PAYMENT
);
const fourBedroomApartment = createApartments(
  fourBedroomApartmentNumbers,
  FOUR_BEDROOM_APARTMENT_PAYMENT
);
const fiveBedroomApartment = createApartments(
  fiveBedroomApartmentNumbers,
  FIVE_BEDROOM_APARTMENT_PAYMENT
);

const penthouses = createApartments(penthousesNumbers, PENTHOUSES_PAYMENT);

const allHouses = [
  ...threeBedroomApartment,
  ...fourBedroomApartment,
  ...fiveBedroomApartment,
  ...penthouses
];

function createHeaders() {
  const headers = new Headers();
  headers.append('Origin', 'https://shchenim.co.il');
  headers.append('Upgrade-Insecure-Requests', '1');
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append(
    'User-Agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'
  );
  headers.append('Sec-Fetch-User', '?1');
  headers.append(
    'Accept',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
  );
  return headers;
}

const combinedArray = [
  ...threeBedroomApartmentNumbers,
  ...fourBedroomApartmentNumbers,
  ...fiveBedroomApartmentNumbers,
  ...penthousesNumbers
];

function generateApartmentPaymentRequestOptions(params) {
  const { dateFrom = '2019-10-01', dateTo = '2025-12-01', payment, apartmentNumber } = params;
  const urlencoded = new URLSearchParams();
  const headers = createHeaders();
  urlencoded.append('_token', TOKEN);
  urlencoded.append('date_from', dateFrom);
  urlencoded.append('date_to', dateTo);
  urlencoded.append('from_apartment_number', apartmentNumber.toString());
  urlencoded.append('monthly_payment', payment.toString());
  urlencoded.append('option', 'regular');
  urlencoded.append('to_apartment_number', apartmentNumber.toString());

  return {
    method: 'POST',
    headers: headers,
    body: urlencoded,
    redirect: 'follow'
  };
}


async function setPayment(requestOptions) {
  const { body } = requestOptions;
  const response = await fetch('https://shchenim.co.il/householder/apartments/set', requestOptions);
  console.log(
    `sent request for apartment 
    ${body.get('from_apartment_number')} 
    amount:${body.get('monthly_payment')} 
    status:${response.status}`
  );
  return response;
}
const requestOptionsArray = allHouses.map(generateApartmentPaymentRequestOptions);


requestOptionsArray.every((requestOptions, i) =>
  setTimeout(() => setPayment(requestOptions), INTERVAL_BETWEEN_REQUESTS_IN_MS * i)
);
