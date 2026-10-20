'use client';

import {useContext, useEffect, useRef, useState} from 'react';
import {ArrowUpRight, BookOpen, Building2, CircleHelp, CloudSun, Flag, TriangleAlert} from 'lucide-react';
import type {EvidenceBundle, Locale, Monthly, SourceRecord} from '../domain/types';
import {isAnomaly, pct, type T} from './client';
import {Inspect} from './ui';

const series=[
  {key:'completion',label:'completion',className:'line-completion'},
  {key:'releaseNormality',label:'release',className:'line-release'},
  {key:'historicalMean',label:'baseline',className:'line-baseline'},
  {key:'peerMean',label:'peers',className:'line-peers'}
] as const;

/** The latest month against its own baseline and peers, plus how many months crossed the review threshold. */
export function EvidenceStats({evidence,t}:{evidence:EvidenceBundle;t:T}) {
  const rows=evidence.monthly,latest=rows.at(-1);
  if(!latest)return null;
  const anomalies=rows.filter(r=>isAnomaly(r.deltaPp));
  return <div className="stat-row">
    <Stat label={t('latestCompletion')} value={pct(latest.completion)} note={`${latest.period} · ${latest.deltaPp>=0?'+':''}${latest.deltaPp.toFixed(2)} pp`}/>
    <Stat label={t('baseline')} value={pct(latest.historicalMean)} note={latest.priorCount?`${latest.priorCount} ${t('months')}`:t('initialized')}/>
    <Stat label={t('peers')} value={pct(latest.peerMean)} note={`n=${latest.peerCount} · ${t('includesSelf')}`}/>
    <Stat label={t('focusedMonths')} value={String(anomalies.length)} note={t('threshold')} tone={anomalies.length?'caution':undefined}/>
  </div>;
}

export function EvidenceView({evidence,historicalThrough,locale,t,stats=true}:{evidence:EvidenceBundle;historicalThrough:string|null;locale:Locale;t:T;stats?:boolean}) {
  const {inspect}=useContext(Inspect);
  const rows=evidence.monthly,latest=rows.at(-1);
  const flagged=evidence.records.filter(r=>r.qualityFlags.length);
  const groups:{key:SourceRecord['category'];title:string;icon:typeof Flag}[]=[
    {key:'event',title:t('groupEvent'),icon:Flag},{key:'scale',title:t('groupScale'),icon:Building2},
    {key:'weather',title:t('groupWeather'),icon:CloudSun},{key:'rule',title:t('groupRules'),icon:BookOpen}
  ];
  return <div className="stack">
    <div className="notice"><CircleHelp size={17} aria-hidden/>{t('historyNote')}</div>
    {stats&&<EvidenceStats evidence={evidence} t={t}/>}
    <article className="card chart-card">
      <div className="section-heading"><div><h2>{t('historical')}</h2><p className="section-sub">{t('chartSub')}</p></div><span className="tag neutral code">{evidence.airportId} · {rows[0]?.period} → {latest?.period}{historicalThrough?` · ${t('cutoff')}`:''}</span></div>
      <Chart rows={rows} t={t} locale={locale}/>
    </article>
    <article className="card">
      <div className="section-heading"><div><h2>{t('monthlyTable')}</h2><p className="section-sub">{t('includesSelf')} · {t('threshold')}</p></div></div>
      <div className="table-scroll"><table>
        <thead><tr>{['month','completion','release','baseline','delta','peers','window'].map(k=><th key={k} scope="col">{t(k)}</th>)}</tr></thead>
        <tbody>{rows.map(r=><tr key={r.period} className={isAnomaly(r.deltaPp)?'anomaly':''}>
          <th scope="row"><button className="table-link" onClick={()=>inspect(r.evidenceId)}>{r.period}<ArrowUpRight size={12} aria-hidden/></button>{isAnomaly(r.deltaPp)&&<span className="sr-only"> — {t('focusedReview')}</span>}</th>
          <td>{pct(r.completion)}</td><td>{pct(r.releaseNormality)}</td><td>{pct(r.historicalMean)}</td>
          <td className="delta">{r.deltaPp>0?'+':''}{r.deltaPp.toFixed(2)}</td>
          <td>{pct(r.peerMean)}<small>n={r.peerCount}</small></td>
          <td><small>{r.priorCount?`${r.windowStart} → ${r.windowEnd}`:t('initialized')}<br/>{r.priorCount} {t('months')}</small></td>
        </tr>)}</tbody>
      </table></div>
    </article>
    <article className="card">
      <div className="section-heading"><div><h2>{t('refs')}</h2><p className="section-sub">{t('refsSub')}</p></div></div>
      {flagged.length>0&&<div className="notice caution"><TriangleAlert size={17} aria-hidden/><span><strong>{t('quality')}:</strong> {t('missingWeather')}</span></div>}
      {groups.map(g=>{const records=evidence.records.filter(r=>r.category===g.key);if(!records.length)return null;const Icon=g.icon;return <section className="record-group" key={g.key}>
        <h3><Icon size={15} aria-hidden/>{g.title}<span className="count">{records.length}</span></h3>
        <div className="record-grid">{records.map(r=><button key={r.id} className={`record-chip ${r.qualityFlags.length?'flagged':''}`} onClick={()=>inspect(r.id)}>
          <span className="code">{r.id}</span>
          <span className="record-detail">{recordSummary(r,locale,t)}</span>
          {r.qualityFlags.length?<TriangleAlert size={13} aria-label={t('flaggedMissing')}/>:<ArrowUpRight size={13} aria-hidden/>}
        </button>)}</div>
      </section>;})}
      <div className="hash"><span>{t('sourceHash')} · {t('dataVersion')} {evidence.datasetVersion}</span><code>{evidence.sourceHash}</code></div>
    </article>
  </div>;
}

/** A one-line reading of a record, so the grid is useful before anything is opened. */
function recordSummary(r:SourceRecord,locale:Locale,t:T) {
  const c=r.cells;
  if(r.qualityFlags.length)return t('flaggedMissing');
  if(r.category==='rule')return String(c['规则主题']??'');
  if(r.category==='weather')return t('weatherSummary',{days:String(c['明显不利天气天数']??'—'),wind:String(c['最大风速（米/秒）']??'—')});
  if(r.category==='scale'){const pax=Number(c['旅客吞吐量（万人次）']);return Number.isFinite(pax)?(locale==='zh'?`旅客 ${pax} 万人次`:`${(pax/100).toFixed(1)}M passengers`):`${r.sheet} · ${r.row}`;}
  if(r.category==='event')return String(c['事件名称']??r.sheet);
  return `${r.sheet} · ${r.row}`;
}

function Stat({label,value,note,tone}:{label:string;value:string;note:string;tone?:string}) {
  return <div className={`stat ${tone||''}`}><span className="stat-label">{label}</span><strong>{value}</strong><span className="stat-note">{note}</span></div>;
}

function Chart({rows,t,locale}:{rows:Monthly[];t:T;locale:Locale}) {
  const [hover,setHover]=useState<number|null>(null),[width,setWidth]=useState(760),frame=useRef<HTMLDivElement>(null);
  // Draw at the rendered width so axis text stays legible on phones.
  useEffect(()=>{const el=frame.current;if(!el)return;const observer=new ResizeObserver(([entry])=>setWidth(Math.max(300,Math.round(entry.contentRect.width))));observer.observe(el);return()=>observer.disconnect();},[]);
  const W=width,H=W<500?220:270,left=42,right=12,top=14,bottom=34;
  const values=rows.flatMap(r=>series.map(s=>r[s.key]*100));
  const lo=Math.max(0,Math.floor((Math.min(...values)-2)/5)*5),hi=Math.min(100,Math.ceil((Math.max(...values)+1)/5)*5);
  const x=(i:number)=>left+i*((W-left-right)/Math.max(rows.length-1,1));
  const y=(v:number)=>top+(1-(v*100-lo)/Math.max(hi-lo,1))*(H-top-bottom);
  const ticks=Array.from({length:Math.floor((hi-lo)/5)+1},(_,i)=>lo+i*5);
  const labelEvery=W<500?12:rows.length>12?6:3;
  const point=hover===null?null:rows[hover];
  if(!rows.length)return <p className="muted">{t('notApplicable')}</p>;
  return <div className="chart">
    <div className="legend">{series.map(s=><span key={s.key}><i className={s.className}/>{t(s.label)}</span>)}<span><i className="marker"/>{t('focusedReview')}</span></div>
    <div className="chart-frame" ref={frame} onPointerLeave={()=>setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`${t('historical')} — ${t('chartAlt')}`} className="history-chart"
        onPointerMove={e=>{const box=e.currentTarget.getBoundingClientRect();const px=(e.clientX-box.left)/box.width*W;setHover(Math.max(0,Math.min(rows.length-1,Math.round((px-left)/((W-left-right)/Math.max(rows.length-1,1))))));}}>
        {ticks.map(v=><g key={v} className="grid"><line x1={left} x2={W-right} y1={y(v/100)} y2={y(v/100)}/><text x={left-8} y={y(v/100)+4} textAnchor="end">{v}%</text></g>)}
        {rows.map((r,i)=>(i%labelEvery===0||i===rows.length-1)&&<text key={r.period} className="axis" x={x(i)} y={H-10} textAnchor={i===0?'start':i===rows.length-1?'end':'middle'}>{r.period}</text>)}
        {point&&<line className="hover-line" x1={x(hover!)} x2={x(hover!)} y1={top} y2={H-bottom}/>}
        {[...series].reverse().map(s=><polyline key={s.key} className={s.className} points={rows.map((r,i)=>`${x(i)},${y(r[s.key])}`).join(' ')}/>)}
        {rows.map((r,i)=>isAnomaly(r.deltaPp)&&<g key={r.period} className="anomaly-marker"><circle cx={x(i)} cy={y(r.completion)} r={5}/><text x={x(i)} y={y(r.completion)+19} textAnchor="middle">{r.deltaPp.toFixed(1)}</text></g>)}
        {point&&series.map(s=><circle key={s.key} className={`hover-dot ${s.className}`} cx={x(hover!)} cy={y(point[s.key])} r={3.5}/>)}
      </svg>
      {point&&<div className={`chart-tip ${hover!>rows.length/2?'left':''}`} style={{left:`${x(hover!)/W*100}%`}} aria-hidden>
        <strong>{point.period}</strong>
        {series.map(s=><span key={s.key}><i className={s.className}/>{t(s.label)}<b>{pct(point[s.key])}</b></span>)}
        <span className={isAnomaly(point.deltaPp)?'tip-alert':''}>{t('delta')}<b>{point.deltaPp.toFixed(2)}</b></span>
      </div>}
    </div>
    <p className="chart-caption">{locale==='zh'?'悬停查看当月数值；完整数值见下方表格。':'Hover for monthly values; the table below lists every value.'}</p>
  </div>;
}

const reportLabels:Record<string,string>={id:'reportId',sourceLabel:'sourceLabel',applicablePeriod:'reportScope',reportedAt:'reportedAt',reliability:'reliability',signal:'signal',originReportId:'originId',independenceGroup:'independence',verificationBasis:'verification',expandingImpact:'expanding',provenanceKind:'provenance',sourceEvidenceId:'sourceEvidence'};
export function SourceView({id,evidence,locale,t}:{id:string;evidence:EvidenceBundle;locale:Locale;t:T}) {
  const record=evidence.records.find(r=>r.id===id),report=evidence.reportEvidence.find(r=>r.id===id);
  const value=(key:string,v:unknown)=>v===null||v===undefined||v===''?'—':typeof v==='boolean'?(v?t('yes'):t('no')):key==='reliability'?t(String(v)):key==='signal'?t(`signal_${v}`):key==='provenanceKind'?t(v==='competition'?'competitionReport':'teamReport'):String(v);
  return <div className="source-view">
    <div className="source-id"><span className="code">{id}</span></div>
    {record?<>
      <p className="source-meta">{t('sheet')}: {record.sheet}<span className="dot" aria-hidden>·</span>{locale==='zh'?`第 ${record.row} 行`:`Row ${record.row}`}{record.period&&<><span className="dot" aria-hidden>·</span>{record.period}</>}</p>
      {record.qualityFlags.includes('missing_weather')&&<div className="notice caution"><TriangleAlert size={16} aria-hidden/>{t('missingWeather')}</div>}
      <dl className="cells">{Object.entries(record.cells).map(([key,v])=><div key={key}><dt>{key}</dt><dd>{v===null?'—':String(v)}</dd></div>)}</dl>
      <div className="hash"><span>{t('sourceHash')}</span><code>{evidence.sourceHash}</code></div>
    </>:report?<>
      <blockquote className="source-quote">{report.report.text}</blockquote>
      <dl className="cells">{Object.entries(report.report).filter(([key])=>key!=='text').map(([key,v])=><div key={key}><dt>{reportLabels[key]?t(reportLabels[key]):key}<small className="code">{key}</small></dt><dd>{value(key,v)}</dd></div>)}</dl>
    </>:<p>{t('notApplicable')}</p>}
  </div>;
}
