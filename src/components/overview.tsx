'use client';

import {CircleAlert, SlidersHorizontal, TriangleAlert} from 'lucide-react';
import type {Locale, Report} from '../domain/types';
import {currentAssessment, pad, type Detail, type T} from './client';
import {Citations, Constraints, RiskBadge} from './ui';

const reliabilityTone:Record<Report['reliability'],string>={scenario_given:'neutral',human_verified:'good',unverified:'caution',conflicted:'danger',unusable:'muted'};

export function ReliabilityTag({value,t}:{value:Report['reliability'];t:T}) {return <span className={`tag ${reliabilityTone[value]}`}>{t(value)}</span>;}

export function OverviewView({detail,t,locale,onEdit}:{detail:Detail;t:T;locale:Locale;onEdit:()=>void}) {
  const s=detail.snapshot;
  return <div className="overview-grid">
    <div className="stack">
      <article className="card">
        <div className="section-heading"><div><h2>{t('scenario')}</h2><p className="section-sub">{t('scenarioSub')}</p></div><button className="secondary small" onClick={onEdit}><SlidersHorizontal size={14} aria-hidden/>{t('edit')}</button></div>
        <div className="read-grid">
          <div className="read-field"><h3>{t('happening')}</h3><p>{s.knownInformation||t('notApplicable')}</p></div>
          <div className="read-field unknown"><h3>{t('notKnown')}</h3><p>{s.unknowns||t('notApplicable')}</p></div>
        </div>
        {s.decisionRequest&&<div className="decision-request"><h3>{t('decisionRequest')}</h3><p>{s.decisionRequest}</p></div>}
        <dl className="fact-row">
          <div><dt>{t('importance')}</dt><dd>{t(s.businessImportance)}</dd></div>
          <div><dt>{t('historicalThrough')}</dt><dd className={s.historicalThrough?'code':''}>{s.historicalThrough||t('allHistory')}</dd></div>
          <div><dt>{t('official')}</dt><dd>{t(s.officialStatus)}</dd></div>
        </dl>
        {(s.safetyIssue||s.sourceReliabilityUnknown)&&<div className="flag-row">
          {s.safetyIssue&&<span className="flag danger"><TriangleAlert size={14} aria-hidden/>{t('safetyIssue')}</span>}
          {s.sourceReliabilityUnknown&&<span className="flag caution"><CircleAlert size={14} aria-hidden/>{t('sourceUnknown')}</span>}
        </div>}
      </article>
      <article className="card">
        <div className="section-heading"><div><h2>{t('reports')}</h2><p className="section-sub">{t('reportsSub')}</p></div></div>
        {s.reports.length?<ol className="report-list">{s.reports.map((r,index)=><li className="report-item" key={r.id}>
          <span className="report-number">{pad(index+1)}</span>
          <div className="report-content">
            <div className="report-heading"><strong>{r.sourceLabel}</strong><span className="tag-row"><ReliabilityTag value={r.reliability} t={t}/><span className="tag neutral">{t(`signal_${r.signal}`)}</span>{r.provenanceKind==='competition'&&<span className="tag outline">{t('suppliedShort')}</span>}{r.expandingImpact&&<span className="tag caution">{t('expanding')}</span>}</span></div>
            <p className={`usable ${detail.policy.usableReportIds.includes(r.id)?'yes':''}`}>{detail.policy.usableReportIds.includes(r.id)?t('countsTowardRisk'):t('notCounted')}</p>
            <p className="report-text">{r.text}</p>
            <p className="report-meta">{t('reportScope')}: {r.applicablePeriod}<span className="dot" aria-hidden>·</span>{t('reportedAt')}: {r.reportedAt||t('notApplicable')}{r.verificationBasis&&<><span className="dot" aria-hidden>·</span>{t('verification')}: {r.verificationBasis}</>}</p>
            <Citations ids={[`REPORT:${r.id}`]} t={t}/>
          </div>
        </li>)}</ol>:<p className="muted">{t('noReports')}</p>}
      </article>
    </div>
    <div className="stack">
      <article className="card">
        <div className="section-heading"><div><h2>{t('rulesView')}</h2><p className="section-sub">{t('riskSeparate')}</p></div></div>
        {currentAssessment(detail)&&<div className="policy-risk"><div><span className="mini-label">{t('policyRisk')}</span><RiskBadge level={detail.policy.riskLevel} t={t}/></div><p>{t('policyRiskNote')}</p></div>}
        <Constraints policy={detail.policy.constraints} locale={locale} t={t}/>
        {detail.policy.gaps.length>0&&<><h3 className="mini-heading">{t('policyGaps')}</h3><ul className="plain-list">{detail.policy.gaps.map((g,i)=><li key={i}>{g[locale]}</li>)}</ul></>}
        <h3 className="mini-heading">{t('rules')}</h3>
        <Citations ids={detail.policy.ruleIds} t={t}/>
      </article>
    </div>
  </div>;
}
