// Mock API service for contracts management
const API_BASE_URL = '/';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication
export const authAPI = {
  login: async (username, password) => {
    await delay(1000); // Simulate network delay
    
    if (password !== 'test123') {
      throw new Error('Invalid credentials');
    }
    
    // Generate mock JWT
    const token = btoa(JSON.stringify({
      username,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      iat: Date.now()
    }));
    
    return { token, user: { username, name: username } };
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) return null;
    
    try {
      const payload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        authAPI.logout();
        return null;
      }
      return JSON.parse(user);
    } catch {
      authAPI.logout();
      return null;
    }
  }
};

// Contracts API
export const contractsAPI = {
  getContracts: async (page = 1, limit = 10, search = '', statusFilter = '', riskFilter = '') => {
    await delay(800); // Simulate network delay
    
    try {
      const response = await fetch(`${API_BASE_URL}contracts.json`);
      let contracts = await response.json();
      
      // Apply search filter
      if (search) {
        contracts = contracts.filter(contract => 
          contract.name.toLowerCase().includes(search.toLowerCase()) ||
          contract.parties.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply status filter
      if (statusFilter) {
        contracts = contracts.filter(contract => contract.status === statusFilter);
      }
      
      // Apply risk filter
      if (riskFilter) {
        contracts = contracts.filter(contract => contract.risk === riskFilter);
      }
      
      // Calculate pagination
      const total = contracts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedContracts = contracts.slice(startIndex, endIndex);
      
      return {
        contracts: paginatedContracts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch contracts');
    }
  },
  
  getContractById: async (id) => {
    await delay(600); // Simulate network delay
    
    try {
      const response = await fetch(`${API_BASE_URL}contract-details.json`);
      const contractDetails = await response.json();
      
      if (!contractDetails[id]) {
        throw new Error('Contract not found');
      }
      
      return contractDetails[id];
    } catch (error) {
      throw new Error('Failed to fetch contract details');
    }
  }
};

// File upload API (mock)
export const uploadAPI = {
  uploadFile: async (file) => {
    await delay(2000); // Simulate upload time
    
    // Simulate random success/failure
    const success = Math.random() > 0.1; // 90% success rate
    
    if (!success) {
      throw new Error('Upload failed');
    }
    
    return {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'success',
      uploadedAt: new Date().toISOString()
    };
  }
};
