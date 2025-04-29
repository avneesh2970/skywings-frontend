"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import {
  Calendar,
  Mail,
  FileText,
  Users,
  ArrowRight,
  Loader2,
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    events: { total: 0, upcoming: 0, recent: [] },
    resumes: { total: 0, new: 0, recent: [] },
    newsletter: { total: 0, active: 0, recent: [] },
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch events data
        const eventsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`, {
          params: { limit: 5, sort: "startDate", order: "asc" },
        })

        // Fetch resumes data
        const resumesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/resumes`, {
          params: { limit: 5, sort: "createdAt", order: "desc" },
        })

        // Fetch newsletter data
        const newsletterResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/newsletter`, {
          params: { limit: 5, sort: "createdAt", order: "desc" },
        })

        // Calculate stats
        const upcomingEvents = eventsResponse.data.data.filter((event) => event.status === "upcoming").length
        const newResumes = resumesResponse.data.data.filter((resume) => resume.status === "new").length
        const activeSubscribers = newsletterResponse.data.data.filter((sub) => sub.status === "active").length

        setStats({
          events: {
            total: eventsResponse.data.total,
            upcoming: upcomingEvents,
            recent: eventsResponse.data.data,
          },
          resumes: {
            total: resumesResponse.data.total,
            new: newResumes,
            recent: resumesResponse.data.data,
          },
          newsletter: {
            total: newsletterResponse.data.total,
            active: activeSubscribers,
            recent: newsletterResponse.data.data,
          },
        })

        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status badge color
  const getEventStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return { color: "bg-blue-100 text-blue-700", icon: <Calendar className="h-3 w-3 mr-1" /> }
      case "ongoing":
        return { color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
      case "past":
        return { color: "bg-gray-100 text-gray-700", icon: <Clock className="h-3 w-3 mr-1" /> }
      case "cancelled":
        return { color: "bg-red-100 text-red-700", icon: <XCircle className="h-3 w-3 mr-1" /> }
      default:
        return { color: "bg-purple-100 text-purple-700", icon: <Calendar className="h-3 w-3 mr-1" /> }
    }
  }

  const getResumeStatusBadge = (status) => {
    switch (status) {
      case "new":
        return { color: "bg-blue-100 text-blue-700", icon: <Clock className="h-3 w-3 mr-1" /> }
      case "reviewed":
        return { color: "bg-purple-100 text-purple-700", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
      case "contacted":
        return { color: "bg-yellow-100 text-yellow-700", icon: <Mail className="h-3 w-3 mr-1" /> }
      case "interviewed":
        return { color: "bg-orange-100 text-orange-700", icon: <Users className="h-3 w-3 mr-1" /> }
      case "rejected":
        return { color: "bg-red-100 text-red-700", icon: <XCircle className="h-3 w-3 mr-1" /> }
      case "hired":
        return { color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
      default:
        return { color: "bg-gray-100 text-gray-700", icon: <AlertCircle className="h-3 w-3 mr-1" /> }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-lg text-gray-600">Loading dashboard data...</span>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Events Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Events</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.events.total}</h3>
              <p className="text-sm text-blue-600 mt-1">{stats.events.upcoming} upcoming events</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link to="/admin/dashboard/events" className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            View all events
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Resume Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Resumes</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.resumes.total}</h3>
              <p className="text-sm text-purple-600 mt-1">{stats.resumes.new} new submissions</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <Link
            to="/admin/dashboard/resumes"
            className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
          >
            View all resumes
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Newsletter Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Newsletter Subscribers</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.newsletter.total}</h3>
              <p className="text-sm text-blue-600 mt-1">{stats.newsletter.active} active subscribers</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link
            to="/admin/dashboard/newsletter"
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View all subscribers
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Events</h2>
            <Link to="/admin/dashboard/events" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              See all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {stats.events.recent.length > 0 ? (
              stats.events.recent.map((event) => (
                <div key={event._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {event.imageUrl ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${event.imageUrl}`}
                            alt={event.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{event.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500 mr-2">{formatDate(event.startDate)}</span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getEventStatusBadge(event.status).color}`}
                          >
                            {getEventStatusBadge(event.status).icon}
                            <span className="capitalize">{event.status}</span>
                          </span>
                          {event.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No events found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Resumes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Resume Submissions</h2>
            <Link to="/admin/dashboard/resumes" className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
              See all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {stats.resumes.recent.length > 0 ? (
              stats.resumes.recent.map((resume) => (
                <div key={resume._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{resume.fullName}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 mr-2">{resume.jobAppliedFor}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getResumeStatusBadge(resume.status).color}`}
                        >
                          {getResumeStatusBadge(resume.status).icon}
                          <span className="capitalize">{resume.status}</span>
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(resume.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No resume submissions found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Newsletter Subscribers */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Newsletter Subscribers</h2>
            <Link
              to="/admin/dashboard/newsletter"
              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
            >
              See all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {stats.newsletter.recent.length > 0 ? (
              stats.newsletter.recent.map((subscriber) => (
                <div key={subscriber._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{subscriber.firstName}</h3>
                      <p className="text-xs text-gray-500 mt-1">{subscriber.email}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">{formatDate(subscriber.createdAt)}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          subscriber.status === "active"
                            ? "bg-green-100 text-green-700"
                            : subscriber.status === "bounced"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {subscriber.status === "active" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : subscriber.status === "bounced" ? (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        <span className="capitalize">{subscriber.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <Mail className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No newsletter subscribers found</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Activity Overview</h2>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Activity charts coming soon</p>
                <p className="text-xs text-gray-400 mt-1">Track user engagement and content performance</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Monthly Growth</p>
                    <p className="text-lg font-semibold text-gray-800">+12.5%</p>
                  </div>
                </div>
              </div> */}

              {/* <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">User Engagement</p>
                    <p className="text-lg font-semibold text-gray-800">87%</p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
