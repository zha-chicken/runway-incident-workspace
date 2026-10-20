import ExcelJS from 'exceljs';
import {createHash} from 'node:crypto';
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {bi, type Dataset, type IncidentInput, type Monthly, type SourceRecord} from '../src/domain/types';

const sourceFile = 'HackSHSID 2026/Track 3 Data.xlsx';
const bytes = readFileSync(sourceFile);
const sha256 = createHash('sha256').update(bytes).digest('hex');
if (sha256 !== '571894e4d5ec64d661713c1f7e013f799f47356ccffe3e490cac73e1ae1cb5d6') {
  throw new Error('Source workbook differs from the reviewed competition version. Review before importing.');
}
const names = [
  ['YUN', '云川国际机场', 'Yunchuan International'],
  ['HAI', '海陵国际机场', 'Hailing International'],
  ['BEI', '北岭机场', 'Beiling'], ['XING', '星湖机场', 'Xinghu'],
  ['NAN', '南湾机场', 'Nanwan'], ['QING', '青岚机场', 'Qinglan'],
  ['LIN', '临江机场', 'Linjiang'], ['GAO', '高原机场', 'Gaoyuan']
];
const airportId = (name: unknown) => names.find(n => n[1] === name)?.[0] ?? null;
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(bytes as unknown as ExcelJS.Buffer);
const records: SourceRecord[] = [];
const monthly: Monthly[] = [];
const counts: Record<string, number> = {};
const cellValue = (v: ExcelJS.CellValue): string | number | null => {
  if (v == null) return null;
  if (typeof v === 'number' || typeof v === 'string') return v;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'boolean') return String(v);
  throw new Error('Unexpected formula or complex cell: review the workbook.');
};
for (const sheet of workbook.worksheets) {
  const headers = (sheet.getRow(1).values as ExcelJS.CellValue[]).slice(1).map(String);
  counts[sheet.name] = sheet.rowCount - 1;
  for (let row = 2; row <= sheet.rowCount; row++) {
    const values = headers.map((_, i) => cellValue(sheet.getRow(row).getCell(i + 1).value));
    const cells = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    const ap = airportId(cells['机场名称']);
    const year = cells['年份'], month = cells['月份'];
    const period = year ? `${year}${month ? `-${String(month).padStart(2, '0')}` : ''}` : null;
    const category: SourceRecord['category'] = sheet.name === '01_机场月度运行基线' ? 'operations' :
      sheet.name === '02_机场年度规模' ? 'scale' : sheet.name === '03_机场天气月度' ? 'weather' :
      sheet.name === '04_模拟事件' ? 'event' : sheet.name === '05_运营规则' ? 'rule' : 'reference';
    const prefix = {operations: 'OPS', weather: 'WX', scale: 'SCALE', event: 'EVENT', rule: 'RULE', reference: 'REF'}[category];
    const id = category === 'event' || category === 'rule' ? String(values[0]) :
      ap && period ? `${prefix}-${ap}-${period}` : `REF-${sheet.id}-${row}`;
    records.push({
      id, sheet: sheet.name, row, cells, category, airportId: ap, period,
      sourceFamilyId: typeof cells['来源编号'] === 'string' ? cells['来源编号'] : null,
      simulation: true, qualityFlags: cells['是否缺少数据'] === '是' ? ['missing_weather'] : []
    });
    if (category === 'operations') {
      monthly.push({
        evidenceId: id, airportId: ap!, category: String(values[3]), period: period!,
        completion: Number(values[4]), releaseNormality: Number(values[5]),
        peerMean: Number(values[6]), historicalMean: Number(values[7]), deltaPp: Number(values[8]),
        priorCount: 0, windowStart: null, windowEnd: null, peerCount: 0
      });
    }
  }
}
const ids = new Set<string>();
for (const r of records) {if (ids.has(r.id)) throw new Error(`Duplicate record ${r.id}`); ids.add(r.id);}
monthly.sort((a, b) => a.period.localeCompare(b.period) || a.airportId.localeCompare(b.airportId));
for (const m of monthly) {
  const prior = monthly.filter(x => x.airportId === m.airportId && x.period < m.period).slice(-12);
  const peers = monthly.filter(x => x.category === m.category && x.period === m.period);
  m.priorCount = prior.length; m.windowStart = prior.at(0)?.period ?? null;
  m.windowEnd = prior.at(-1)?.period ?? null; m.peerCount = peers.length;
  const historical = prior.length ? prior.reduce((s, x) => s + x.completion, 0) / prior.length : m.completion;
  const peer = peers.reduce((s, x) => s + x.completion, 0) / peers.length;
  if (Math.abs(historical - m.historicalMean) > .00005 + 1e-9) throw new Error(`Historical mean: ${m.evidenceId}`);
  if (Math.abs(peer - m.peerMean) > .0001 + 1e-9) throw new Error(`Peer mean: ${m.evidenceId}`);
  if (Math.abs((m.completion - m.historicalMean) * 100 - m.deltaPp) > .01 + 1e-9) throw new Error(`Delta: ${m.evidenceId}`);
  if (![m.completion, m.releaseNormality, m.peerMean, m.historicalMean].every(v => v >= 0 && v <= 1)) throw new Error(`Proportion: ${m.evidenceId}`);
  if (!ids.has(`WX-${m.airportId}-${m.period}`)) throw new Error(`Missing weather join: ${m.evidenceId}`);
}
const titles = [
  bi('Weather risk rising', '天气风险上升'), bi('Sustained operational pressure', '运行压力持续'),
  bi('Conflicting reports', '数据来源冲突'), bi('Prepare passenger communication', '旅客沟通准备'),
  bi('Human rejection and review', '人工否决与复盘')
];
const events = records.filter(r => r.category === 'event').map((r, index) => {
  const c = r.cells, period = String(c['事件时间']);
  const input: IncidentInput = {
    title: titles[index].en, airportId: r.airportId!, scenarioPeriod: period, historicalThrough: null,
    businessImportance: c['航空公司业务重要程度'] === '高' ? 'high' : c['航空公司业务重要程度'] === '中' ? 'medium' : 'low',
    knownInformation: `${c['已知信息']}\n${c['现场备注']}`, unknowns: String(c['未知信息']),
    safetyIssue: false, sourceReliabilityUnknown: false, decisionRequest: '',
    officialStatus: 'unconfirmed', officialStatusSourceId: null, sourceEventId: r.id,
    reports: ['天气描述', '运行情况描述'].map((field, i) => ({
      id: `${r.id}-${i}`, text: String(c[field]), sourceLabel: 'Competition scenario / 赛事模拟',
      originReportId: null, reportedAt: null, applicablePeriod: period,
      reliability: index === 2 && i === 1 ? 'conflicted' : 'scenario_given',
      independenceGroup: null, verificationBasis: 'Supplied scenario assertion; originating report unspecified.',
      signal: i === 0 ? ([1, 2].includes(index) ? 'context' : 'weather') : index === 2 ? 'conflict' : index === 4 ? 'context' : 'operations',
      expandingImpact: false, provenanceKind: 'competition', sourceEvidenceId: r.id
    }))
  };
  return {id: r.id, title: titles[index], input};
});
const missingWeather = records.filter(r => r.qualityFlags.includes('missing_weather')).map(r => r.id);
const anomalies = monthly.filter(m => m.deltaPp <= -5).map(m => m.evidenceId);
if (monthly.length !== 192 || missingWeather.length !== 4 || anomalies.length !== 12 || events.length !== 5 || workbook.worksheets.length !== 14) {
  throw new Error('Unexpected dataset dimensions.');
}
const dataset: Dataset = {
  version: `competition-${sha256.slice(0, 12)}`, sha256, sourceFile,
  importedAt: '2026-10-20', airports: names.map(([id, zh, en]) => ({
    id, name: bi(en, zh), category: monthly.find(m => m.airportId === id)!.category
  })), records, monthly, events,
  audit: {sheets: workbook.worksheets.length, counts, anomalies, missingWeather}
};
mkdirSync('src/data', {recursive: true});
writeFileSync('src/data/competition.json', JSON.stringify(dataset, null, 2) + '\n');
console.log(JSON.stringify({version: dataset.version, records: records.length, monthly: monthly.length, anomalies: anomalies.length, flaggedWeather: missingWeather.length}));
