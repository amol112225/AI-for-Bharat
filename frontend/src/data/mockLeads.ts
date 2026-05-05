export interface Lead {
  LeadID: string;
  FullName: string;
  Phone: string;
  City: string;
  State: string;
  Source: string;
  Interest: string;
  PreferredLanguage: string;
  TimeOfSignup: string;
  Status: 'New' | 'Calling' | 'Listening' | 'Objection Handling' | 'RM Assigned' | 'Converted' | 'Lost';
  ConversionProbability: string;
  Persona: string;
  NetworkSize: string;
}

const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Neha', 'Rohan', 'Pooja', 'Aditya', 'Anjali', 'Karan', 'Kavita', 'Sanjay', 'Divya', 'Arjun'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Desai', 'Reddy', 'Kumar', 'Gupta', 'Mehta', 'Joshi', 'Chauhan'];
const cities = ['Pune', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur'];
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan'];
const sources = ['Website Campaign', 'LinkedIn Ads', 'Referral', 'Direct Traffic', 'Google Search', 'Facebook Ads'];
const interests = ['Partner Program', 'Enterprise API', 'Standard Plan', 'Custom Solution', 'Reseller Agreement'];
const languages = ['Hinglish', 'English', 'Hindi', 'Marathi', 'Telugu', 'Tamil', 'Kannada'];
const statuses: Lead['Status'][] = ['New', 'Calling', 'Listening', 'Objection Handling', 'RM Assigned', 'Converted', 'Lost'];
const personas = ['High-Volume MFD', 'Tech Startup Founder', 'Retail Investor', 'Institutional Broker', 'Independent Consultant'];
const networks = ['500+ Clients', '100-500 Clients', '50-100 Clients', '10-50 Clients', 'Under 10 Clients'];

export const generateMockLeads = (count: number): Lead[] => {
  return Array.from({ length: count }, (_, i) => {
    const isSpecial = i === 0;
    return {
      LeadID: `L-${8000 + i}`,
      FullName: isSpecial ? 'Rahul Sharma' : `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      Phone: `+91 98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      City: isSpecial ? 'Pune' : cities[Math.floor(Math.random() * cities.length)],
      State: isSpecial ? 'Maharashtra' : states[Math.floor(Math.random() * states.length)],
      Source: isSpecial ? 'Website Campaign' : sources[Math.floor(Math.random() * sources.length)],
      Interest: isSpecial ? 'Partner Program' : interests[Math.floor(Math.random() * interests.length)],
      PreferredLanguage: isSpecial ? 'Hinglish' : languages[Math.floor(Math.random() * languages.length)],
      TimeOfSignup: isSpecial ? '10 mins ago' : `${Math.floor(Math.random() * 60)} mins ago`,
      Status: isSpecial ? 'Calling' : statuses[Math.floor(Math.random() * statuses.length)],
      ConversionProbability: isSpecial ? '78%' : `${Math.floor(Math.random() * 60 + 30)}%`,
      Persona: isSpecial ? 'High-Volume MFD' : personas[Math.floor(Math.random() * personas.length)],
      NetworkSize: isSpecial ? '500+ Clients' : networks[Math.floor(Math.random() * networks.length)],
    };
  });
};

export const mockLeads = generateMockLeads(105);
