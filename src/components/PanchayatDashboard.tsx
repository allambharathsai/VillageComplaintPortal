import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Building2,
  ListFilter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Inbox,
  Search,
  ExternalLink,
  Edit3,
  Phone,
  MapPin,
  RefreshCw,
  Flame,
  Calendar,
  Layers,
  ChevronDown,
  X
} from 'lucide-react';
import { translations } from '../i18n/translations';
import {
  Complaint,
  ComplaintStatus,
  Language,
  ProblemType,
  UserProfile,
  Village
} from '../types';
import {
  fetchComplaints,
  updateComplaintStatus,
  getRepeatedComplaintIds,
  exportComplaintsToCsv,
  fetchVillages
} from '../services/db';
import { ComplaintDetailModal } from './ComplaintDetailModal';

interface PanchayatDashboardProps {
  lang: Language;
  currentUser: UserProfile;
}

export const PanchayatDashboard: React.FC<PanchayatDashboardProps> = ({
  lang,
  currentUser
}) => {
  const t = translations[lang];

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProblemType, setSelectedProblemType] = useState<string>('all');
  const [selectedLane, setSelectedLane] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals State
  const [viewComplaint, setViewComplaint] = useState<Complaint | null>(null);
  const [editStatusComplaint, setEditStatusComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('in_progress');
  const [officialRemark, setOfficialRemark] = useState('');
  const [updating, setUpdating] = useState(false);

  const villageId = currentUser.villageId || 'gurrajupalem';

  const loadData = async () => {
    setLoading(true);
    try {
      const [complaintsData, villagesData] = await Promise.all([
        fetchComplaints({ villageId }),
        fetchVillages()
      ]);
      setComplaints(complaintsData);
      setVillages(villagesData);
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('vpc_complaints_updated', handleUpdate);
    return () => window.removeEventListener('vpc_complaints_updated', handleUpdate);
  }, [villageId]);

  const currentVillage =
    villages.find((v) => v.id === villageId) || {
      name: 'Gurrajupalem',
      nameTe: 'గుర్రాజుపాలెం',
      mandal: 'G.Konduru',
      district: 'NTR District',
      pinCode: '521230'
    };

  // Repeated Complaints Detection: Set of complaint IDs
  const repeatedComplaintIds = useMemo(() => {
    return getRepeatedComplaintIds(complaints);
  }, [complaints]);

  // Unique lanes for filter dropdown
  const uniqueLanes = useMemo(() => {
    const lanes = Array.from(new Set(complaints.map((c) => c.laneName).filter(Boolean)));
    lanes.sort();
    return lanes;
  }, [complaints]);

  // Filtered Complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (selectedProblemType !== 'all' && c.problemType !== selectedProblemType) return false;
      if (selectedLane !== 'all' && c.laneName !== selectedLane) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = c.complaintId.toLowerCase().includes(q);
        const matchesLane = c.laneName.toLowerCase().includes(q);
        const matchesMobile = c.residentMobile?.includes(q);
        const matchesDesc = c.description?.toLowerCase().includes(q);
        if (!matchesId && !matchesLane && !matchesMobile && !matchesDesc) return false;
      }
      return true;
    });
  }, [complaints, selectedStatus, selectedProblemType, selectedLane, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = complaints.length;
    const received = complaints.filter((c) => c.status === 'received').length;
    const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    return { total, received, inProgress, resolved };
  }, [complaints]);

  // Chart Data: Frequency per Problem Type (most frequent first)
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      counts[c.problemType] = (counts[c.problemType] || 0) + 1;
    });

    const entries = Object.keys(counts).map((typeKey) => {
      const pKey = typeKey as ProblemType;
      return {
        key: pKey,
        name: t.problemTypes[pKey]?.title || pKey,
        count: counts[pKey]
      };
    });

    entries.sort((a, b) => b.count - a.count);
    return entries;
  }, [complaints, t.problemTypes]);

  const topProblem = chartData[0];

  // Colors for problem chart bars
  const BAR_COLORS = ['#059669', '#0284c7', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#4b5563'];

  // Handle Status Update
  const handleOpenStatusModal = (complaint: Complaint) => {
    setEditStatusComplaint(complaint);
    setNewStatus(complaint.status);
    setOfficialRemark('');
  };

  const handleSaveStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStatusComplaint) return;

    setUpdating(true);
    try {
      await updateComplaintStatus(
        editStatusComplaint.id,
        newStatus,
        officialRemark.trim(),
        currentUser.uid,
        currentUser.name || 'Panchayat Officer'
      );
      setEditStatusComplaint(null);
      loadData();
    } catch (err) {
      console.warn('Update failed:', err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_progress':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 pb-24 space-y-6">
      {/* Dashboard Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {lang === 'te' ? 'అధికారిక డాష్‌బోర్డ్' : 'Official Portal'}
            </span>
            <span className="text-xs font-mono text-slate-500">
              PIN: 521230 • GRP
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {lang === 'te' ? `${currentVillage.nameTe} గ్రామ పంచాయతీ కార్యాలయం` : `${currentVillage.name} Gram Panchayat Dashboard`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {currentVillage.mandal}, NTR District • {currentUser.name || 'Panchayat Secretary'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => exportComplaintsToCsv(filteredComplaints, currentVillage.name)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportCsvBtn}</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Refresh data"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.totalComplaintsCard}
            </span>
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {metrics.total}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {lang === 'te' ? 'అన్ని సమస్యల నివేదిక' : 'All grievances'}
          </span>
        </div>

        {/* Received */}
        <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              {t.receivedCard}
            </span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-900 font-mono">
            {metrics.received}
          </p>
          <span className="text-[11px] text-blue-700 mt-1 block font-medium">
            {lang === 'te' ? 'చర్య ప్రారంభించాల్సినవి' : 'Pending inspection'}
          </span>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {t.inProgressCard}
            </span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-900 font-mono">
            {metrics.inProgress}
          </p>
          <span className="text-[11px] text-amber-700 mt-1 block font-medium">
            {lang === 'te' ? 'పనులు కొనసాగుతున్నాయి' : 'Under active work'}
          </span>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {t.resolvedCard}
            </span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono">
            {metrics.resolved}
          </p>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">
            {lang === 'te' ? 'విజయవంతంగా పూర్తయినవి' : 'Resolved & verified'}
          </span>
        </div>
      </div>

      {/* Analytics Row: Problem Distribution Chart + Top Grievance Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recharts Bar Chart: Number of complaints per problem type */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              {t.problemDistributionChart}
            </h3>
            <span className="text-xs text-slate-500">
              {lang === 'te' ? 'అత్యధిక ఫిర్యాదుల క్రమంలో' : 'Highest to lowest'}
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    tick={{ fontSize: 11, fill: '#475569' }}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} complaints`, 'Count']}
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No complaint data yet.
              </div>
            )}
          </div>
        </div>

        {/* Top Problem Card & Repeated Problem Alert info */}
        <div className="space-y-4 flex flex-col">
          {topProblem && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-200 shadow-xs">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-amber-600" />
                {t.topProblemHighlight}
              </span>
              <h4 className="text-xl font-black text-amber-950">
                {topProblem.name}
              </h4>
              <p className="text-3xl font-black text-amber-800 font-mono my-1">
                {topProblem.count} <span className="text-sm font-semibold text-amber-700">{lang === 'te' ? 'ఫిర్యాదులు' : 'complaints'}</span>
              </p>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                {lang === 'te'
                  ? 'గ్రామంలో ఈ సమస్యపై అత్యధిక ఫిర్యాదులు వస్తున్నాయి. పారిశుద్ధ్య సిబ్బంది తక్షణ చర్యలు తీసుకోవాలి.'
                  : 'This grievance category has the highest number of resident reports in Gurrajupalem.'}
              </p>
            </div>
          )}

          {/* Repeated Problem Explanation Card */}
          <div className="bg-rose-50/80 rounded-3xl p-5 border border-rose-200 shadow-xs flex-1">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{t.repeatedProblemBadge}</span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed">
              {t.repeatedProblemTooltip}
            </p>
            <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs text-rose-950 font-bold">
              <span>{lang === 'te' ? 'గుర్తించబడిన సమూహాలు' : 'Flagged complaints'}:</span>
              <span className="font-mono bg-rose-200/80 px-2 py-0.5 rounded-md">
                {repeatedComplaintIds.size}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <ListFilter className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'te' ? 'ఫిల్టర్లు మరియు శోధన' : 'Filters & Search'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchByIdOrMobile}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
          >
            <option value="all">{t.filterByStatus}: {t.allOption}</option>
            <option value="received">{t.statuses.received.label}</option>
            <option value="in_progress">{t.statuses.in_progress.label}</option>
            <option value="resolved">{t.statuses.resolved.label}</option>
          </select>

          {/* Problem Type Filter */}
          <select
            value={selectedProblemType}
            onChange={(e) => setSelectedProblemType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
          >
            <option value="all">{t.filterByType}: {t.allOption}</option>
            {Object.keys(t.problemTypes).map((k) => (
              <option key={k} value={k}>
                {t.problemTypes[k as ProblemType]?.title}
              </option>
            ))}
          </select>

          {/* Lane Filter */}
          <select
            value={selectedLane}
            onChange={(e) => setSelectedLane(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
          >
            <option value="all">{t.filterByLane}: {t.allOption}</option>
            {uniqueLanes.map((lane) => (
              <option key={lane} value={lane}>
                {lane}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            {lang === 'te'
              ? `${filteredComplaints.length} ఫిర్యాదులు కనుగొనబడ్డాయి`
              : `Showing ${filteredComplaints.length} complaints`}
          </span>

          {(selectedStatus !== 'all' || selectedProblemType !== 'all' || selectedLane !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedProblemType('all');
                setSelectedLane('all');
                setSearchQuery('');
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              {lang === 'te' ? 'ఫిల్టర్లు క్లియర్ చేయండి' : 'Clear filters'}
            </button>
          )}
        </div>
      </div>

      {/* Complaints Table (Responsive for mobile & laptop) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">{lang === 'te' ? 'ఫోటో' : 'Photo'}</th>
                <th className="py-3 px-4">{lang === 'te' ? 'సమస్య రకం' : 'Problem Type'}</th>
                <th className="py-3 px-4">{lang === 'te' ? 'వీధి / కాలనీ' : 'Lane'}</th>
                <th className="py-3 px-4">{lang === 'te' ? 'నమోదు తేదీ' : 'Date'}</th>
                <th className="py-3 px-4">{lang === 'te' ? 'స్థితి' : 'Status'}</th>
                <th className="py-3 px-4">{lang === 'te' ? 'నివాసి ఫోన్' : 'Resident Phone'}</th>
                <th className="py-3 px-4 text-right">{lang === 'te' ? 'చర్యలు' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    {t.noComplaintsFound}
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const isRepeated = repeatedComplaintIds.has(c.id);
                  const typeLabel = t.problemTypes[c.problemType]?.title || c.problemType;
                  const statusLabel = t.statuses[c.status]?.label || c.status;

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isRepeated ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* ID + Repeated Badge */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div>
                          <span>{c.complaintId}</span>
                          {isRepeated && (
                            <span
                              title={t.repeatedProblemTooltip}
                              className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 cursor-help"
                            >
                              <Flame className="w-3 h-3 text-rose-600" />
                              <span>{lang === 'te' ? 'పునరావృతం' : 'Repeated'}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Photo Thumbnail */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setViewComplaint(c)}
                          className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer hover:scale-105 transition-transform"
                        >
                          {c.photoUrl ? (
                            <img
                              src={c.photoUrl}
                              alt="Grievance thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <MapPin className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Problem Type */}
                      <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                        {typeLabel}
                      </td>

                      {/* Lane Name */}
                      <td className="py-3 px-4 text-slate-700 max-w-[160px] truncate">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{c.laneName}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-md border text-[11px] ${getStatusBadge(
                            c.status
                          )}`}
                        >
                          {statusLabel}
                        </span>
                      </td>

                      {/* Resident Mobile */}
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        +91 {c.residentMobile}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setViewComplaint(c)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="View Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenStatusModal(c)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{t.updateStatusBtn}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {editStatusComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 space-y-4">
            <button
              onClick={() => setEditStatusComplaint(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                {editStatusComplaint.complaintId}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                {t.updateStatusModalTitle}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {t.problemTypes[editStatusComplaint.problemType]?.title} • {editStatusComplaint.laneName}
              </p>
            </div>

            <form onSubmit={handleSaveStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.newStatusLabel}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3.5 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-600 bg-slate-50 focus:bg-white text-sm font-bold text-slate-900 focus:outline-hidden transition-all"
                >
                  <option value="received">{t.statuses.received.label}</option>
                  <option value="in_progress">{t.statuses.in_progress.label}</option>
                  <option value="resolved">{t.statuses.resolved.label}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t.officialRemarkLabel}
                </label>
                <textarea
                  rows={3}
                  required
                  value={officialRemark}
                  onChange={(e) => setOfficialRemark(e.target.value)}
                  placeholder={t.officialRemarkPlaceholder}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-blue-600 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 focus:outline-hidden transition-all resize-none shadow-inner"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditStatusComplaint(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={updating || !officialRemark.trim()}
                  className="flex-2 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.savingStatus}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.saveStatusBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ComplaintDetailModal
        complaint={viewComplaint}
        isOpen={Boolean(viewComplaint)}
        onClose={() => setViewComplaint(null)}
        lang={lang}
        currentUser={currentUser}
      />
    </div>
  );
};
