import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import SideBar from './SideBar'
import {
  MdMailOutline,
  MdSearch,
  MdClose,
  MdOutlineEventNote,
  MdOutlinePeople,
  MdOutlineCurrencyRupee,
  MdOutlineLocationOn,
  MdOutlineCalendarToday,
  MdTrendingUp,
  MdOutlineToday,
  MdArrowForward,
} from 'react-icons/md'
import { FaSpinner, FaExclamationCircle, FaPhone, FaEnvelope } from 'react-icons/fa'

// Same SheetDB endpoint used by the Contact form
const SHEETDB_URL = 'https://sheetdb.io/api/v1/ojuaqpmrsdyaq'

// ---- Helpers ----
const parseTimestamp = (ts) => {
  if (!ts) return null
  const d = new Date(ts)
  return isNaN(d.getTime()) ? null : d
}

const isWithinLastDays = (date, days) => {
  if (!date) return false
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return date >= cutoff
}

const isUpcoming = (dateStr, daysAhead = 30) => {
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return false
  const now = new Date()
  const future = new Date()
  future.setDate(future.getDate() + daysAhead)
  return d >= now && d <= future
}

// ---- Call Button (reusable) ----
const CallButton = ({ phone, variant = 'icon', stopPropagation = true, className = '' }) => {
  if (!phone) return null

  const handleClick = (e) => {
    if (stopPropagation) e.stopPropagation()
  }

  if (variant === 'pill') {
    return (
      <a
        href={`tel:${phone}`}
        onClick={handleClick}
        className={`flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium hover:bg-green-100 flex-shrink-0 ${className}`}
        title={`Call ${phone}`}
      >
        <FaPhone size={11} /> Call
      </a>
    )
  }

  if (variant === 'button') {
    return (
      <a
        href={`tel:${phone}`}
        onClick={handleClick}
        className={`flex items-center gap-1.5 text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700 flex-shrink-0 ${className}`}
        title={`Call ${phone}`}
      >
        <FaPhone size={12} /> Call
      </a>
    )
  }

  // default: icon only
  return (
    <a
      href={`tel:${phone}`}
      onClick={handleClick}
      className={`text-green-600 hover:text-green-700 p-1 rounded-full hover:bg-green-50 flex-shrink-0 ${className}`}
      title={`Call ${phone}`}
    >
      <FaPhone size={12} />
    </a>
  )
}

// ---- Stat Card ----
const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${accent}1A`, color: accent }}
    >
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
)

// ---- Dashboard ----
const DashboardContent = ({ enquiries, loading, error, onRetry, onViewAll, onSelect }) => {
  const stats = useMemo(() => {
    const total = enquiries.length
    const withDates = enquiries.map((e) => ({ ...e, _date: parseTimestamp(e.timestamp) }))

    const last7Days = withDates.filter((e) => isWithinLastDays(e._date, 7)).length
    const last30Days = withDates.filter((e) => isWithinLastDays(e._date, 30)).length

    const typeCounts = {}
    enquiries.forEach((e) => {
      const type = e.eventType?.trim()
      if (type) typeCounts[type] = (typeCounts[type] || 0) + 1
    })
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]

    const breakdown = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([type, count]) => ({ type, count, pct: total ? Math.round((count / total) * 100) : 0 }))

    const upcoming = enquiries
      .filter((e) => isUpcoming(e.preferredDate, 30))
      .sort((a, b) => new Date(a.preferredDate) - new Date(b.preferredDate))
      .slice(0, 5)

    const recent = withDates
      .filter((e) => e._date)
      .sort((a, b) => b._date - a._date)
      .slice(0, 5)

    return { total, last7Days, last30Days, topType, breakdown, upcoming, recent }
  }, [enquiries])

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-500 py-16">
        <FaSpinner className="animate-spin" />
        <span>Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-red-500 py-16">
        <FaExclamationCircle size={22} />
        <p className="text-sm">Failed to load dashboard data.</p>
        <button
          onClick={onRetry}
          className="text-sm px-4 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
        >
          Retry
        </button>
      </div>
    )
  }

  const barColors = ['#2563eb', '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899']

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6">Overview of your enquiries.</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={MdMailOutline} label="Total Enquiries" value={stats.total} accent="#2563eb" />
        <StatCard icon={MdTrendingUp} label="Last 7 Days" value={stats.last7Days} accent="#10b981" />
        <StatCard icon={MdOutlineToday} label="Last 30 Days" value={stats.last30Days} accent="#f59e0b" />
        <StatCard
          icon={MdOutlineEventNote}
          label="Top Event Type"
          value={stats.topType ? stats.topType[0] : '—'}
          accent="#8b5cf6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Event type breakdown */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Enquiries by Event Type</h2>
          {stats.breakdown.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.breakdown.map(({ type, count, pct }, idx) => (
                <div key={type}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">{type}</span>
                    <span className="text-gray-400">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: barColors[idx % barColors.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming preferred dates */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Preferred Dates (next 30 days)</h2>
          {stats.upcoming.length === 0 ? (
            <p className="text-sm text-gray-400">Nothing coming up.</p>
          ) : (
            <div className="space-y-2">
              {stats.upcoming.map((e, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelect(e)}
                  className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <MdOutlineCalendarToday className="text-blue-600" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{e.name || 'Unnamed'}</p>
                      <p className="text-xs text-gray-400">{e.eventType || 'Event'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">{e.preferredDate}</span>
                    <CallButton phone={e.phone} variant="icon" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent enquiries */}
      <div className="bg-white rounded-lg shadow p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Recent Enquiries</h2>
          <button
            onClick={onViewAll}
            className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
          >
            View all <MdArrowForward size={14} />
          </button>
        </div>

        {stats.recent.length === 0 ? (
          <p className="text-sm text-gray-400">No enquiries yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {stats.recent.map((e, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(e)}
                className="w-full flex items-center justify-between text-left py-3 hover:bg-gray-50 px-2 -mx-2 rounded-md"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{e.name || 'Unnamed'}</p>
                  <p className="text-xs text-gray-400">{e.eventType || '—'} · {e.phone || e.email || '—'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{e.timestamp}</span>
                  <CallButton phone={e.phone} variant="icon" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Detail Modal ----
const EnquiryModal = ({ enquiry, onClose }) => {
  if (!enquiry) return null

  const rows = [
    { icon: FaPhone, label: 'Phone', value: enquiry.phone },
    { icon: FaEnvelope, label: 'Email', value: enquiry.email },
    { icon: MdOutlineEventNote, label: 'Event Type', value: enquiry.eventType },
    { icon: MdOutlineCalendarToday, label: 'Preferred Date', value: enquiry.preferredDate },
    { icon: MdOutlinePeople, label: 'Expected Guests', value: enquiry.guestCount },
    { icon: MdOutlineCurrencyRupee, label: 'Budget Range', value: enquiry.budgetRange },
    { icon: MdOutlineLocationOn, label: 'Venue Preference', value: enquiry.venuePreference },
  ].filter((r) => r.value)

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{enquiry.name || 'Enquiry'}</h2>
            {enquiry.timestamp && (
              <p className="text-xs text-gray-400 mt-0.5">Submitted {enquiry.timestamp}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {enquiry.phone && (
              <a
                href={`tel:${enquiry.phone}`}
                className="flex items-center gap-1.5 text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700"
                title={`Call ${enquiry.phone}`}
              >
                <FaPhone size={12} /> Call
              </a>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <MdClose size={22} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Icon size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                  <p className="text-sm text-gray-700">{value}</p>
                </div>
              </div>
              {label === 'Phone' && <CallButton phone={value} variant="button" stopPropagation={false} />}
            </div>
          ))}

          {enquiry.message && (
            <div className="pt-2 border-t border-gray-100 mt-3">
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Message</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Enquiry Section ----
const EnquiryContent = ({ enquiries, loading, error, onRetry, selected, setSelected }) => {
  const [search, setSearch] = useState('')

  const filtered = enquiries.filter((enq) => {
    const q = search.toLowerCase()
    return (
      enq.name?.toLowerCase().includes(q) ||
      enq.email?.toLowerCase().includes(q) ||
      enq.phone?.toLowerCase().includes(q) ||
      enq.eventType?.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <MdMailOutline size={26} className="text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Enquiries</h1>
          {!loading && !error && (
            <span className="text-sm text-gray-400 ml-1">({filtered.length})</span>
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-gray-500 py-16">
          <FaSpinner className="animate-spin" />
          <span>Loading enquiries...</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-3 text-red-500 py-16">
          <FaExclamationCircle size={22} />
          <p className="text-sm">Failed to load enquiries.</p>
          <button
            onClick={onRetry}
            className="text-sm px-4 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center text-gray-400 py-16 text-sm">No enquiries found.</div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Event Type</th>
                  <th className="px-4 py-3">Preferred Date</th>
                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enq, idx) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{enq.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>{enq.phone || '—'}</span>
                        <CallButton phone={enq.phone} variant="icon" />
                      </div>
                      {enq.email && <div className="text-xs text-gray-400">{enq.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{enq.eventType || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{enq.preferredDate || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{enq.guestCount || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{enq.budgetRange || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{enq.timestamp || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(enq)}
                        className="text-blue-600 text-xs font-medium hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.map((enq, idx) => (
              <button
                key={idx}
                onClick={() => setSelected(enq)}
                className="w-full text-left bg-white rounded-lg shadow p-4"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800">{enq.name || '—'}</span>
                  <span className="text-xs text-gray-400">{enq.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{enq.phone || '—'}</p>
                  <CallButton phone={enq.phone} variant="pill" />
                </div>
                {enq.email && <p className="text-sm text-gray-500">{enq.email}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  {enq.eventType && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {enq.eventType}
                    </span>
                  )}
                  {enq.budgetRange && (
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                      {enq.budgetRange}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState(null)

  const fetchEnquiries = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await axios.get(SHEETDB_URL)
      setEnquiries([...res.data].reverse())
    } catch (err) {
      console.error('Failed to fetch enquiries:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'enquiry':
        return (
          <EnquiryContent
            enquiries={enquiries}
            loading={loading}
            error={error}
            onRetry={fetchEnquiries}
            selected={selected}
            setSelected={setSelected}
          />
        )
      case 'dashboard':
      default:
        return (
          <DashboardContent
            enquiries={enquiries}
            loading={loading}
            error={error}
            onRetry={fetchEnquiries}
            onViewAll={() => setActiveTab('enquiry')}
            onSelect={setSelected}
          />
        )
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">{renderContent()}</main>
      <EnquiryModal enquiry={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default Admin