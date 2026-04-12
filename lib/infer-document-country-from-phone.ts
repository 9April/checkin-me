/**
 * WhatsApp / phone → check-in document country (MA vs OTHER) and UI hints.
 * MA = Morocco (CIN path), OTHER = passport / rest of world.
 */

const OTHER_PREFIXES = [
  "1242",
  "1246",
  "1264",
  "1268",
  "1284",
  "1340",
  "1345",
  "1441",
  "1473",
  "1664",
  "1670",
  "1671",
  "1684",
  "1721",
  "1758",
  "1767",
  "1784",
  "1787",
  "1809",
  "1829",
  "1849",
  "1868",
  "1869",
  "1876",
  "1939",
  "290",
  "291",
  "297",
  "298",
  "299",
  "350",
  "351",
  "352",
  "353",
  "354",
  "355",
  "356",
  "357",
  "358",
  "359",
  "370",
  "371",
  "372",
  "373",
  "374",
  "375",
  "376",
  "377",
  "378",
  "380",
  "381",
  "382",
  "383",
  "385",
  "386",
  "387",
  "389",
  "420",
  "421",
  "423",
  "500",
  "501",
  "502",
  "503",
  "504",
  "505",
  "506",
  "507",
  "508",
  "509",
  "590",
  "591",
  "592",
  "593",
  "594",
  "595",
  "596",
  "597",
  "598",
  "599",
  "670",
  "672",
  "673",
  "674",
  "675",
  "676",
  "677",
  "678",
  "679",
  "680",
  "681",
  "682",
  "683",
  "685",
  "686",
  "687",
  "688",
  "689",
  "690",
  "691",
  "692",
  "850",
  "852",
  "853",
  "855",
  "856",
  "880",
  "886",
  "960",
  "961",
  "962",
  "963",
  "964",
  "965",
  "966",
  "967",
  "968",
  "970",
  "971",
  "972",
  "973",
  "974",
  "975",
  "976",
  "977",
  "992",
  "993",
  "994",
  "995",
  "996",
  "998",
  "20",
  "27",
  "30",
  "31",
  "32",
  "33",
  "34",
  "36",
  "39",
  "40",
  "41",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "81",
  "82",
  "84",
  "86",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "98",
  "7",
  "1",
].sort((a, b) => b.length - a.length);

/** Dial prefix (as in OTHER_PREFIXES / 212) → ISO 3166-1 alpha-2 for flag */
const PREFIX_ISO2: Record<string, string> = {
  "1": "US",
  "7": "RU",
  "20": "EG",
  "27": "ZA",
  "30": "GR",
  "31": "NL",
  "32": "BE",
  "33": "FR",
  "34": "ES",
  "36": "HU",
  "39": "IT",
  "40": "RO",
  "41": "CH",
  "43": "AT",
  "44": "GB",
  "45": "DK",
  "46": "SE",
  "47": "NO",
  "48": "PL",
  "49": "DE",
  "51": "PE",
  "52": "MX",
  "53": "CU",
  "54": "AR",
  "55": "BR",
  "56": "CL",
  "57": "CO",
  "58": "VE",
  "60": "MY",
  "61": "AU",
  "62": "ID",
  "63": "PH",
  "64": "NZ",
  "65": "SG",
  "66": "TH",
  "81": "JP",
  "82": "KR",
  "84": "VN",
  "86": "CN",
  "90": "TR",
  "91": "IN",
  "92": "PK",
  "93": "AF",
  "94": "LK",
  "95": "MM",
  "98": "IR",
  "212": "MA",
  "213": "DZ",
  "216": "TN",
  "351": "PT",
  "352": "LU",
  "353": "IE",
  "354": "IS",
  "355": "AL",
  "356": "MT",
  "357": "CY",
  "358": "FI",
  "359": "BG",
  "370": "LT",
  "371": "LV",
  "372": "EE",
  "373": "MD",
  "374": "AM",
  "375": "BY",
  "376": "AD",
  "377": "MC",
  "380": "UA",
  "381": "RS",
  "385": "HR",
  "386": "SI",
  "387": "BA",
  "389": "MK",
  "420": "CZ",
  "421": "SK",
  "423": "LI",
  "1242": "BS",
  "1246": "BB",
  "1264": "AI",
  "1268": "AG",
  "1284": "VG",
  "1340": "VI",
  "1345": "KY",
  "1441": "BM",
  "1473": "GD",
  "1664": "MS",
  "1670": "MP",
  "1671": "GU",
  "1684": "AS",
  "1721": "SX",
  "1758": "LC",
  "1767": "DM",
  "1784": "VC",
  "1787": "PR",
  "1809": "DO",
  "1829": "DO",
  "1849": "DO",
  "1868": "TT",
  "1869": "KN",
  "1876": "JM",
  "1939": "PR",
  "971": "AE",
  "972": "IL",
  "973": "BH",
  "974": "QA",
  "975": "BT",
  "976": "MN",
  "977": "NP",
  "992": "TJ",
  "993": "TM",
  "994": "AZ",
  "995": "GE",
  "996": "KG",
  "998": "UZ",
};

function iso2ToFlagEmoji(iso2: string): string {
  const u = iso2.toUpperCase();
  if (u.length !== 2 || !/^[A-Z]{2}$/.test(u)) return "🌍";
  return String.fromCodePoint(...[...u].map((c) => 127397 + c.charCodeAt(0)));
}

function normalizeDigits(trimmed: string): { d: string; had00: boolean; hasPlus: boolean } {
  const hasPlus = trimmed.startsWith("+");
  let d = trimmed.replace(/\D/g, "");
  const had00 = d.startsWith("00");
  if (had00) d = d.slice(2);
  return { d, had00, hasPlus };
}

export type WhatsAppCheckinParse = {
  document: "MA" | "OTHER";
  flagEmoji: string;
  dialLabel: string;
  /** ISO 3166-1 alpha-2 when known (for OTHER: passport country label). */
  iso2?: string;
};

/** Localized country/territory name for a region code (e.g. FR → France / France / Francia). */
export function regionDisplayName(
  iso2: string,
  lang: "EN" | "FR" | "SP"
): string {
  const locale = lang === "EN" ? "en" : lang === "FR" ? "fr" : "es";
  const code = iso2.toUpperCase();
  try {
    const dn = new Intl.DisplayNames([locale, "en"], { type: "region" });
    return dn.of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * Parse phone for UI: document line (MA/OTHER), flag, and shown dial code.
 * Morocco is detected as soon as "212" appears (+212, 00212, or pasted 212…).
 */
export function parseWhatsAppForCheckin(raw: string): WhatsAppCheckinParse | null {
  const trimmed = raw.trim();
  if (trimmed.length < 2) return null;

  const { d, had00, hasPlus } = normalizeDigits(trimmed);
  if (d.length < 1) return null;

  // Morocco international (+212 / 00 212 / leading 212…)
  if (d.startsWith("212") && d.length >= 3) {
    return {
      document: "MA",
      flagEmoji: iso2ToFlagEmoji("MA"),
      dialLabel: "+212",
      iso2: "MA",
    };
  }

  // Morocco national mobile (no + / no 00), before matching other country codes
  if (!hasPlus && !had00) {
    if (/^0?[67]\d{8}$/.test(d)) {
      return {
        document: "MA",
        flagEmoji: iso2ToFlagEmoji("MA"),
        dialLabel: "+212",
        iso2: "MA",
      };
    }
    if (/^0?[67]\d{3,7}$/.test(d) && d.length >= 4 && d.length <= 9) {
      return {
        document: "MA",
        flagEmoji: iso2ToFlagEmoji("MA"),
        dialLabel: "+212",
        iso2: "MA",
      };
    }
  }

  // OTHER: need international form, or long enough digit string without ambiguous short local numbers
  const intl = hasPlus || had00;
  if (!intl && d.length < 8) return null;

  for (const pre of OTHER_PREFIXES) {
    if (!d.startsWith(pre) || d.length < pre.length) continue;
    if ((pre === "1" || pre === "7") && d.length < pre.length + 3) continue;
    const iso = PREFIX_ISO2[pre];
    return {
      document: "OTHER",
      flagEmoji: iso ? iso2ToFlagEmoji(iso) : "🌍",
      dialLabel: "+" + pre,
      ...(iso ? { iso2: iso } : {}),
    };
  }

  return null;
}

export function inferDocumentCountryFromPhone(raw: string): "MA" | "OTHER" | null {
  return parseWhatsAppForCheckin(raw)?.document ?? null;
}
