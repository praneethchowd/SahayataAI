const API_BASE_URL = 'https://sahayataai-backend.onrender.com';

// Type definitions
interface EligibilityCriteria {
  gender?: string;
  age?: number;
  occupation?: string;
  location?: string;
  caste?: string;
  disability?: boolean;
  minority?: boolean;
  annual_income?: number;
}

interface SignupData {
  name: string;
  mobile: string;
  dob: string;
  gender: string;
  username: string;
  password: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

// Statistics API
export const getStatistics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/schemes/statistics`);
  if (!response.ok) throw new Error('Failed to fetch statistics');
  return response.json();
};

// Search schemes
export const searchSchemes = async (query: string, language: string = 'en') => {
  const response = await fetch(
    `${API_BASE_URL}/api/schemes/search?query=${encodeURIComponent(query)}&language=${language}`
  );
  if (!response.ok) throw new Error('Search failed');
  return response.json();
};

// Get schemes by category
export const getSchemesByCategory = async (category: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/schemes/category/${encodeURIComponent(category)}`
  );
  if (!response.ok) throw new Error('Failed to fetch category schemes');
  return response.json();
};

// Get scheme details
export const getSchemeDetails = async (schemeId: number) => {
  const response = await fetch(`${API_BASE_URL}/api/schemes/${schemeId}`);
  if (!response.ok) throw new Error('Failed to fetch scheme details');
  return response.json();
};

// Check eligibility
export const checkEligibility = async (criteria: EligibilityCriteria) => {
  const response = await fetch(`${API_BASE_URL}/api/schemes/check-eligibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  });
  if (!response.ok) throw new Error('Eligibility check failed');
  return response.json();
};

// Auth APIs
export const signup = async (userData: SignupData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Signup failed');
  }
  return response.json();
};

export const login = async (credentials: LoginCredentials) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }
  return response.json();
};
