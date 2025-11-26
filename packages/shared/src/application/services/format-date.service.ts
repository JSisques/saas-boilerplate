/**
 * Formats a date to DD-MM-YYYY HH:MM format
 * @param date - Date as string (ISO format) or Date object
 * @returns Formatted date string in DD-MM-YYYY HH:MM format
 */
export function formatDate(date: string | Date | undefined): string {
  if (!date) {
    return "-";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "-";
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
