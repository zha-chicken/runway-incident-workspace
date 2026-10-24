const WINDOW_SECONDS = 30 * 60;
const DAY_SECONDS = 24 * 60 * 60;
type Period = {kind: 'clock' | 'simulation' | 'date'; day: number; seconds: number; offset?: number};

// Parse only explicit clock times, optionally scoped to a simulation day or calendar date.
// Do not use Date.parse: free-text and timezone defaults vary across environments.
function parsePeriod(text: string): Period | null {
  let value = text.normalize('NFKC').trim().toLowerCase();
  let kind: Period['kind'] = 'clock', day = 0;
  const simulation = /^(?:(?:simulation\s+)?day\s*(\d+)|(?:模拟\s*)?第\s*(\d+)\s*天)[,\s]*/.exec(value);
  const date = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:t|\s+|,\s*)/.exec(value);
  if (simulation) {
    kind = 'simulation'; day = Number(simulation[1] ?? simulation[2]);
    if (!Number.isSafeInteger(day) || day < 1) return null;
    value = value.slice(simulation[0].length);
  } else if (date) {
    const year = Number(date[1]), month = Number(date[2]), dateOfMonth = Number(date[3]);
    const timestamp = Date.UTC(year, month - 1, dateOfMonth), parsed = new Date(timestamp);
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== dateOfMonth) return null;
    kind = 'date'; day = timestamp / (DAY_SECONDS * 1000);
    value = value.slice(date[0].length);
  }
  const clock = /^(?:(上午|下午|晚上|早上|凌晨)\s*)?(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?(?:\s*(z|[+-]\d{2}:\d{2}))?$/.exec(value.trim());
  if (!clock) return null;
  let hour = Number(clock[2]);
  const minute = Number(clock[3]), second = Number(clock[4] ?? 0);
  if (hour > 23 || minute > 59 || second > 59 || (clock[1] && clock[5])) return null;
  if (clock[5]) {
    if (hour < 1 || hour > 12) return null;
    hour = hour % 12 + (clock[5] === 'pm' ? 12 : 0);
  } else if (clock[1]) {
    // Supplied scenarios use both 下午14:00 and 下午2:00 forms.
    if (clock[1] === '下午' || clock[1] === '晚上') {
      if (hour < 1) return null;
      if (hour < 12) hour += 12;
    } else {
      if (hour > 12) return null;
      if (hour === 12) hour = 0;
    }
  }
  let offset: number | undefined;
  if (clock[6]) {
    if (kind !== 'date') return null;
    if (clock[6] === 'z') offset = 0;
    else {
      const hours = Number(clock[6].slice(1, 3)), minutes = Number(clock[6].slice(4));
      if (hours > 14 || minutes > 59 || (hours === 14 && minutes !== 0)) return null;
      offset = (hours * 60 + minutes) * (clock[6][0] === '-' ? -1 : 1);
    }
  }
  return {kind, day, seconds: hour * 3600 + minute * 60 + second, offset};
}

export type ReportPeriodMatch = {
  matches: boolean;
  basis: 'exact_text' | 'within_window' | 'outside_window' | 'unparseable' | 'incompatible_scope';
  reportParseable: boolean; scenarioParseable: boolean;
  offsetMinutes: number | null; windowMinutes: number;
};

/** The explanation and the eligibility decision share one comparison. */
export function compareReportPeriod(reportPeriod: string, scenarioPeriod: string): ReportPeriodMatch {
  const report = parsePeriod(reportPeriod), scenario = parsePeriod(scenarioPeriod);
  const result = (matches: boolean, basis: ReportPeriodMatch['basis'], offsetMinutes: number | null = null): ReportPeriodMatch => ({
    matches, basis, reportParseable: report !== null, scenarioParseable: scenario !== null,
    offsetMinutes, windowMinutes: WINDOW_SECONDS / 60
  });
  // Preserve existing exact matches, including named periods that have no clock time.
  if (reportPeriod.trim() === scenarioPeriod.trim()) return result(true, 'exact_text', report && scenario ? 0 : null);
  if (!report || !scenario) return result(false, 'unparseable');
  if (report.kind !== 'clock' && report.kind !== scenario.kind) return result(false, 'incompatible_scope');
  // A bare report time inherits the scenario day/timezone; explicit days never disappear.
  // Both dated times must specify an offset, or both must use local scenario time.
  if (report.kind !== 'clock' && (report.offset === undefined) !== (scenario.offset === undefined)) return result(false, 'incompatible_scope');
  const reportDay = report.kind === 'clock' ? scenario.day : report.day;
  const reportOffset = report.kind === 'clock' ? scenario.offset : report.offset;
  const difference = (reportDay - scenario.day) * DAY_SECONDS + report.seconds - scenario.seconds
    - ((reportOffset ?? 0) - (scenario.offset ?? 0)) * 60;
  const matches = Math.abs(difference) <= WINDOW_SECONDS;
  return result(matches, matches ? 'within_window' : 'outside_window', difference / 60);
}

export function isCurrentReportPeriod(reportPeriod: string, scenarioPeriod: string): boolean {
  return compareReportPeriod(reportPeriod, scenarioPeriod).matches;
}
