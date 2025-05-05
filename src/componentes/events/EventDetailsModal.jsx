"use client"

import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { Calendar, MapPin, Tag, Star, X, Clock, Users, ExternalLink, User } from "lucide-react"
import { motion } from "framer-motion"

export default function EventDetailsModal({ event, isOpen, onClose, formatDate, getStatusBadge, apiUrl }) {
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
          <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="relative">
                  <div className="h-64 md:h-80 bg-gray-200 overflow-hidden">
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
                      <div className="w-full h-full flex items-center justify-center bg-purple-100">
                        <Calendar className="h-24 w-24 text-purple-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  </div>

                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <div
                      className={`${
                        getStatusBadge(event.status).color
                      } px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm`}
                    >
                      {getStatusBadge(event.status).icon}
                      <span className="capitalize">{event.status}</span>
                    </div>

                    {event.featured && (
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-900 mb-4">
                    {event.title}
                  </Dialog.Title>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-2">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">About This Event</h4>
                      <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h4>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{formatDate(event.startDate)}</div>
                            {event.endDate && event.startDate !== event.endDate && (
                              <div className="text-gray-500">to {formatDate(event.endDate)}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Location</h4>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Category</h4>
                        <div className="flex items-center">
                          <Tag className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {event.organizer && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Organizer</h4>
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                            <span>{event.organizer}</span>
                          </div>
                        </div>
                      )}

                      {event.capacity > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Capacity</h4>
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                            <span>{event.capacity} attendees</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>

                    {event.registrationUrl && event.status !== "past" && event.status !== "cancelled" && (
                      <motion.a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        whileHover={{ backgroundColor: "#2563eb" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Register Now
                        <ExternalLink className="h-4 w-4 ml-1" />
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
