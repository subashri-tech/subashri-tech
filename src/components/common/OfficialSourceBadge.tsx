import React from 'react';
import { ShieldCheck, ExternalLink, RefreshCw, Building2 } from 'lucide-react';
import { OfficialSource } from '../../types';
import { formatDate } from '../../utils/dates';

interface OfficialSourceBadgeProps {
  source: OfficialSource;
  lastUpdated?: string;
  showLink?: boolean;
  compact?: boolean;
}

export const OfficialSourceBadge: React.FC<OfficialSourceBadgeProps> = ({
  source,
  lastUpdated,
  showLink = true,
  compact = false,
}) => {
  if (compact) {
    return (
      <div 
        id="official-source-compact" 
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/80"
        title={`Verified via ${source.name}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="truncate max-w-[140px]">{source.portalType}</span>
      </div>
    );
  }

  return (
    <div id="official-source-box" className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 transition-all hover:bg-emerald-50/90">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-emerald-600 p-2 text-white shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Official Verified Source
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                {source.portalType}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {source.name}
            </p>
            {source.referenceId && (
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Ref ID: <span className="text-slate-700 font-semibold">{source.referenceId}</span>
              </p>
            )}
            {source.sourceNotes && (
              <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-xl">
                {source.sourceNotes}
              </p>
            )}
          </div>
        </div>

        {showLink && (
          <a
            id="btn-visit-official-source"
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
          >
            <span>Visit Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {lastUpdated && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-emerald-200/50 pt-2 text-[11px] text-slate-500">
          <RefreshCw className="w-3 h-3 text-slate-400" />
          <span>Information verified & updated on <strong className="text-slate-700">{formatDate(lastUpdated)}</strong></span>
        </div>
      )}
    </div>
  );
};
