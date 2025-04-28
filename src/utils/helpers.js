/**
 * Format a date string to a more readable format
 */
export const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  /**
   * Format a date string to a relative time format (e.g., "2 days ago")
   */
  export const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`
    }
  
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
    }
  
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
    }
  
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
    }
  
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`
    }
  
    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`
  }
  
  /**
   * Truncate text to a specified length
   */
  export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }
  
  /**
   * Extract plain text from HTML content
   */
  export const extractTextFromHtml = (html) => {
    if (!html) return ""
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }
  
  /**
   * Generate a placeholder image URL
   */
  export const getPlaceholderImage = (width, height, text = "Blog Post") => {
    return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`
  }
  
  /**
   * Calculate estimated reading time
   */
  export const calculateReadingTime = (content) => {
    const text = extractTextFromHtml(content)
    const wordsPerMinute = 200
    const numberOfWords = text.split(/\s/g).length
    return Math.max(1, Math.ceil(numberOfWords / wordsPerMinute))
  }
  
  /**
   * Generate a random color based on a string (for avatar backgrounds, etc.)
   */
  export const stringToColor = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
  
    const hue = hash % 360
    return `hsl(${hue}, 70%, 60%)`
  }
  