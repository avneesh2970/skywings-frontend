"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useState } from "react"
import {
  Calendar,
  MapPin,
  Tag,
  Star,
  X,
  Clock,
  Users,
  ExternalLink,
  User,
  Share2,
  Bookmark,
  CalendarCheck,
  CalendarX,
  CalendarOff,
} from "lucide-react"
import { motion } from "framer-motion"

export default function EventDetailsModal({ event, isOpen, onClose, formatDate, getStatusBadge, apiUrl }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  if (!event) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="relative">
                  <div className="h-64 md:h-96 bg-gray-200 overflow-hidden">
                    {event.imageUrl ? (
                      <img
                        src={`${apiUrl}${event.imageUrl}`}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/community-event.png"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
                        <Calendar className="h-24 w-24 text-purple-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>

                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-md"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <div
                      className={`${
                        getStatusBadge(event.calculatedStatus || event.status).color
                      } px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-md backdrop-blur-sm`}
                    >
                      {getStatusBadge(event.calculatedStatus || event.status).icon}
                      <span className="capitalize ml-1">{event.calculatedStatus || event.status}</span>
                    </div>

                    {event.featured && (
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-md backdrop-blur-sm">
                        <Star className="h-4 w-4 mr-1" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <motion.button
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark event"}
                    >
                      <Bookmark
                        className={`h-5 w-5 ${isBookmarked ? "text-purple-600 fill-purple-600" : "text-gray-700"}`}
                      />
                    </motion.button>

                    <motion.button
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Share event"
                    >
                      <Share2 className="h-5 w-5 text-gray-700" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-8">
                  <Dialog.Title as="h2" className="text-3xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </Dialog.Title>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="col-span-2">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">About This Event</h3>
                      <p className="text-gray-600 whitespace-pre-line text-lg leading-relaxed">{event.description}</p>

                      {/* Additional content section */}
                      {event.additionalInfo && (
                        <div className="mt-6">
                          <h4 className="text-lg font-medium text-gray-800 mb-2">Additional Information</h4>
                          <p className="text-gray-600">{event.additionalInfo}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl space-y-6 shadow-sm">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Date & Time</h4>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-800">{formatDate(event.startDate)}</div>
                            {event.endDate && event.startDate !== event.endDate && (
                              <div className="text-gray-600 mt-1">to {formatDate(event.endDate)}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Location</h4>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-800">{event.location}</span>
                        </div>
                      </div>

                      {event.category && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Category</h4>
                          <div className="flex items-center">
                            <Tag className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                              {event.category}
                            </span>
                          </div>
                        </div>
                      )}

                      {event.organizer && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Organizer</h4>
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-800">{event.organizer}</span>
                          </div>
                        </div>
                      )}

                      {event.capacity > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Capacity</h4>
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-800">{event.capacity} attendees</span>
                          </div>
                        </div>
                      )}

                      {/* Status indicator with explanation */}
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Status</h4>
                        <div className="flex items-center">
                          {event.calculatedStatus === "upcoming" && (
                            <>
                              <Calendar className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                              <span className="text-blue-700">This event is coming up soon</span>
                            </>
                          )}
                          {event.calculatedStatus === "ongoing" && (
                            <>
                              <CalendarCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-green-700">This event is happening now</span>
                            </>
                          )}
                          {event.calculatedStatus === "past" && (
                            <>
                              <CalendarX className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">This event has already ended</span>
                            </>
                          )}
                          {event.calculatedStatus === "cancelled" && (
                            <>
                              <CalendarOff className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                              <span className="text-red-700">This event has been cancelled</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                    <motion.button
                      onClick={onClose}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Close
                    </motion.button>

                    {event.registrationUrl &&
                      (event.calculatedStatus === "upcoming" || event.calculatedStatus === "ongoing") &&
                      event.calculatedStatus !== "cancelled" && (
                        <motion.a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-medium shadow-md"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Register Now
                          <ExternalLink className="h-4 w-4" />
                        </motion.a>
                      )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
