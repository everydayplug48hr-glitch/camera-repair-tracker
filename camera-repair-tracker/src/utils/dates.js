export const STATUSES = ['Received','Diagnosing','Quote Sent','Awaiting Parts','In Repair','Ready for Collection','Collected']
export const isWaiting = (r) => !['Ready for Collection', 'Collected'].includes(r.status)
export const money = (n) => (n == null || n === '' ? '-' : 'R' + Number(n).toFixed(2))

// Days until the repair is due. null = no estimate yet, negative = overdue.
export function daysLeft(r) {
  if (!r.estimated_days) return null
  const due = new Date(r.date_received + 'T00:00:00')
  due.setDate(due.getDate() + Number(r.estimated_days))
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.round((due - today) / 86400000)
}
export function daysLabel(r) {
  const d = daysLeft(r)
  if (d === null) return 'Not estimated yet'
  if (d < 0) return `Overdue by ${-d} day${d === -1 ? '' : 's'}`
  if (d === 0) return 'Due today'
  return `${d} day${d === 1 ? '' : 's'} left`
}
