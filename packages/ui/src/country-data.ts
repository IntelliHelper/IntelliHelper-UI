/**
 * ISO country calling codes + primary currencies.
 * Pure data + helpers — no React. Used by PhoneInput and CurrencyInput.
 */

export type CountryRecord = {
  iso2: string;
  name: string;
  /** International dialing prefix without + */
  dialCode: string;
  /** Primary ISO 4217 currency */
  currency: string;
  /** Typical national significant number length (approx.) */
  nationalLength: number;
  flag: string;
  /** Optional national digit groups for display formatting */
  groups: number[] | null;
};

export type CurrencyRecord = {
  code: string;
  name: string;
  /** Countries that primarily use this currency */
  countries: string[];
  symbol: string;
  decimals: number;
};

export const COUNTRIES: CountryRecord[] = [
  {
    "iso2": "AF",
    "name": "Afghanistan",
    "dialCode": "93",
    "currency": "AFN",
    "nationalLength": 9,
    "flag": "🇦🇫",
    "groups": null
  },
  {
    "iso2": "AL",
    "name": "Albania",
    "dialCode": "355",
    "currency": "ALL",
    "nationalLength": 9,
    "flag": "🇦🇱",
    "groups": null
  },
  {
    "iso2": "DZ",
    "name": "Algeria",
    "dialCode": "213",
    "currency": "DZD",
    "nationalLength": 9,
    "flag": "🇩🇿",
    "groups": null
  },
  {
    "iso2": "AS",
    "name": "American Samoa",
    "dialCode": "1",
    "currency": "USD",
    "nationalLength": 10,
    "flag": "🇦🇸",
    "groups": null
  },
  {
    "iso2": "AD",
    "name": "Andorra",
    "dialCode": "376",
    "currency": "EUR",
    "nationalLength": 6,
    "flag": "🇦🇩",
    "groups": null
  },
  {
    "iso2": "AO",
    "name": "Angola",
    "dialCode": "244",
    "currency": "AOA",
    "nationalLength": 9,
    "flag": "🇦🇴",
    "groups": null
  },
  {
    "iso2": "AI",
    "name": "Anguilla",
    "dialCode": "1",
    "currency": "XCD",
    "nationalLength": 10,
    "flag": "🇦🇮",
    "groups": null
  },
  {
    "iso2": "AG",
    "name": "Antigua and Barbuda",
    "dialCode": "1",
    "currency": "XCD",
    "nationalLength": 10,
    "flag": "🇦🇬",
    "groups": null
  },
  {
    "iso2": "AR",
    "name": "Argentina",
    "dialCode": "54",
    "currency": "ARS",
    "nationalLength": 10,
    "flag": "🇦🇷",
    "groups": null
  },
  {
    "iso2": "AM",
    "name": "Armenia",
    "dialCode": "374",
    "currency": "AMD",
    "nationalLength": 8,
    "flag": "🇦🇲",
    "groups": null
  },
  {
    "iso2": "AW",
    "name": "Aruba",
    "dialCode": "297",
    "currency": "AWG",
    "nationalLength": 7,
    "flag": "🇦🇼",
    "groups": null
  },
  {
    "iso2": "AU",
    "name": "Australia",
    "dialCode": "61",
    "currency": "AUD",
    "nationalLength": 9,
    "flag": "🇦🇺",
    "groups": [
      3,
      3,
      3
    ]
  },
  {
    "iso2": "AT",
    "name": "Austria",
    "dialCode": "43",
    "currency": "EUR",
    "nationalLength": 10,
    "flag": "🇦🇹",
    "groups": null
  },
  {
    "iso2": "AZ",
    "name": "Azerbaijan",
    "dialCode": "994",
    "currency": "AZN",
    "nationalLength": 9,
    "flag": "🇦🇿",
    "groups": null
  },
  {
    "iso2": "BS",
    "name": "Bahamas",
    "dialCode": "1",
    "currency": "BSD",
    "nationalLength": 10,
    "flag": "🇧🇸",
    "groups": null
  },
  {
    "iso2": "BH",
    "name": "Bahrain",
    "dialCode": "973",
    "currency": "BHD",
    "nationalLength": 8,
    "flag": "🇧🇭",
    "groups": null
  },
  {
    "iso2": "BD",
    "name": "Bangladesh",
    "dialCode": "880",
    "currency": "BDT",
    "nationalLength": 10,
    "flag": "🇧🇩",
    "groups": [
      4,
      6
    ]
  },
  {
    "iso2": "BB",
    "name": "Barbados",
    "dialCode": "1",
    "currency": "BBD",
    "nationalLength": 10,
    "flag": "🇧🇧",
    "groups": null
  },
  {
    "iso2": "BY",
    "name": "Belarus",
    "dialCode": "375",
    "currency": "BYN",
    "nationalLength": 9,
    "flag": "🇧🇾",
    "groups": null
  },
  {
    "iso2": "BE",
    "name": "Belgium",
    "dialCode": "32",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇧🇪",
    "groups": null
  },
  {
    "iso2": "BZ",
    "name": "Belize",
    "dialCode": "501",
    "currency": "BZD",
    "nationalLength": 7,
    "flag": "🇧🇿",
    "groups": null
  },
  {
    "iso2": "BJ",
    "name": "Benin",
    "dialCode": "229",
    "currency": "XOF",
    "nationalLength": 8,
    "flag": "🇧🇯",
    "groups": null
  },
  {
    "iso2": "BM",
    "name": "Bermuda",
    "dialCode": "1",
    "currency": "BMD",
    "nationalLength": 10,
    "flag": "🇧🇲",
    "groups": null
  },
  {
    "iso2": "BT",
    "name": "Bhutan",
    "dialCode": "975",
    "currency": "BTN",
    "nationalLength": 8,
    "flag": "🇧🇹",
    "groups": null
  },
  {
    "iso2": "BO",
    "name": "Bolivia",
    "dialCode": "591",
    "currency": "BOB",
    "nationalLength": 8,
    "flag": "🇧🇴",
    "groups": null
  },
  {
    "iso2": "BA",
    "name": "Bosnia and Herzegovina",
    "dialCode": "387",
    "currency": "BAM",
    "nationalLength": 8,
    "flag": "🇧🇦",
    "groups": null
  },
  {
    "iso2": "BW",
    "name": "Botswana",
    "dialCode": "267",
    "currency": "BWP",
    "nationalLength": 8,
    "flag": "🇧🇼",
    "groups": null
  },
  {
    "iso2": "BR",
    "name": "Brazil",
    "dialCode": "55",
    "currency": "BRL",
    "nationalLength": 11,
    "flag": "🇧🇷",
    "groups": [
      2,
      5,
      4
    ]
  },
  {
    "iso2": "IO",
    "name": "British Indian Ocean Territory",
    "dialCode": "246",
    "currency": "USD",
    "nationalLength": 7,
    "flag": "🇮🇴",
    "groups": null
  },
  {
    "iso2": "VG",
    "name": "British Virgin Islands",
    "dialCode": "1",
    "currency": "USD",
    "nationalLength": 10,
    "flag": "🇻🇬",
    "groups": null
  },
  {
    "iso2": "BN",
    "name": "Brunei",
    "dialCode": "673",
    "currency": "BND",
    "nationalLength": 7,
    "flag": "🇧🇳",
    "groups": null
  },
  {
    "iso2": "BG",
    "name": "Bulgaria",
    "dialCode": "359",
    "currency": "BGN",
    "nationalLength": 9,
    "flag": "🇧🇬",
    "groups": null
  },
  {
    "iso2": "BF",
    "name": "Burkina Faso",
    "dialCode": "226",
    "currency": "XOF",
    "nationalLength": 8,
    "flag": "🇧🇫",
    "groups": null
  },
  {
    "iso2": "BI",
    "name": "Burundi",
    "dialCode": "257",
    "currency": "BIF",
    "nationalLength": 8,
    "flag": "🇧🇮",
    "groups": null
  },
  {
    "iso2": "KH",
    "name": "Cambodia",
    "dialCode": "855",
    "currency": "KHR",
    "nationalLength": 9,
    "flag": "🇰🇭",
    "groups": null
  },
  {
    "iso2": "CM",
    "name": "Cameroon",
    "dialCode": "237",
    "currency": "XAF",
    "nationalLength": 9,
    "flag": "🇨🇲",
    "groups": null
  },
  {
    "iso2": "CA",
    "name": "Canada",
    "dialCode": "1",
    "currency": "CAD",
    "nationalLength": 10,
    "flag": "🇨🇦",
    "groups": [
      3,
      3,
      4
    ]
  },
  {
    "iso2": "CV",
    "name": "Cape Verde",
    "dialCode": "238",
    "currency": "CVE",
    "nationalLength": 7,
    "flag": "🇨🇻",
    "groups": null
  },
  {
    "iso2": "KY",
    "name": "Cayman Islands",
    "dialCode": "1",
    "currency": "KYD",
    "nationalLength": 10,
    "flag": "🇰🇾",
    "groups": null
  },
  {
    "iso2": "CF",
    "name": "Central African Republic",
    "dialCode": "236",
    "currency": "XAF",
    "nationalLength": 8,
    "flag": "🇨🇫",
    "groups": null
  },
  {
    "iso2": "TD",
    "name": "Chad",
    "dialCode": "235",
    "currency": "XAF",
    "nationalLength": 8,
    "flag": "🇹🇩",
    "groups": null
  },
  {
    "iso2": "CL",
    "name": "Chile",
    "dialCode": "56",
    "currency": "CLP",
    "nationalLength": 9,
    "flag": "🇨🇱",
    "groups": null
  },
  {
    "iso2": "CN",
    "name": "China",
    "dialCode": "86",
    "currency": "CNY",
    "nationalLength": 11,
    "flag": "🇨🇳",
    "groups": [
      3,
      4,
      4
    ]
  },
  {
    "iso2": "CX",
    "name": "Christmas Island",
    "dialCode": "61",
    "currency": "AUD",
    "nationalLength": 9,
    "flag": "🇨🇽",
    "groups": null
  },
  {
    "iso2": "CC",
    "name": "Cocos Islands",
    "dialCode": "61",
    "currency": "AUD",
    "nationalLength": 9,
    "flag": "🇨🇨",
    "groups": null
  },
  {
    "iso2": "CO",
    "name": "Colombia",
    "dialCode": "57",
    "currency": "COP",
    "nationalLength": 10,
    "flag": "🇨🇴",
    "groups": null
  },
  {
    "iso2": "KM",
    "name": "Comoros",
    "dialCode": "269",
    "currency": "KMF",
    "nationalLength": 7,
    "flag": "🇰🇲",
    "groups": null
  },
  {
    "iso2": "CG",
    "name": "Congo",
    "dialCode": "242",
    "currency": "XAF",
    "nationalLength": 9,
    "flag": "🇨🇬",
    "groups": null
  },
  {
    "iso2": "CD",
    "name": "Congo (DRC)",
    "dialCode": "243",
    "currency": "CDF",
    "nationalLength": 9,
    "flag": "🇨🇩",
    "groups": null
  },
  {
    "iso2": "CK",
    "name": "Cook Islands",
    "dialCode": "682",
    "currency": "NZD",
    "nationalLength": 5,
    "flag": "🇨🇰",
    "groups": null
  },
  {
    "iso2": "CR",
    "name": "Costa Rica",
    "dialCode": "506",
    "currency": "CRC",
    "nationalLength": 8,
    "flag": "🇨🇷",
    "groups": null
  },
  {
    "iso2": "CI",
    "name": "Côte d'Ivoire",
    "dialCode": "225",
    "currency": "XOF",
    "nationalLength": 10,
    "flag": "🇨🇮",
    "groups": null
  },
  {
    "iso2": "HR",
    "name": "Croatia",
    "dialCode": "385",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇭🇷",
    "groups": null
  },
  {
    "iso2": "CU",
    "name": "Cuba",
    "dialCode": "53",
    "currency": "CUP",
    "nationalLength": 8,
    "flag": "🇨🇺",
    "groups": null
  },
  {
    "iso2": "CW",
    "name": "Curaçao",
    "dialCode": "599",
    "currency": "ANG",
    "nationalLength": 7,
    "flag": "🇨🇼",
    "groups": null
  },
  {
    "iso2": "CY",
    "name": "Cyprus",
    "dialCode": "357",
    "currency": "EUR",
    "nationalLength": 8,
    "flag": "🇨🇾",
    "groups": null
  },
  {
    "iso2": "CZ",
    "name": "Czechia",
    "dialCode": "420",
    "currency": "CZK",
    "nationalLength": 9,
    "flag": "🇨🇿",
    "groups": null
  },
  {
    "iso2": "DK",
    "name": "Denmark",
    "dialCode": "45",
    "currency": "DKK",
    "nationalLength": 8,
    "flag": "🇩🇰",
    "groups": [
      2,
      2,
      2,
      2
    ]
  },
  {
    "iso2": "DJ",
    "name": "Djibouti",
    "dialCode": "253",
    "currency": "DJF",
    "nationalLength": 8,
    "flag": "🇩🇯",
    "groups": null
  },
  {
    "iso2": "DM",
    "name": "Dominica",
    "dialCode": "1",
    "currency": "XCD",
    "nationalLength": 10,
    "flag": "🇩🇲",
    "groups": null
  },
  {
    "iso2": "DO",
    "name": "Dominican Republic",
    "dialCode": "1",
    "currency": "DOP",
    "nationalLength": 10,
    "flag": "🇩🇴",
    "groups": null
  },
  {
    "iso2": "EC",
    "name": "Ecuador",
    "dialCode": "593",
    "currency": "USD",
    "nationalLength": 9,
    "flag": "🇪🇨",
    "groups": null
  },
  {
    "iso2": "EG",
    "name": "Egypt",
    "dialCode": "20",
    "currency": "EGP",
    "nationalLength": 10,
    "flag": "🇪🇬",
    "groups": [
      2,
      4,
      4
    ]
  },
  {
    "iso2": "SV",
    "name": "El Salvador",
    "dialCode": "503",
    "currency": "USD",
    "nationalLength": 8,
    "flag": "🇸🇻",
    "groups": null
  },
  {
    "iso2": "GQ",
    "name": "Equatorial Guinea",
    "dialCode": "240",
    "currency": "XAF",
    "nationalLength": 9,
    "flag": "🇬🇶",
    "groups": null
  },
  {
    "iso2": "ER",
    "name": "Eritrea",
    "dialCode": "291",
    "currency": "ERN",
    "nationalLength": 7,
    "flag": "🇪🇷",
    "groups": null
  },
  {
    "iso2": "EE",
    "name": "Estonia",
    "dialCode": "372",
    "currency": "EUR",
    "nationalLength": 8,
    "flag": "🇪🇪",
    "groups": null
  },
  {
    "iso2": "SZ",
    "name": "Eswatini",
    "dialCode": "268",
    "currency": "SZL",
    "nationalLength": 8,
    "flag": "🇸🇿",
    "groups": null
  },
  {
    "iso2": "ET",
    "name": "Ethiopia",
    "dialCode": "251",
    "currency": "ETB",
    "nationalLength": 9,
    "flag": "🇪🇹",
    "groups": null
  },
  {
    "iso2": "FK",
    "name": "Falkland Islands",
    "dialCode": "500",
    "currency": "FKP",
    "nationalLength": 5,
    "flag": "🇫🇰",
    "groups": null
  },
  {
    "iso2": "FO",
    "name": "Faroe Islands",
    "dialCode": "298",
    "currency": "DKK",
    "nationalLength": 6,
    "flag": "🇫🇴",
    "groups": null
  },
  {
    "iso2": "FJ",
    "name": "Fiji",
    "dialCode": "679",
    "currency": "FJD",
    "nationalLength": 7,
    "flag": "🇫🇯",
    "groups": null
  },
  {
    "iso2": "FI",
    "name": "Finland",
    "dialCode": "358",
    "currency": "EUR",
    "nationalLength": 10,
    "flag": "🇫🇮",
    "groups": null
  },
  {
    "iso2": "FR",
    "name": "France",
    "dialCode": "33",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇫🇷",
    "groups": [
      1,
      2,
      2,
      2,
      2
    ]
  },
  {
    "iso2": "GF",
    "name": "French Guiana",
    "dialCode": "594",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇬🇫",
    "groups": null
  },
  {
    "iso2": "PF",
    "name": "French Polynesia",
    "dialCode": "689",
    "currency": "XPF",
    "nationalLength": 8,
    "flag": "🇵🇫",
    "groups": null
  },
  {
    "iso2": "GA",
    "name": "Gabon",
    "dialCode": "241",
    "currency": "XAF",
    "nationalLength": 7,
    "flag": "🇬🇦",
    "groups": null
  },
  {
    "iso2": "GM",
    "name": "Gambia",
    "dialCode": "220",
    "currency": "GMD",
    "nationalLength": 7,
    "flag": "🇬🇲",
    "groups": null
  },
  {
    "iso2": "GE",
    "name": "Georgia",
    "dialCode": "995",
    "currency": "GEL",
    "nationalLength": 9,
    "flag": "🇬🇪",
    "groups": null
  },
  {
    "iso2": "DE",
    "name": "Germany",
    "dialCode": "49",
    "currency": "EUR",
    "nationalLength": 11,
    "flag": "🇩🇪",
    "groups": [
      3,
      3,
      4
    ]
  },
  {
    "iso2": "GH",
    "name": "Ghana",
    "dialCode": "233",
    "currency": "GHS",
    "nationalLength": 9,
    "flag": "🇬🇭",
    "groups": null
  },
  {
    "iso2": "GI",
    "name": "Gibraltar",
    "dialCode": "350",
    "currency": "GIP",
    "nationalLength": 8,
    "flag": "🇬🇮",
    "groups": null
  },
  {
    "iso2": "GR",
    "name": "Greece",
    "dialCode": "30",
    "currency": "EUR",
    "nationalLength": 10,
    "flag": "🇬🇷",
    "groups": null
  },
  {
    "iso2": "GL",
    "name": "Greenland",
    "dialCode": "299",
    "currency": "DKK",
    "nationalLength": 6,
    "flag": "🇬🇱",
    "groups": null
  },
  {
    "iso2": "GD",
    "name": "Grenada",
    "dialCode": "1",
    "currency": "XCD",
    "nationalLength": 10,
    "flag": "🇬🇩",
    "groups": null
  },
  {
    "iso2": "GP",
    "name": "Guadeloupe",
    "dialCode": "590",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇬🇵",
    "groups": null
  },
  {
    "iso2": "GU",
    "name": "Guam",
    "dialCode": "1",
    "currency": "USD",
    "nationalLength": 10,
    "flag": "🇬🇺",
    "groups": null
  },
  {
    "iso2": "GT",
    "name": "Guatemala",
    "dialCode": "502",
    "currency": "GTQ",
    "nationalLength": 8,
    "flag": "🇬🇹",
    "groups": null
  },
  {
    "iso2": "GG",
    "name": "Guernsey",
    "dialCode": "44",
    "currency": "GBP",
    "nationalLength": 10,
    "flag": "🇬🇬",
    "groups": null
  },
  {
    "iso2": "GN",
    "name": "Guinea",
    "dialCode": "224",
    "currency": "GNF",
    "nationalLength": 9,
    "flag": "🇬🇳",
    "groups": null
  },
  {
    "iso2": "GW",
    "name": "Guinea-Bissau",
    "dialCode": "245",
    "currency": "XOF",
    "nationalLength": 7,
    "flag": "🇬🇼",
    "groups": null
  },
  {
    "iso2": "GY",
    "name": "Guyana",
    "dialCode": "592",
    "currency": "GYD",
    "nationalLength": 7,
    "flag": "🇬🇾",
    "groups": null
  },
  {
    "iso2": "HT",
    "name": "Haiti",
    "dialCode": "509",
    "currency": "HTG",
    "nationalLength": 8,
    "flag": "🇭🇹",
    "groups": null
  },
  {
    "iso2": "HN",
    "name": "Honduras",
    "dialCode": "504",
    "currency": "HNL",
    "nationalLength": 8,
    "flag": "🇭🇳",
    "groups": null
  },
  {
    "iso2": "HK",
    "name": "Hong Kong",
    "dialCode": "852",
    "currency": "HKD",
    "nationalLength": 8,
    "flag": "🇭🇰",
    "groups": [
      4,
      4
    ]
  },
  {
    "iso2": "HU",
    "name": "Hungary",
    "dialCode": "36",
    "currency": "HUF",
    "nationalLength": 9,
    "flag": "🇭🇺",
    "groups": null
  },
  {
    "iso2": "IS",
    "name": "Iceland",
    "dialCode": "354",
    "currency": "ISK",
    "nationalLength": 7,
    "flag": "🇮🇸",
    "groups": null
  },
  {
    "iso2": "IN",
    "name": "India",
    "dialCode": "91",
    "currency": "INR",
    "nationalLength": 10,
    "flag": "🇮🇳",
    "groups": [
      5,
      5
    ]
  },
  {
    "iso2": "ID",
    "name": "Indonesia",
    "dialCode": "62",
    "currency": "IDR",
    "nationalLength": 11,
    "flag": "🇮🇩",
    "groups": [
      3,
      4,
      4
    ]
  },
  {
    "iso2": "IR",
    "name": "Iran",
    "dialCode": "98",
    "currency": "IRR",
    "nationalLength": 10,
    "flag": "🇮🇷",
    "groups": null
  },
  {
    "iso2": "IQ",
    "name": "Iraq",
    "dialCode": "964",
    "currency": "IQD",
    "nationalLength": 10,
    "flag": "🇮🇶",
    "groups": null
  },
  {
    "iso2": "IE",
    "name": "Ireland",
    "dialCode": "353",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇮🇪",
    "groups": null
  },
  {
    "iso2": "IM",
    "name": "Isle of Man",
    "dialCode": "44",
    "currency": "GBP",
    "nationalLength": 10,
    "flag": "🇮🇲",
    "groups": null
  },
  {
    "iso2": "IL",
    "name": "Israel",
    "dialCode": "972",
    "currency": "ILS",
    "nationalLength": 9,
    "flag": "🇮🇱",
    "groups": [
      2,
      3,
      4
    ]
  },
  {
    "iso2": "IT",
    "name": "Italy",
    "dialCode": "39",
    "currency": "EUR",
    "nationalLength": 10,
    "flag": "🇮🇹",
    "groups": [
      3,
      3,
      4
    ]
  },
  {
    "iso2": "JM",
    "name": "Jamaica",
    "dialCode": "1",
    "currency": "JMD",
    "nationalLength": 10,
    "flag": "🇯🇲",
    "groups": null
  },
  {
    "iso2": "JP",
    "name": "Japan",
    "dialCode": "81",
    "currency": "JPY",
    "nationalLength": 10,
    "flag": "🇯🇵",
    "groups": [
      2,
      4,
      4
    ]
  },
  {
    "iso2": "JE",
    "name": "Jersey",
    "dialCode": "44",
    "currency": "GBP",
    "nationalLength": 10,
    "flag": "🇯🇪",
    "groups": null
  },
  {
    "iso2": "JO",
    "name": "Jordan",
    "dialCode": "962",
    "currency": "JOD",
    "nationalLength": 9,
    "flag": "🇯🇴",
    "groups": null
  },
  {
    "iso2": "KZ",
    "name": "Kazakhstan",
    "dialCode": "7",
    "currency": "KZT",
    "nationalLength": 10,
    "flag": "🇰🇿",
    "groups": null
  },
  {
    "iso2": "KE",
    "name": "Kenya",
    "dialCode": "254",
    "currency": "KES",
    "nationalLength": 9,
    "flag": "🇰🇪",
    "groups": [
      3,
      3,
      3
    ]
  },
  {
    "iso2": "KI",
    "name": "Kiribati",
    "dialCode": "686",
    "currency": "AUD",
    "nationalLength": 8,
    "flag": "🇰🇮",
    "groups": null
  },
  {
    "iso2": "XK",
    "name": "Kosovo",
    "dialCode": "383",
    "currency": "EUR",
    "nationalLength": 8,
    "flag": "🇽🇰",
    "groups": null
  },
  {
    "iso2": "KW",
    "name": "Kuwait",
    "dialCode": "965",
    "currency": "KWD",
    "nationalLength": 8,
    "flag": "🇰🇼",
    "groups": null
  },
  {
    "iso2": "KG",
    "name": "Kyrgyzstan",
    "dialCode": "996",
    "currency": "KGS",
    "nationalLength": 9,
    "flag": "🇰🇬",
    "groups": null
  },
  {
    "iso2": "LA",
    "name": "Laos",
    "dialCode": "856",
    "currency": "LAK",
    "nationalLength": 10,
    "flag": "🇱🇦",
    "groups": null
  },
  {
    "iso2": "LV",
    "name": "Latvia",
    "dialCode": "371",
    "currency": "EUR",
    "nationalLength": 8,
    "flag": "🇱🇻",
    "groups": null
  },
  {
    "iso2": "LB",
    "name": "Lebanon",
    "dialCode": "961",
    "currency": "LBP",
    "nationalLength": 8,
    "flag": "🇱🇧",
    "groups": null
  },
  {
    "iso2": "LS",
    "name": "Lesotho",
    "dialCode": "266",
    "currency": "LSL",
    "nationalLength": 8,
    "flag": "🇱🇸",
    "groups": null
  },
  {
    "iso2": "LR",
    "name": "Liberia",
    "dialCode": "231",
    "currency": "LRD",
    "nationalLength": 7,
    "flag": "🇱🇷",
    "groups": null
  },
  {
    "iso2": "LY",
    "name": "Libya",
    "dialCode": "218",
    "currency": "LYD",
    "nationalLength": 9,
    "flag": "🇱🇾",
    "groups": null
  },
  {
    "iso2": "LI",
    "name": "Liechtenstein",
    "dialCode": "423",
    "currency": "CHF",
    "nationalLength": 7,
    "flag": "🇱🇮",
    "groups": null
  },
  {
    "iso2": "LT",
    "name": "Lithuania",
    "dialCode": "370",
    "currency": "EUR",
    "nationalLength": 8,
    "flag": "🇱🇹",
    "groups": null
  },
  {
    "iso2": "LU",
    "name": "Luxembourg",
    "dialCode": "352",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇱🇺",
    "groups": null
  },
  {
    "iso2": "MO",
    "name": "Macao",
    "dialCode": "853",
    "currency": "MOP",
    "nationalLength": 8,
    "flag": "🇲🇴",
    "groups": null
  },
  {
    "iso2": "MG",
    "name": "Madagascar",
    "dialCode": "261",
    "currency": "MGA",
    "nationalLength": 9,
    "flag": "🇲🇬",
    "groups": null
  },
  {
    "iso2": "MW",
    "name": "Malawi",
    "dialCode": "265",
    "currency": "MWK",
    "nationalLength": 9,
    "flag": "🇲🇼",
    "groups": null
  },
  {
    "iso2": "MY",
    "name": "Malaysia",
    "dialCode": "60",
    "currency": "MYR",
    "nationalLength": 9,
    "flag": "🇲🇾",
    "groups": [
      2,
      3,
      4
    ]
  },
  {
    "iso2": "MV",
    "name": "Maldives",
    "dialCode": "960",
    "currency": "MVR",
    "nationalLength": 7,
    "flag": "🇲🇻",
    "groups": null
  },
  {
    "iso2": "ML",
    "name": "Mali",
    "dialCode": "223",
    "currency": "XOF",
    "nationalLength": 8,
    "flag": "🇲🇱",
    "groups": null
  },
  {
    "iso2": "MT",
    "name": "Malta",
    "dialCode": "356",
    "currency": "EUR",
    "nationalLength": 8,
    "flag": "🇲🇹",
    "groups": null
  },
  {
    "iso2": "MH",
    "name": "Marshall Islands",
    "dialCode": "692",
    "currency": "USD",
    "nationalLength": 7,
    "flag": "🇲🇭",
    "groups": null
  },
  {
    "iso2": "MQ",
    "name": "Martinique",
    "dialCode": "596",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇲🇶",
    "groups": null
  },
  {
    "iso2": "MR",
    "name": "Mauritania",
    "dialCode": "222",
    "currency": "MRU",
    "nationalLength": 8,
    "flag": "🇲🇷",
    "groups": null
  },
  {
    "iso2": "MU",
    "name": "Mauritius",
    "dialCode": "230",
    "currency": "MUR",
    "nationalLength": 8,
    "flag": "🇲🇺",
    "groups": null
  },
  {
    "iso2": "YT",
    "name": "Mayotte",
    "dialCode": "262",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇾🇹",
    "groups": null
  },
  {
    "iso2": "MX",
    "name": "Mexico",
    "dialCode": "52",
    "currency": "MXN",
    "nationalLength": 10,
    "flag": "🇲🇽",
    "groups": [
      3,
      3,
      4
    ]
  },
  {
    "iso2": "FM",
    "name": "Micronesia",
    "dialCode": "691",
    "currency": "USD",
    "nationalLength": 7,
    "flag": "🇫🇲",
    "groups": null
  },
  {
    "iso2": "MD",
    "name": "Moldova",
    "dialCode": "373",
    "currency": "MDL",
    "nationalLength": 8,
    "flag": "🇲🇩",
    "groups": null
  },
  {
    "iso2": "MC",
    "name": "Monaco",
    "dialCode": "377",
    "currency": "EUR",
    "nationalLength": 8,
    "flag": "🇲🇨",
    "groups": null
  },
  {
    "iso2": "MN",
    "name": "Mongolia",
    "dialCode": "976",
    "currency": "MNT",
    "nationalLength": 8,
    "flag": "🇲🇳",
    "groups": null
  },
  {
    "iso2": "ME",
    "name": "Montenegro",
    "dialCode": "382",
    "currency": "EUR",
    "nationalLength": 8,
    "flag": "🇲🇪",
    "groups": null
  },
  {
    "iso2": "MS",
    "name": "Montserrat",
    "dialCode": "1",
    "currency": "XCD",
    "nationalLength": 10,
    "flag": "🇲🇸",
    "groups": null
  },
  {
    "iso2": "MA",
    "name": "Morocco",
    "dialCode": "212",
    "currency": "MAD",
    "nationalLength": 9,
    "flag": "🇲🇦",
    "groups": null
  },
  {
    "iso2": "MZ",
    "name": "Mozambique",
    "dialCode": "258",
    "currency": "MZN",
    "nationalLength": 9,
    "flag": "🇲🇿",
    "groups": null
  },
  {
    "iso2": "MM",
    "name": "Myanmar",
    "dialCode": "95",
    "currency": "MMK",
    "nationalLength": 9,
    "flag": "🇲🇲",
    "groups": null
  },
  {
    "iso2": "NA",
    "name": "Namibia",
    "dialCode": "264",
    "currency": "NAD",
    "nationalLength": 9,
    "flag": "🇳🇦",
    "groups": null
  },
  {
    "iso2": "NR",
    "name": "Nauru",
    "dialCode": "674",
    "currency": "AUD",
    "nationalLength": 7,
    "flag": "🇳🇷",
    "groups": null
  },
  {
    "iso2": "NP",
    "name": "Nepal",
    "dialCode": "977",
    "currency": "NPR",
    "nationalLength": 10,
    "flag": "🇳🇵",
    "groups": null
  },
  {
    "iso2": "NL",
    "name": "Netherlands",
    "dialCode": "31",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇳🇱",
    "groups": [
      2,
      3,
      4
    ]
  },
  {
    "iso2": "NC",
    "name": "New Caledonia",
    "dialCode": "687",
    "currency": "XPF",
    "nationalLength": 6,
    "flag": "🇳🇨",
    "groups": null
  },
  {
    "iso2": "NZ",
    "name": "New Zealand",
    "dialCode": "64",
    "currency": "NZD",
    "nationalLength": 9,
    "flag": "🇳🇿",
    "groups": [
      2,
      3,
      4
    ]
  },
  {
    "iso2": "NI",
    "name": "Nicaragua",
    "dialCode": "505",
    "currency": "NIO",
    "nationalLength": 8,
    "flag": "🇳🇮",
    "groups": null
  },
  {
    "iso2": "NE",
    "name": "Niger",
    "dialCode": "227",
    "currency": "XOF",
    "nationalLength": 8,
    "flag": "🇳🇪",
    "groups": null
  },
  {
    "iso2": "NG",
    "name": "Nigeria",
    "dialCode": "234",
    "currency": "NGN",
    "nationalLength": 10,
    "flag": "🇳🇬",
    "groups": [
      3,
      3,
      4
    ]
  },
  {
    "iso2": "NU",
    "name": "Niue",
    "dialCode": "683",
    "currency": "NZD",
    "nationalLength": 4,
    "flag": "🇳🇺",
    "groups": null
  },
  {
    "iso2": "NF",
    "name": "Norfolk Island",
    "dialCode": "672",
    "currency": "AUD",
    "nationalLength": 5,
    "flag": "🇳🇫",
    "groups": null
  },
  {
    "iso2": "KP",
    "name": "North Korea",
    "dialCode": "850",
    "currency": "KPW",
    "nationalLength": 10,
    "flag": "🇰🇵",
    "groups": null
  },
  {
    "iso2": "MK",
    "name": "North Macedonia",
    "dialCode": "389",
    "currency": "MKD",
    "nationalLength": 8,
    "flag": "🇲🇰",
    "groups": null
  },
  {
    "iso2": "MP",
    "name": "Northern Mariana Islands",
    "dialCode": "1",
    "currency": "USD",
    "nationalLength": 10,
    "flag": "🇲🇵",
    "groups": null
  },
  {
    "iso2": "NO",
    "name": "Norway",
    "dialCode": "47",
    "currency": "NOK",
    "nationalLength": 8,
    "flag": "🇳🇴",
    "groups": [
      2,
      2,
      2,
      2
    ]
  },
  {
    "iso2": "OM",
    "name": "Oman",
    "dialCode": "968",
    "currency": "OMR",
    "nationalLength": 8,
    "flag": "🇴🇲",
    "groups": null
  },
  {
    "iso2": "PK",
    "name": "Pakistan",
    "dialCode": "92",
    "currency": "PKR",
    "nationalLength": 10,
    "flag": "🇵🇰",
    "groups": [
      3,
      7
    ]
  },
  {
    "iso2": "PW",
    "name": "Palau",
    "dialCode": "680",
    "currency": "USD",
    "nationalLength": 7,
    "flag": "🇵🇼",
    "groups": null
  },
  {
    "iso2": "PS",
    "name": "Palestine",
    "dialCode": "970",
    "currency": "ILS",
    "nationalLength": 9,
    "flag": "🇵🇸",
    "groups": null
  },
  {
    "iso2": "PA",
    "name": "Panama",
    "dialCode": "507",
    "currency": "PAB",
    "nationalLength": 8,
    "flag": "🇵🇦",
    "groups": null
  },
  {
    "iso2": "PG",
    "name": "Papua New Guinea",
    "dialCode": "675",
    "currency": "PGK",
    "nationalLength": 8,
    "flag": "🇵🇬",
    "groups": null
  },
  {
    "iso2": "PY",
    "name": "Paraguay",
    "dialCode": "595",
    "currency": "PYG",
    "nationalLength": 9,
    "flag": "🇵🇾",
    "groups": null
  },
  {
    "iso2": "PE",
    "name": "Peru",
    "dialCode": "51",
    "currency": "PEN",
    "nationalLength": 9,
    "flag": "🇵🇪",
    "groups": null
  },
  {
    "iso2": "PH",
    "name": "Philippines",
    "dialCode": "63",
    "currency": "PHP",
    "nationalLength": 10,
    "flag": "🇵🇭",
    "groups": [
      3,
      3,
      4
    ]
  },
  {
    "iso2": "PL",
    "name": "Poland",
    "dialCode": "48",
    "currency": "PLN",
    "nationalLength": 9,
    "flag": "🇵🇱",
    "groups": [
      3,
      3,
      3
    ]
  },
  {
    "iso2": "PT",
    "name": "Portugal",
    "dialCode": "351",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇵🇹",
    "groups": null
  },
  {
    "iso2": "PR",
    "name": "Puerto Rico",
    "dialCode": "1",
    "currency": "USD",
    "nationalLength": 10,
    "flag": "🇵🇷",
    "groups": null
  },
  {
    "iso2": "QA",
    "name": "Qatar",
    "dialCode": "974",
    "currency": "QAR",
    "nationalLength": 8,
    "flag": "🇶🇦",
    "groups": null
  },
  {
    "iso2": "RE",
    "name": "Réunion",
    "dialCode": "262",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇷🇪",
    "groups": null
  },
  {
    "iso2": "RO",
    "name": "Romania",
    "dialCode": "40",
    "currency": "RON",
    "nationalLength": 9,
    "flag": "🇷🇴",
    "groups": null
  },
  {
    "iso2": "RU",
    "name": "Russia",
    "dialCode": "7",
    "currency": "RUB",
    "nationalLength": 10,
    "flag": "🇷🇺",
    "groups": [
      3,
      3,
      2,
      2
    ]
  },
  {
    "iso2": "RW",
    "name": "Rwanda",
    "dialCode": "250",
    "currency": "RWF",
    "nationalLength": 9,
    "flag": "🇷🇼",
    "groups": null
  },
  {
    "iso2": "BL",
    "name": "Saint Barthélemy",
    "dialCode": "590",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇧🇱",
    "groups": null
  },
  {
    "iso2": "SH",
    "name": "Saint Helena",
    "dialCode": "290",
    "currency": "SHP",
    "nationalLength": 4,
    "flag": "🇸🇭",
    "groups": null
  },
  {
    "iso2": "KN",
    "name": "Saint Kitts and Nevis",
    "dialCode": "1",
    "currency": "XCD",
    "nationalLength": 10,
    "flag": "🇰🇳",
    "groups": null
  },
  {
    "iso2": "LC",
    "name": "Saint Lucia",
    "dialCode": "1",
    "currency": "XCD",
    "nationalLength": 10,
    "flag": "🇱🇨",
    "groups": null
  },
  {
    "iso2": "MF",
    "name": "Saint Martin",
    "dialCode": "590",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇲🇫",
    "groups": null
  },
  {
    "iso2": "PM",
    "name": "Saint Pierre and Miquelon",
    "dialCode": "508",
    "currency": "EUR",
    "nationalLength": 6,
    "flag": "🇵🇲",
    "groups": null
  },
  {
    "iso2": "VC",
    "name": "Saint Vincent and the Grenadines",
    "dialCode": "1",
    "currency": "XCD",
    "nationalLength": 10,
    "flag": "🇻🇨",
    "groups": null
  },
  {
    "iso2": "WS",
    "name": "Samoa",
    "dialCode": "685",
    "currency": "WST",
    "nationalLength": 7,
    "flag": "🇼🇸",
    "groups": null
  },
  {
    "iso2": "SM",
    "name": "San Marino",
    "dialCode": "378",
    "currency": "EUR",
    "nationalLength": 10,
    "flag": "🇸🇲",
    "groups": null
  },
  {
    "iso2": "ST",
    "name": "São Tomé and Príncipe",
    "dialCode": "239",
    "currency": "STN",
    "nationalLength": 7,
    "flag": "🇸🇹",
    "groups": null
  },
  {
    "iso2": "SA",
    "name": "Saudi Arabia",
    "dialCode": "966",
    "currency": "SAR",
    "nationalLength": 9,
    "flag": "🇸🇦",
    "groups": [
      2,
      3,
      4
    ]
  },
  {
    "iso2": "SN",
    "name": "Senegal",
    "dialCode": "221",
    "currency": "XOF",
    "nationalLength": 9,
    "flag": "🇸🇳",
    "groups": null
  },
  {
    "iso2": "RS",
    "name": "Serbia",
    "dialCode": "381",
    "currency": "RSD",
    "nationalLength": 9,
    "flag": "🇷🇸",
    "groups": null
  },
  {
    "iso2": "SC",
    "name": "Seychelles",
    "dialCode": "248",
    "currency": "SCR",
    "nationalLength": 7,
    "flag": "🇸🇨",
    "groups": null
  },
  {
    "iso2": "SL",
    "name": "Sierra Leone",
    "dialCode": "232",
    "currency": "SLE",
    "nationalLength": 8,
    "flag": "🇸🇱",
    "groups": null
  },
  {
    "iso2": "SG",
    "name": "Singapore",
    "dialCode": "65",
    "currency": "SGD",
    "nationalLength": 8,
    "flag": "🇸🇬",
    "groups": [
      4,
      4
    ]
  },
  {
    "iso2": "SX",
    "name": "Sint Maarten",
    "dialCode": "1",
    "currency": "ANG",
    "nationalLength": 10,
    "flag": "🇸🇽",
    "groups": null
  },
  {
    "iso2": "SK",
    "name": "Slovakia",
    "dialCode": "421",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇸🇰",
    "groups": null
  },
  {
    "iso2": "SI",
    "name": "Slovenia",
    "dialCode": "386",
    "currency": "EUR",
    "nationalLength": 8,
    "flag": "🇸🇮",
    "groups": null
  },
  {
    "iso2": "SB",
    "name": "Solomon Islands",
    "dialCode": "677",
    "currency": "SBD",
    "nationalLength": 7,
    "flag": "🇸🇧",
    "groups": null
  },
  {
    "iso2": "SO",
    "name": "Somalia",
    "dialCode": "252",
    "currency": "SOS",
    "nationalLength": 8,
    "flag": "🇸🇴",
    "groups": null
  },
  {
    "iso2": "ZA",
    "name": "South Africa",
    "dialCode": "27",
    "currency": "ZAR",
    "nationalLength": 9,
    "flag": "🇿🇦",
    "groups": [
      2,
      3,
      4
    ]
  },
  {
    "iso2": "KR",
    "name": "South Korea",
    "dialCode": "82",
    "currency": "KRW",
    "nationalLength": 10,
    "flag": "🇰🇷",
    "groups": [
      2,
      4,
      4
    ]
  },
  {
    "iso2": "SS",
    "name": "South Sudan",
    "dialCode": "211",
    "currency": "SSP",
    "nationalLength": 9,
    "flag": "🇸🇸",
    "groups": null
  },
  {
    "iso2": "ES",
    "name": "Spain",
    "dialCode": "34",
    "currency": "EUR",
    "nationalLength": 9,
    "flag": "🇪🇸",
    "groups": [
      3,
      3,
      3
    ]
  },
  {
    "iso2": "LK",
    "name": "Sri Lanka",
    "dialCode": "94",
    "currency": "LKR",
    "nationalLength": 9,
    "flag": "🇱🇰",
    "groups": null
  },
  {
    "iso2": "SD",
    "name": "Sudan",
    "dialCode": "249",
    "currency": "SDG",
    "nationalLength": 9,
    "flag": "🇸🇩",
    "groups": null
  },
  {
    "iso2": "SR",
    "name": "Suriname",
    "dialCode": "597",
    "currency": "SRD",
    "nationalLength": 7,
    "flag": "🇸🇷",
    "groups": null
  },
  {
    "iso2": "SE",
    "name": "Sweden",
    "dialCode": "46",
    "currency": "SEK",
    "nationalLength": 9,
    "flag": "🇸🇪",
    "groups": [
      2,
      3,
      3
    ]
  },
  {
    "iso2": "CH",
    "name": "Switzerland",
    "dialCode": "41",
    "currency": "CHF",
    "nationalLength": 9,
    "flag": "🇨🇭",
    "groups": [
      2,
      3,
      2,
      2
    ]
  },
  {
    "iso2": "SY",
    "name": "Syria",
    "dialCode": "963",
    "currency": "SYP",
    "nationalLength": 9,
    "flag": "🇸🇾",
    "groups": null
  },
  {
    "iso2": "TW",
    "name": "Taiwan",
    "dialCode": "886",
    "currency": "TWD",
    "nationalLength": 9,
    "flag": "🇹🇼",
    "groups": null
  },
  {
    "iso2": "TJ",
    "name": "Tajikistan",
    "dialCode": "992",
    "currency": "TJS",
    "nationalLength": 9,
    "flag": "🇹🇯",
    "groups": null
  },
  {
    "iso2": "TZ",
    "name": "Tanzania",
    "dialCode": "255",
    "currency": "TZS",
    "nationalLength": 9,
    "flag": "🇹🇿",
    "groups": null
  },
  {
    "iso2": "TH",
    "name": "Thailand",
    "dialCode": "66",
    "currency": "THB",
    "nationalLength": 9,
    "flag": "🇹🇭",
    "groups": [
      2,
      3,
      4
    ]
  },
  {
    "iso2": "TL",
    "name": "Timor-Leste",
    "dialCode": "670",
    "currency": "USD",
    "nationalLength": 8,
    "flag": "🇹🇱",
    "groups": null
  },
  {
    "iso2": "TG",
    "name": "Togo",
    "dialCode": "228",
    "currency": "XOF",
    "nationalLength": 8,
    "flag": "🇹🇬",
    "groups": null
  },
  {
    "iso2": "TK",
    "name": "Tokelau",
    "dialCode": "690",
    "currency": "NZD",
    "nationalLength": 4,
    "flag": "🇹🇰",
    "groups": null
  },
  {
    "iso2": "TO",
    "name": "Tonga",
    "dialCode": "676",
    "currency": "TOP",
    "nationalLength": 5,
    "flag": "🇹🇴",
    "groups": null
  },
  {
    "iso2": "TT",
    "name": "Trinidad and Tobago",
    "dialCode": "1",
    "currency": "TTD",
    "nationalLength": 10,
    "flag": "🇹🇹",
    "groups": null
  },
  {
    "iso2": "TN",
    "name": "Tunisia",
    "dialCode": "216",
    "currency": "TND",
    "nationalLength": 8,
    "flag": "🇹🇳",
    "groups": null
  },
  {
    "iso2": "TR",
    "name": "Türkiye",
    "dialCode": "90",
    "currency": "TRY",
    "nationalLength": 10,
    "flag": "🇹🇷",
    "groups": [
      3,
      3,
      4
    ]
  },
  {
    "iso2": "TM",
    "name": "Turkmenistan",
    "dialCode": "993",
    "currency": "TMT",
    "nationalLength": 8,
    "flag": "🇹🇲",
    "groups": null
  },
  {
    "iso2": "TC",
    "name": "Turks and Caicos Islands",
    "dialCode": "1",
    "currency": "USD",
    "nationalLength": 10,
    "flag": "🇹🇨",
    "groups": null
  },
  {
    "iso2": "TV",
    "name": "Tuvalu",
    "dialCode": "688",
    "currency": "AUD",
    "nationalLength": 5,
    "flag": "🇹🇻",
    "groups": null
  },
  {
    "iso2": "VI",
    "name": "U.S. Virgin Islands",
    "dialCode": "1",
    "currency": "USD",
    "nationalLength": 10,
    "flag": "🇻🇮",
    "groups": null
  },
  {
    "iso2": "UG",
    "name": "Uganda",
    "dialCode": "256",
    "currency": "UGX",
    "nationalLength": 9,
    "flag": "🇺🇬",
    "groups": null
  },
  {
    "iso2": "UA",
    "name": "Ukraine",
    "dialCode": "380",
    "currency": "UAH",
    "nationalLength": 9,
    "flag": "🇺🇦",
    "groups": [
      2,
      3,
      2,
      2
    ]
  },
  {
    "iso2": "AE",
    "name": "United Arab Emirates",
    "dialCode": "971",
    "currency": "AED",
    "nationalLength": 9,
    "flag": "🇦🇪",
    "groups": [
      2,
      3,
      4
    ]
  },
  {
    "iso2": "GB",
    "name": "United Kingdom",
    "dialCode": "44",
    "currency": "GBP",
    "nationalLength": 10,
    "flag": "🇬🇧",
    "groups": [
      4,
      3,
      3
    ]
  },
  {
    "iso2": "US",
    "name": "United States",
    "dialCode": "1",
    "currency": "USD",
    "nationalLength": 10,
    "flag": "🇺🇸",
    "groups": [
      3,
      3,
      4
    ]
  },
  {
    "iso2": "UY",
    "name": "Uruguay",
    "dialCode": "598",
    "currency": "UYU",
    "nationalLength": 8,
    "flag": "🇺🇾",
    "groups": null
  },
  {
    "iso2": "UZ",
    "name": "Uzbekistan",
    "dialCode": "998",
    "currency": "UZS",
    "nationalLength": 9,
    "flag": "🇺🇿",
    "groups": null
  },
  {
    "iso2": "VU",
    "name": "Vanuatu",
    "dialCode": "678",
    "currency": "VUV",
    "nationalLength": 7,
    "flag": "🇻🇺",
    "groups": null
  },
  {
    "iso2": "VA",
    "name": "Vatican City",
    "dialCode": "39",
    "currency": "EUR",
    "nationalLength": 10,
    "flag": "🇻🇦",
    "groups": null
  },
  {
    "iso2": "VE",
    "name": "Venezuela",
    "dialCode": "58",
    "currency": "VES",
    "nationalLength": 10,
    "flag": "🇻🇪",
    "groups": null
  },
  {
    "iso2": "VN",
    "name": "Vietnam",
    "dialCode": "84",
    "currency": "VND",
    "nationalLength": 10,
    "flag": "🇻🇳",
    "groups": [
      3,
      3,
      4
    ]
  },
  {
    "iso2": "WF",
    "name": "Wallis and Futuna",
    "dialCode": "681",
    "currency": "XPF",
    "nationalLength": 6,
    "flag": "🇼🇫",
    "groups": null
  },
  {
    "iso2": "EH",
    "name": "Western Sahara",
    "dialCode": "212",
    "currency": "MAD",
    "nationalLength": 9,
    "flag": "🇪🇭",
    "groups": null
  },
  {
    "iso2": "YE",
    "name": "Yemen",
    "dialCode": "967",
    "currency": "YER",
    "nationalLength": 9,
    "flag": "🇾🇪",
    "groups": null
  },
  {
    "iso2": "ZM",
    "name": "Zambia",
    "dialCode": "260",
    "currency": "ZMW",
    "nationalLength": 9,
    "flag": "🇿🇲",
    "groups": null
  },
  {
    "iso2": "ZW",
    "name": "Zimbabwe",
    "dialCode": "263",
    "currency": "ZWG",
    "nationalLength": 9,
    "flag": "🇿🇼",
    "groups": null
  }
];

export const CURRENCIES: CurrencyRecord[] = [
  {
    "code": "AED",
    "name": "United Arab Emirates Dirham",
    "countries": [
      "AE"
    ],
    "symbol": "AED",
    "decimals": 2
  },
  {
    "code": "AFN",
    "name": "Afghan Afghani",
    "countries": [
      "AF"
    ],
    "symbol": "؋",
    "decimals": 0
  },
  {
    "code": "ALL",
    "name": "Albanian Lek",
    "countries": [
      "AL"
    ],
    "symbol": "ALL",
    "decimals": 0
  },
  {
    "code": "AMD",
    "name": "Armenian Dram",
    "countries": [
      "AM"
    ],
    "symbol": "֏",
    "decimals": 2
  },
  {
    "code": "ANG",
    "name": "Netherlands Antillean Guilder",
    "countries": [
      "CW",
      "SX"
    ],
    "symbol": "ANG",
    "decimals": 2
  },
  {
    "code": "AOA",
    "name": "Angolan Kwanza",
    "countries": [
      "AO"
    ],
    "symbol": "Kz",
    "decimals": 2
  },
  {
    "code": "ARS",
    "name": "Argentine Peso",
    "countries": [
      "AR"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "AUD",
    "name": "Australian Dollar",
    "countries": [
      "AU",
      "CX",
      "CC",
      "KI",
      "NR",
      "NF",
      "TV"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "AWG",
    "name": "Aruban Florin",
    "countries": [
      "AW"
    ],
    "symbol": "AWG",
    "decimals": 2
  },
  {
    "code": "AZN",
    "name": "Azerbaijani Manat",
    "countries": [
      "AZ"
    ],
    "symbol": "₼",
    "decimals": 2
  },
  {
    "code": "BAM",
    "name": "Bosnia-Herzegovina Convertible Mark",
    "countries": [
      "BA"
    ],
    "symbol": "KM",
    "decimals": 2
  },
  {
    "code": "BBD",
    "name": "Barbadian Dollar",
    "countries": [
      "BB"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "BDT",
    "name": "Bangladeshi Taka",
    "countries": [
      "BD"
    ],
    "symbol": "৳",
    "decimals": 2
  },
  {
    "code": "BGN",
    "name": "Bulgarian Lev",
    "countries": [
      "BG"
    ],
    "symbol": "BGN",
    "decimals": 2
  },
  {
    "code": "BHD",
    "name": "Bahraini Dinar",
    "countries": [
      "BH"
    ],
    "symbol": "BHD",
    "decimals": 3
  },
  {
    "code": "BIF",
    "name": "Burundian Franc",
    "countries": [
      "BI"
    ],
    "symbol": "BIF",
    "decimals": 0
  },
  {
    "code": "BMD",
    "name": "Bermudan Dollar",
    "countries": [
      "BM"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "BND",
    "name": "Brunei Dollar",
    "countries": [
      "BN"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "BOB",
    "name": "Bolivian Boliviano",
    "countries": [
      "BO"
    ],
    "symbol": "Bs",
    "decimals": 2
  },
  {
    "code": "BRL",
    "name": "Brazilian Real",
    "countries": [
      "BR"
    ],
    "symbol": "R$",
    "decimals": 2
  },
  {
    "code": "BSD",
    "name": "Bahamian Dollar",
    "countries": [
      "BS"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "BTN",
    "name": "Bhutanese Ngultrum",
    "countries": [
      "BT"
    ],
    "symbol": "BTN",
    "decimals": 2
  },
  {
    "code": "BWP",
    "name": "Botswanan Pula",
    "countries": [
      "BW"
    ],
    "symbol": "P",
    "decimals": 2
  },
  {
    "code": "BYN",
    "name": "Belarusian Ruble",
    "countries": [
      "BY"
    ],
    "symbol": "BYN",
    "decimals": 2
  },
  {
    "code": "BZD",
    "name": "Belize Dollar",
    "countries": [
      "BZ"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "CAD",
    "name": "Canadian Dollar",
    "countries": [
      "CA"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "CDF",
    "name": "Congolese Franc",
    "countries": [
      "CD"
    ],
    "symbol": "CDF",
    "decimals": 2
  },
  {
    "code": "CHF",
    "name": "Swiss Franc",
    "countries": [
      "LI",
      "CH"
    ],
    "symbol": "CHF",
    "decimals": 2
  },
  {
    "code": "CLP",
    "name": "Chilean Peso",
    "countries": [
      "CL"
    ],
    "symbol": "$",
    "decimals": 0
  },
  {
    "code": "CNY",
    "name": "Chinese Yuan",
    "countries": [
      "CN"
    ],
    "symbol": "¥",
    "decimals": 2
  },
  {
    "code": "COP",
    "name": "Colombian Peso",
    "countries": [
      "CO"
    ],
    "symbol": "$",
    "decimals": 0
  },
  {
    "code": "CRC",
    "name": "Costa Rican Colón",
    "countries": [
      "CR"
    ],
    "symbol": "₡",
    "decimals": 2
  },
  {
    "code": "CUP",
    "name": "Cuban Peso",
    "countries": [
      "CU"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "CVE",
    "name": "Cape Verdean Escudo",
    "countries": [
      "CV"
    ],
    "symbol": "CVE",
    "decimals": 2
  },
  {
    "code": "CZK",
    "name": "Czech Koruna",
    "countries": [
      "CZ"
    ],
    "symbol": "Kč",
    "decimals": 2
  },
  {
    "code": "DJF",
    "name": "Djiboutian Franc",
    "countries": [
      "DJ"
    ],
    "symbol": "DJF",
    "decimals": 0
  },
  {
    "code": "DKK",
    "name": "Danish Krone",
    "countries": [
      "DK",
      "FO",
      "GL"
    ],
    "symbol": "kr",
    "decimals": 2
  },
  {
    "code": "DOP",
    "name": "Dominican Peso",
    "countries": [
      "DO"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "DZD",
    "name": "Algerian Dinar",
    "countries": [
      "DZ"
    ],
    "symbol": "DZD",
    "decimals": 2
  },
  {
    "code": "EGP",
    "name": "Egyptian Pound",
    "countries": [
      "EG"
    ],
    "symbol": "E£",
    "decimals": 2
  },
  {
    "code": "ERN",
    "name": "Eritrean Nakfa",
    "countries": [
      "ER"
    ],
    "symbol": "ERN",
    "decimals": 2
  },
  {
    "code": "ETB",
    "name": "Ethiopian Birr",
    "countries": [
      "ET"
    ],
    "symbol": "ETB",
    "decimals": 2
  },
  {
    "code": "EUR",
    "name": "Euro",
    "countries": [
      "AD",
      "AT",
      "BE",
      "HR",
      "CY",
      "EE",
      "FI",
      "FR",
      "GF",
      "DE",
      "GR",
      "GP",
      "IE",
      "IT",
      "XK",
      "LV",
      "LT",
      "LU",
      "MT",
      "MQ",
      "YT",
      "MC",
      "ME",
      "NL",
      "PT",
      "RE",
      "BL",
      "MF",
      "PM",
      "SM",
      "SK",
      "SI",
      "ES",
      "VA"
    ],
    "symbol": "€",
    "decimals": 2
  },
  {
    "code": "FJD",
    "name": "Fijian Dollar",
    "countries": [
      "FJ"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "FKP",
    "name": "Falkland Islands Pound",
    "countries": [
      "FK"
    ],
    "symbol": "£",
    "decimals": 2
  },
  {
    "code": "GBP",
    "name": "British Pound",
    "countries": [
      "GG",
      "IM",
      "JE",
      "GB"
    ],
    "symbol": "£",
    "decimals": 2
  },
  {
    "code": "GEL",
    "name": "Georgian Lari",
    "countries": [
      "GE"
    ],
    "symbol": "₾",
    "decimals": 2
  },
  {
    "code": "GHS",
    "name": "Ghanaian Cedi",
    "countries": [
      "GH"
    ],
    "symbol": "GH₵",
    "decimals": 2
  },
  {
    "code": "GIP",
    "name": "Gibraltar Pound",
    "countries": [
      "GI"
    ],
    "symbol": "£",
    "decimals": 2
  },
  {
    "code": "GMD",
    "name": "Gambian Dalasi",
    "countries": [
      "GM"
    ],
    "symbol": "GMD",
    "decimals": 2
  },
  {
    "code": "GNF",
    "name": "Guinean Franc",
    "countries": [
      "GN"
    ],
    "symbol": "FG",
    "decimals": 0
  },
  {
    "code": "GTQ",
    "name": "Guatemalan Quetzal",
    "countries": [
      "GT"
    ],
    "symbol": "Q",
    "decimals": 2
  },
  {
    "code": "GYD",
    "name": "Guyanaese Dollar",
    "countries": [
      "GY"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "HKD",
    "name": "Hong Kong Dollar",
    "countries": [
      "HK"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "HNL",
    "name": "Honduran Lempira",
    "countries": [
      "HN"
    ],
    "symbol": "L",
    "decimals": 2
  },
  {
    "code": "HTG",
    "name": "Haitian Gourde",
    "countries": [
      "HT"
    ],
    "symbol": "HTG",
    "decimals": 2
  },
  {
    "code": "HUF",
    "name": "Hungarian Forint",
    "countries": [
      "HU"
    ],
    "symbol": "Ft",
    "decimals": 0
  },
  {
    "code": "IDR",
    "name": "Indonesian Rupiah",
    "countries": [
      "ID"
    ],
    "symbol": "Rp",
    "decimals": 0
  },
  {
    "code": "ILS",
    "name": "Israeli New Shekel",
    "countries": [
      "IL",
      "PS"
    ],
    "symbol": "₪",
    "decimals": 2
  },
  {
    "code": "INR",
    "name": "Indian Rupee",
    "countries": [
      "IN"
    ],
    "symbol": "₹",
    "decimals": 2
  },
  {
    "code": "IQD",
    "name": "Iraqi Dinar",
    "countries": [
      "IQ"
    ],
    "symbol": "IQD",
    "decimals": 0
  },
  {
    "code": "IRR",
    "name": "Iranian Rial",
    "countries": [
      "IR"
    ],
    "symbol": "IRR",
    "decimals": 0
  },
  {
    "code": "ISK",
    "name": "Icelandic Króna",
    "countries": [
      "IS"
    ],
    "symbol": "kr",
    "decimals": 0
  },
  {
    "code": "JMD",
    "name": "Jamaican Dollar",
    "countries": [
      "JM"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "JOD",
    "name": "Jordanian Dinar",
    "countries": [
      "JO"
    ],
    "symbol": "JOD",
    "decimals": 3
  },
  {
    "code": "JPY",
    "name": "Japanese Yen",
    "countries": [
      "JP"
    ],
    "symbol": "¥",
    "decimals": 0
  },
  {
    "code": "KES",
    "name": "Kenyan Shilling",
    "countries": [
      "KE"
    ],
    "symbol": "KES",
    "decimals": 2
  },
  {
    "code": "KGS",
    "name": "Kyrgyz Som",
    "countries": [
      "KG"
    ],
    "symbol": "⃀",
    "decimals": 2
  },
  {
    "code": "KHR",
    "name": "Cambodian Riel",
    "countries": [
      "KH"
    ],
    "symbol": "៛",
    "decimals": 2
  },
  {
    "code": "KMF",
    "name": "Comorian Franc",
    "countries": [
      "KM"
    ],
    "symbol": "CF",
    "decimals": 0
  },
  {
    "code": "KPW",
    "name": "North Korean Won",
    "countries": [
      "KP"
    ],
    "symbol": "₩",
    "decimals": 0
  },
  {
    "code": "KRW",
    "name": "South Korean Won",
    "countries": [
      "KR"
    ],
    "symbol": "₩",
    "decimals": 0
  },
  {
    "code": "KWD",
    "name": "Kuwaiti Dinar",
    "countries": [
      "KW"
    ],
    "symbol": "KWD",
    "decimals": 3
  },
  {
    "code": "KYD",
    "name": "Cayman Islands Dollar",
    "countries": [
      "KY"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "KZT",
    "name": "Kazakhstani Tenge",
    "countries": [
      "KZ"
    ],
    "symbol": "₸",
    "decimals": 2
  },
  {
    "code": "LAK",
    "name": "Laotian Kip",
    "countries": [
      "LA"
    ],
    "symbol": "₭",
    "decimals": 0
  },
  {
    "code": "LBP",
    "name": "Lebanese Pound",
    "countries": [
      "LB"
    ],
    "symbol": "L£",
    "decimals": 0
  },
  {
    "code": "LKR",
    "name": "Sri Lankan Rupee",
    "countries": [
      "LK"
    ],
    "symbol": "Rs",
    "decimals": 2
  },
  {
    "code": "LRD",
    "name": "Liberian Dollar",
    "countries": [
      "LR"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "LSL",
    "name": "Lesotho Loti",
    "countries": [
      "LS"
    ],
    "symbol": "LSL",
    "decimals": 2
  },
  {
    "code": "LYD",
    "name": "Libyan Dinar",
    "countries": [
      "LY"
    ],
    "symbol": "LYD",
    "decimals": 3
  },
  {
    "code": "MAD",
    "name": "Moroccan Dirham",
    "countries": [
      "MA",
      "EH"
    ],
    "symbol": "MAD",
    "decimals": 2
  },
  {
    "code": "MDL",
    "name": "Moldovan Leu",
    "countries": [
      "MD"
    ],
    "symbol": "MDL",
    "decimals": 2
  },
  {
    "code": "MGA",
    "name": "Malagasy Ariary",
    "countries": [
      "MG"
    ],
    "symbol": "Ar",
    "decimals": 0
  },
  {
    "code": "MKD",
    "name": "Macedonian Denar",
    "countries": [
      "MK"
    ],
    "symbol": "MKD",
    "decimals": 2
  },
  {
    "code": "MMK",
    "name": "Myanmar Kyat",
    "countries": [
      "MM"
    ],
    "symbol": "K",
    "decimals": 0
  },
  {
    "code": "MNT",
    "name": "Mongolian Tugrik",
    "countries": [
      "MN"
    ],
    "symbol": "₮",
    "decimals": 2
  },
  {
    "code": "MOP",
    "name": "Macanese Pataca",
    "countries": [
      "MO"
    ],
    "symbol": "MOP",
    "decimals": 2
  },
  {
    "code": "MRU",
    "name": "Mauritanian Ouguiya",
    "countries": [
      "MR"
    ],
    "symbol": "MRU",
    "decimals": 2
  },
  {
    "code": "MUR",
    "name": "Mauritian Rupee",
    "countries": [
      "MU"
    ],
    "symbol": "Rs",
    "decimals": 2
  },
  {
    "code": "MVR",
    "name": "Maldivian Rufiyaa",
    "countries": [
      "MV"
    ],
    "symbol": "MVR",
    "decimals": 2
  },
  {
    "code": "MWK",
    "name": "Malawian Kwacha",
    "countries": [
      "MW"
    ],
    "symbol": "MWK",
    "decimals": 2
  },
  {
    "code": "MXN",
    "name": "Mexican Peso",
    "countries": [
      "MX"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "MYR",
    "name": "Malaysian Ringgit",
    "countries": [
      "MY"
    ],
    "symbol": "RM",
    "decimals": 2
  },
  {
    "code": "MZN",
    "name": "Mozambican Metical",
    "countries": [
      "MZ"
    ],
    "symbol": "MZN",
    "decimals": 2
  },
  {
    "code": "NAD",
    "name": "Namibian Dollar",
    "countries": [
      "NA"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "NGN",
    "name": "Nigerian Naira",
    "countries": [
      "NG"
    ],
    "symbol": "₦",
    "decimals": 2
  },
  {
    "code": "NIO",
    "name": "Nicaraguan Córdoba",
    "countries": [
      "NI"
    ],
    "symbol": "C$",
    "decimals": 2
  },
  {
    "code": "NOK",
    "name": "Norwegian Krone",
    "countries": [
      "NO"
    ],
    "symbol": "kr",
    "decimals": 2
  },
  {
    "code": "NPR",
    "name": "Nepalese Rupee",
    "countries": [
      "NP"
    ],
    "symbol": "Rs",
    "decimals": 2
  },
  {
    "code": "NZD",
    "name": "New Zealand Dollar",
    "countries": [
      "CK",
      "NZ",
      "NU",
      "TK"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "OMR",
    "name": "Omani Rial",
    "countries": [
      "OM"
    ],
    "symbol": "OMR",
    "decimals": 3
  },
  {
    "code": "PAB",
    "name": "Panamanian Balboa",
    "countries": [
      "PA"
    ],
    "symbol": "PAB",
    "decimals": 2
  },
  {
    "code": "PEN",
    "name": "Peruvian Sol",
    "countries": [
      "PE"
    ],
    "symbol": "PEN",
    "decimals": 2
  },
  {
    "code": "PGK",
    "name": "Papua New Guinean Kina",
    "countries": [
      "PG"
    ],
    "symbol": "PGK",
    "decimals": 2
  },
  {
    "code": "PHP",
    "name": "Philippine Peso",
    "countries": [
      "PH"
    ],
    "symbol": "₱",
    "decimals": 2
  },
  {
    "code": "PKR",
    "name": "Pakistani Rupee",
    "countries": [
      "PK"
    ],
    "symbol": "Rs",
    "decimals": 0
  },
  {
    "code": "PLN",
    "name": "Polish Zloty",
    "countries": [
      "PL"
    ],
    "symbol": "zł",
    "decimals": 2
  },
  {
    "code": "PYG",
    "name": "Paraguayan Guarani",
    "countries": [
      "PY"
    ],
    "symbol": "₲",
    "decimals": 0
  },
  {
    "code": "QAR",
    "name": "Qatari Riyal",
    "countries": [
      "QA"
    ],
    "symbol": "QAR",
    "decimals": 2
  },
  {
    "code": "RON",
    "name": "Romanian Leu",
    "countries": [
      "RO"
    ],
    "symbol": "lei",
    "decimals": 2
  },
  {
    "code": "RSD",
    "name": "Serbian Dinar",
    "countries": [
      "RS"
    ],
    "symbol": "RSD",
    "decimals": 2
  },
  {
    "code": "RUB",
    "name": "Russian Ruble",
    "countries": [
      "RU"
    ],
    "symbol": "₽",
    "decimals": 2
  },
  {
    "code": "RWF",
    "name": "Rwandan Franc",
    "countries": [
      "RW"
    ],
    "symbol": "RF",
    "decimals": 0
  },
  {
    "code": "SAR",
    "name": "Saudi Riyal",
    "countries": [
      "SA"
    ],
    "symbol": "SAR",
    "decimals": 2
  },
  {
    "code": "SBD",
    "name": "Solomon Islands Dollar",
    "countries": [
      "SB"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "SCR",
    "name": "Seychellois Rupee",
    "countries": [
      "SC"
    ],
    "symbol": "SCR",
    "decimals": 2
  },
  {
    "code": "SDG",
    "name": "Sudanese Pound",
    "countries": [
      "SD"
    ],
    "symbol": "SDG",
    "decimals": 2
  },
  {
    "code": "SEK",
    "name": "Swedish Krona",
    "countries": [
      "SE"
    ],
    "symbol": "kr",
    "decimals": 2
  },
  {
    "code": "SGD",
    "name": "Singapore Dollar",
    "countries": [
      "SG"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "SHP",
    "name": "St. Helena Pound",
    "countries": [
      "SH"
    ],
    "symbol": "£",
    "decimals": 2
  },
  {
    "code": "SLE",
    "name": "Sierra Leonean Leone",
    "countries": [
      "SL"
    ],
    "symbol": "SLE",
    "decimals": 2
  },
  {
    "code": "SOS",
    "name": "Somali Shilling",
    "countries": [
      "SO"
    ],
    "symbol": "SOS",
    "decimals": 0
  },
  {
    "code": "SRD",
    "name": "Surinamese Dollar",
    "countries": [
      "SR"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "SSP",
    "name": "South Sudanese Pound",
    "countries": [
      "SS"
    ],
    "symbol": "£",
    "decimals": 2
  },
  {
    "code": "STN",
    "name": "São Tomé & Príncipe Dobra",
    "countries": [
      "ST"
    ],
    "symbol": "Db",
    "decimals": 2
  },
  {
    "code": "SYP",
    "name": "Syrian Pound",
    "countries": [
      "SY"
    ],
    "symbol": "£",
    "decimals": 0
  },
  {
    "code": "SZL",
    "name": "Swazi Lilangeni",
    "countries": [
      "SZ"
    ],
    "symbol": "SZL",
    "decimals": 2
  },
  {
    "code": "THB",
    "name": "Thai Baht",
    "countries": [
      "TH"
    ],
    "symbol": "฿",
    "decimals": 2
  },
  {
    "code": "TJS",
    "name": "Tajikistani Somoni",
    "countries": [
      "TJ"
    ],
    "symbol": "TJS",
    "decimals": 2
  },
  {
    "code": "TMT",
    "name": "Turkmenistani Manat",
    "countries": [
      "TM"
    ],
    "symbol": "TMT",
    "decimals": 2
  },
  {
    "code": "TND",
    "name": "Tunisian Dinar",
    "countries": [
      "TN"
    ],
    "symbol": "TND",
    "decimals": 3
  },
  {
    "code": "TOP",
    "name": "Tongan Paʻanga",
    "countries": [
      "TO"
    ],
    "symbol": "T$",
    "decimals": 2
  },
  {
    "code": "TRY",
    "name": "Turkish Lira",
    "countries": [
      "TR"
    ],
    "symbol": "₺",
    "decimals": 2
  },
  {
    "code": "TTD",
    "name": "Trinidad & Tobago Dollar",
    "countries": [
      "TT"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "TWD",
    "name": "New Taiwan Dollar",
    "countries": [
      "TW"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "TZS",
    "name": "Tanzanian Shilling",
    "countries": [
      "TZ"
    ],
    "symbol": "TZS",
    "decimals": 2
  },
  {
    "code": "UAH",
    "name": "Ukrainian Hryvnia",
    "countries": [
      "UA"
    ],
    "symbol": "₴",
    "decimals": 2
  },
  {
    "code": "UGX",
    "name": "Ugandan Shilling",
    "countries": [
      "UG"
    ],
    "symbol": "UGX",
    "decimals": 0
  },
  {
    "code": "USD",
    "name": "US Dollar",
    "countries": [
      "AS",
      "IO",
      "VG",
      "EC",
      "SV",
      "GU",
      "MH",
      "FM",
      "MP",
      "PW",
      "PR",
      "TL",
      "TC",
      "VI",
      "US"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "UYU",
    "name": "Uruguayan Peso",
    "countries": [
      "UY"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "UZS",
    "name": "Uzbekistani Som",
    "countries": [
      "UZ"
    ],
    "symbol": "UZS",
    "decimals": 2
  },
  {
    "code": "VES",
    "name": "Venezuelan Bolívar",
    "countries": [
      "VE"
    ],
    "symbol": "VES",
    "decimals": 2
  },
  {
    "code": "VND",
    "name": "Vietnamese Dong",
    "countries": [
      "VN"
    ],
    "symbol": "₫",
    "decimals": 0
  },
  {
    "code": "VUV",
    "name": "Vanuatu Vatu",
    "countries": [
      "VU"
    ],
    "symbol": "VUV",
    "decimals": 0
  },
  {
    "code": "WST",
    "name": "Samoan Tala",
    "countries": [
      "WS"
    ],
    "symbol": "WST",
    "decimals": 2
  },
  {
    "code": "XAF",
    "name": "Central African CFA Franc",
    "countries": [
      "CM",
      "CF",
      "TD",
      "CG",
      "GQ",
      "GA"
    ],
    "symbol": "FCFA",
    "decimals": 0
  },
  {
    "code": "XCD",
    "name": "East Caribbean Dollar",
    "countries": [
      "AI",
      "AG",
      "DM",
      "GD",
      "MS",
      "KN",
      "LC",
      "VC"
    ],
    "symbol": "$",
    "decimals": 2
  },
  {
    "code": "XOF",
    "name": "West African CFA Franc",
    "countries": [
      "BJ",
      "BF",
      "CI",
      "GW",
      "ML",
      "NE",
      "SN",
      "TG"
    ],
    "symbol": "F CFA",
    "decimals": 0
  },
  {
    "code": "XPF",
    "name": "CFP Franc",
    "countries": [
      "PF",
      "NC",
      "WF"
    ],
    "symbol": "CFPF",
    "decimals": 0
  },
  {
    "code": "YER",
    "name": "Yemeni Rial",
    "countries": [
      "YE"
    ],
    "symbol": "YER",
    "decimals": 0
  },
  {
    "code": "ZAR",
    "name": "South African Rand",
    "countries": [
      "ZA"
    ],
    "symbol": "R",
    "decimals": 2
  },
  {
    "code": "ZMW",
    "name": "Zambian Kwacha",
    "countries": [
      "ZM"
    ],
    "symbol": "ZK",
    "decimals": 2
  },
  {
    "code": "ZWG",
    "name": "Zimbabwean Gold",
    "countries": [
      "ZW"
    ],
    "symbol": "ZWG",
    "decimals": 2
  }
];

const countryByIso = new Map(COUNTRIES.map((c) => [c.iso2, c]));
const countryByDial = new Map<string, CountryRecord[]>();
for (const c of COUNTRIES) {
  const list = countryByDial.get(c.dialCode) ?? [];
  list.push(c);
  countryByDial.set(c.dialCode, list);
}
const currencyByCode = new Map(CURRENCIES.map((c) => [c.code, c]));

export function getCountry(iso2: string): CountryRecord | undefined {
  return countryByIso.get(iso2.toUpperCase());
}

export function getCurrency(code: string): CurrencyRecord | undefined {
  return currencyByCode.get(code.toUpperCase());
}

export function getCountriesByDialCode(dial: string): CountryRecord[] {
  return countryByDial.get(dial.replace(/^\+/, "")) ?? [];
}

export function flagFromIso(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export function searchCountries(query: string, list: CountryRecord[] = COUNTRIES): CountryRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.iso2.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      `+${c.dialCode}`.includes(q),
  );
}

export function searchCurrencies(query: string, list: CurrencyRecord[] = CURRENCIES): CurrencyRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (c) =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q),
  );
}

/** Format national digits with country grouping when available. */
export function formatNationalNumber(national: string, country?: CountryRecord | null): string {
  const digits = national.replace(/\D/g, "");
  if (!digits) return "";
  if (!country?.groups?.length) {
    // Fallback: groups of 3 from the end for better international readability
    const rev = digits.split("").reverse();
    const parts: string[] = [];
    for (let i = 0; i < rev.length; i += 3) {
      parts.push(rev.slice(i, i + 3).reverse().join(""));
    }
    return parts.reverse().join(" ");
  }
  const parts: string[] = [];
  let i = 0;
  for (const len of country.groups) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + len));
    i += len;
  }
  if (i < digits.length) parts.push(digits.slice(i));
  return parts.filter(Boolean).join(" ");
}

/** Build E.164 from country + national digits. */
export function toE164(national: string, country: CountryRecord): string {
  let n = national.replace(/\D/g, "");
  // Strip leading trunk 0 when present
  if (n.startsWith("0") && country.dialCode !== "39") {
    n = n.replace(/^0+/, "");
  }
  // Avoid double country code
  if (n.startsWith(country.dialCode) && n.length > country.nationalLength) {
    n = n.slice(country.dialCode.length);
  }
  return n ? `+${country.dialCode}${n}` : `+${country.dialCode}`;
}

/** Primary ISO for shared dial codes (NANP, +44, +7, …). */
const PRIMARY_DIAL_ISO: Record<string, string> = {
  "1": "US",
  "7": "RU",
  "44": "GB",
  "61": "AU",
  "64": "NZ",
  "212": "MA",
  "262": "RE",
  "358": "FI",
  "590": "GP",
  "599": "CW",
};

/**
 * Parse E.164-ish value into country + national digits.
 * Prefers longest matching dial code among known countries.
 */
export function parseE164(
  raw: string,
  fallbackIso = "US",
): { country: CountryRecord; national: string } {
  const digits = raw.replace(/\D/g, "");
  const fallback = getCountry(fallbackIso) ?? COUNTRIES.find((c) => c.iso2 === "US")!;

  if (!digits) return { country: fallback, national: "" };

  // Prefer longest dial match
  let best: CountryRecord | null = null;
  for (let len = 3; len >= 1; len--) {
    const prefix = digits.slice(0, len);
    const matches = countryByDial.get(prefix);
    if (!matches?.length) continue;
    const primaryIso = PRIMARY_DIAL_ISO[prefix];
    // Prefer: caller's current country when it shares the dial, else primary
    // territory for that dial (GB for +44, US for +1), else first match.
    const preferred =
      matches.find((m) => m.iso2 === fallbackIso) ??
      (primaryIso
        ? matches.find((m) => m.iso2 === primaryIso)
        : undefined) ??
      matches[0]!;
    best = preferred;
    break;
  }

  if (!best) return { country: fallback, national: digits };

  return {
    country: best,
    national: digits.slice(best.dialCode.length),
  };
}

export function defaultLocaleForCurrency(code: string): string {
  const rec = getCurrency(code);
  const iso = rec?.countries[0];
  if (!iso) return "en-US";
  // Common locale map; fall back to en-{ISO}
  const map: Record<string, string> = {
    US: "en-US", GB: "en-GB", AU: "en-AU", CA: "en-CA", IN: "en-IN",
    DE: "de-DE", FR: "fr-FR", ES: "es-ES", IT: "it-IT", BR: "pt-BR",
    PT: "pt-PT", JP: "ja-JP", CN: "zh-CN", KR: "ko-KR", MX: "es-MX",
    AE: "ar-AE", SA: "ar-SA", NL: "nl-NL", SE: "sv-SE", NO: "nb-NO",
    DK: "da-DK", FI: "fi-FI", PL: "pl-PL", TR: "tr-TR", RU: "ru-RU",
    UA: "uk-UA", IL: "he-IL", TH: "th-TH", VN: "vi-VN", ID: "id-ID",
    MY: "ms-MY", PH: "en-PH", SG: "en-SG", HK: "zh-HK", TW: "zh-TW",
    ZA: "en-ZA", NG: "en-NG", KE: "en-KE", EG: "ar-EG", CH: "de-CH",
    AT: "de-AT", BE: "nl-BE", IE: "en-IE", NZ: "en-NZ", AR: "es-AR",
    CL: "es-CL", CO: "es-CO", PE: "es-PE",
  };
  return map[iso] ?? `en-${iso}`;
}

export function currencyDecimals(code: string): number {
  return getCurrency(code)?.decimals ?? 2;
}
