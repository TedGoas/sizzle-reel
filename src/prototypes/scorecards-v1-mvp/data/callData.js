export const callDetails = {
  date: 'Jul 11, 2025',
  time: '4:44pm - 4:55pm',
  duration: '11min',
  participants: 'Evan Conover, Don Brodka',
}

export const chapters = [
  { id: 'insights', time: null, label: 'Meeting Insights', isAi: true },
  { id: 'welcome', time: '00:02', label: 'Welcome' },
  { id: 'confirm-account', time: '00:10', label: "Confirm Evan's account" },
  { id: 'fitbit-problem', time: '01:20', label: "Problem with Evan's Fitbit" },
  { id: 'try-restarting', time: '04:26', label: 'Try restarting' },
  { id: 'factory-reset', time: '06:19', label: 'Reset to factory settings' },
  { id: 'follow-up', time: '09:29', label: 'Agent to follow up with team' },
  { id: 'anything-else', time: '11:32', label: 'Anything else?' },
]

export const moments = [
  { count: 20, label: 'Interesting question' },
  { count: 4, label: 'Currency' },
  { count: 3, label: 'Negative sentiment' },
  { count: 1, label: 'Positive sentiment' },
]

export const aiInsight = "The conversation is about a person's experience with their Fitbit Charge 5. They like it but are having trouble getting it to sync with their account. The speaker is discussing how he tried restarting his computer. The agent suggested restarting the device and resetting to the factory settings. This solved the person's problem. The agent said they would follow up with their team about why the issue occurred."

export const transcript = [
  // Welcome
  { chapter: 'welcome', speaker: 'agent', name: 'Don', time: '00:02', text: "Thank you for calling Fitbit support. My name is Don, how can I help you today?" },
  { chapter: 'welcome', speaker: 'customer', name: 'Evan', time: '00:08', text: "Hi Don, I'm Evan. I'm having some issues with my Fitbit Charge 5." },
  // Confirm account
  { chapter: 'confirm-account', speaker: 'agent', name: 'Don', time: '00:10', text: "I'd be happy to help you with that, Evan. Can I get your account email to pull up your information?" },
  { chapter: 'confirm-account', speaker: 'customer', name: 'Evan', time: '00:18', text: "Sure, it's evan.conover@email.com." },
  { chapter: 'confirm-account', speaker: 'agent', name: 'Don', time: '00:25', text: "Great, I've got your account pulled up. What seems to be the issue?" },
  // Fitbit problem
  { chapter: 'fitbit-problem', speaker: 'customer', name: 'Evan', time: '01:20', text: "So I've had this Charge 5 for about 30 seconds and it's been awesome, but recently it stopped syncing with my phone. I've tried everything I can think of." },
  { chapter: 'fitbit-problem', speaker: 'agent', name: 'Don', time: '01:35', text: "I understand how frustrating that must be. Let me help you troubleshoot this. When did the syncing issue first start?" },
  { chapter: 'fitbit-problem', speaker: 'customer', name: 'Evan', time: '01:50', text: "About three days ago. I noticed my steps weren't updating on the app anymore." },
  { chapter: 'fitbit-problem', speaker: 'agent', name: 'Don', time: '02:05', text: "OK, and have you tried restarting both your phone and the Fitbit?" },
  { chapter: 'fitbit-problem', speaker: 'customer', name: 'Evan', time: '02:15', text: "I restarted my phone but I'm not sure how to restart the Fitbit itself." },
  // Try restarting
  { chapter: 'try-restarting', speaker: 'agent', name: 'Don', time: '04:26', text: "No problem at all. To restart your Charge 5, press and hold the button on the side for about 8 seconds until you see the Fitbit logo. Then release the button." },
  { chapter: 'try-restarting', speaker: 'customer', name: 'Evan', time: '04:50', text: "OK, I see the logo now. It's restarting... alright, it's back on. Let me try syncing." },
  { chapter: 'try-restarting', speaker: 'agent', name: 'Don', time: '05:10', text: "Take your time. Open the Fitbit app and pull down to sync." },
  { chapter: 'try-restarting', speaker: 'customer', name: 'Evan', time: '05:30', text: "Hmm, it's still not syncing. I'm sorry, this is really frustrating." },
  // Factory reset
  { chapter: 'factory-reset', speaker: 'agent', name: 'Don', time: '06:19', text: "I completely understand. Let's try one more thing. We can do a factory reset which will clear the device and re-pair it with your phone. This usually resolves syncing issues. Your data is saved in the cloud so you won't lose anything." },
  { chapter: 'factory-reset', speaker: 'customer', name: 'Evan', time: '06:45', text: "Awesome, let's try that. What do I need to do?" },
  { chapter: 'factory-reset', speaker: 'agent', name: 'Don', time: '07:00', text: "Go to Settings on your Charge 5, scroll down to About, then select Factory Reset. Confirm when prompted." },
  { chapter: 'factory-reset', speaker: 'customer', name: 'Evan', time: '08:20', text: "OK it's resetting now... and it's done. Let me try pairing it again through the app." },
  { chapter: 'factory-reset', speaker: 'customer', name: 'Evan', time: '09:00', text: "It's syncing! Everything seems to be working now. Thank you so much, Don!" },
  // Follow up
  { chapter: 'follow-up', speaker: 'agent', name: 'Don', time: '09:29', text: "That's great to hear! I'm glad we got it working. I'm going to follow up with our team about why this syncing issue occurred so we can prevent it in the future." },
  { chapter: 'follow-up', speaker: 'customer', name: 'Evan', time: '09:50', text: "That would be great. I really appreciate you looking into it." },
  // Anything else
  { chapter: 'anything-else', speaker: 'agent', name: 'Don', time: '11:32', text: "Of course! Is there anything else I can help you with today?" },
  { chapter: 'anything-else', speaker: 'customer', name: 'Evan', time: '11:40', text: "No, that's all. Thanks again, Don!" },
  { chapter: 'anything-else', speaker: 'agent', name: 'Don', time: '11:45', text: "You're welcome, Evan. Have a great day!" },
]

export const scorecardQuestions = [
  { text: 'Did the agent greet the customer?', points: 10, answer: 'Yes', gradedByAi: true },
  { text: 'Did the agent restate the purpose of the conversation?', points: 10, answer: 'Yes', gradedByAi: true },
  { text: "Was the caller's account information verified?", points: 10, answer: 'Yes', gradedByAi: true },
  { text: "Did the agent understand the nature of the caller's issue?", points: 10, answer: 'Yes', gradedByAi: true },
  { text: 'Did the agent ask to put the customer on hold?', points: 10, answer: 'Yes', gradedByAi: true },
  { text: "Did the agent confirm the customers issue was resolved?", points: 10, answer: 'Yes', gradedByAi: true },
  { text: 'Did the agent provide a call closing statement?', points: 10, answer: 'Yes', gradedByAi: true },
  { text: 'Did the agent ask if further assistance was required?', points: 10, answer: 'Yes', gradedByAi: true },
]

export const playbackSegments = [
  { color: '#d4d4d4', width: 6 },
  { color: '#FB2C36', width: 2 },
  { color: '#d4d4d4', width: 10 },
  { color: '#2B7FFF', width: 3 },
  { color: '#d4d4d4', width: 8 },
  { color: '#00BC7D', width: 2 },
  { color: '#00BC7D', width: 3 },
  { color: '#d4d4d4', width: 12 },
  { color: '#00BC7D', width: 2 },
  { color: '#d4d4d4', width: 6 },
  { color: '#2B7FFF', width: 3 },
  { color: '#d4d4d4', width: 4 },
  { color: '#2B7FFF', width: 2 },
  { color: '#00BC7D', width: 3 },
  { color: '#d4d4d4', width: 5 },
  { color: '#F0B100', width: 2 },
  { color: '#d4d4d4', width: 4 },
  { color: '#FB2C36', width: 3 },
  { color: '#d4d4d4', width: 8 },
  { color: '#2B7FFF', width: 2 },
  { color: '#d4d4d4', width: 10 },
]
