// src/utils/dateUtils.js
const getDayString = (date = new Date()) => {
  return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
};

// Simple ISO week string "YYYY-Wxx"
const getWeekString = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Monday=1 ... Sunday=7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

module.exports = { getDayString, getWeekString };
