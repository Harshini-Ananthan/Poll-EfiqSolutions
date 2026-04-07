export const mockUser = {
  name: 'Arun Kumar',
  phone: '+9198657462',
  initials: 'AK',
};

export const mockPoll = {
  id: '1',
  date: 'TODAY · MAR 20',
  question: 'Choose your lunch',
  options: [
    {
      id: 'veg',
      label: 'Veg Meals',
      description: 'Rice, sambar, 3 curries',
      emoji: '🥗',
    },
    {
      id: 'nonveg',
      label: 'Non-Veg Meals',
      description: 'Rice, chicken curry, gravy',
      emoji: '🍗',
    },
    {
      id: 'thali',
      label: 'Special Thali',
      description: 'Veg + sweets combo',
      emoji: '🍱',
    },
  ],
  cutoffTime: '10:30 AM',
};

export const mockSummaryThisMonth = [
  { id: '1', date: 'Mar 19', meal: 'Non-Veg Meals', type: 'Non-veg' },
  { id: '2', date: 'Mar 18', meal: 'Veg Meals', type: 'Veg' },
  { id: '3', date: 'Mar 17', meal: 'Special Thali', type: 'Veg' },
  { id: '4', date: 'Mar 14', meal: 'Non-Veg Meals', type: 'Non-veg' },
  { id: '5', date: 'Mar 13', meal: 'Veg Meals', type: 'Veg' },
  { id: '6', date: 'Mar 12', meal: 'Veg Meals', type: 'Veg' },
  { id: '7', date: 'Mar 11', meal: 'Special Thali', type: 'Veg' },
];

export const mockSummaryLastMonth = [
  { id: '1', date: 'Feb 28', meal: 'Veg Meals', type: 'Veg' },
  { id: '2', date: 'Feb 27', meal: 'Non-Veg Meals', type: 'Non-veg' },
  { id: '3', date: 'Feb 26', meal: 'Veg Meals', type: 'Veg' },
  { id: '4', date: 'Feb 25', meal: 'Special Thali', type: 'Veg' },
  { id: '5', date: 'Feb 24', meal: 'Non-Veg Meals', type: 'Non-veg' },
];

// Keep for backward compat
export const mockSummaryPolls = mockSummaryThisMonth.map((item) => ({
  id: item.id,
  question: 'Choose your lunch',
  selectedOption: item.meal,
  timestamp: item.date,
}));
