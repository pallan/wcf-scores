// Maps WCF NOC codes to flag emoji.
// Most use ISO 3166-1 alpha-2 regional indicator pairs; nations without
// their own ISO code (SCO, WAL, ENG) use Unicode subdivision tag sequences.
const NOC_FLAGS: Record<string, string> = {
  ARG: '🇦🇷',
  AUS: '🇦🇺',
  AUT: '🇦🇹',
  BEL: '🇧🇪',
  BRA: '🇧🇷',
  BUL: '🇧🇬',
  CAN: '🇨🇦',
  CHN: '🇨🇳',
  CHE: '🇨🇭',
  CZE: '🇨🇿',
  DEN: '🇩🇰',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  EST: '🇪🇪',
  FIN: '🇫🇮',
  GBR: '🇬🇧',
  GER: '🇩🇪',
  HKG: '🇭🇰',
  HUN: '🇭🇺',
  ISL: '🇮🇸',
  ITA: '🇮🇹',
  JPN: '🇯🇵',
  KAZ: '🇰🇿',
  KOR: '🇰🇷',
  LAT: '🇱🇻',
  MEX: '🇲🇽',
  NED: '🇳🇱',
  NOR: '🇳🇴',
  NZL: '🇳🇿',
  POL: '🇵🇱',
  ROM: '🇷🇴',
  RUS: '🇷🇺',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  SVK: '🇸🇰',
  SWE: '🇸🇪',
  TPE: '🇹🇼',
  TUR: '🇹🇷',
  UKR: '🇺🇦',
  USA: '🇺🇸',
  WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
}

export function flagForNoc(noc: string): string {
  return NOC_FLAGS[noc] ?? ''
}
