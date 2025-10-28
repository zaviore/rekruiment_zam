export const MOCK_USERS = [
  { 
    id: '1', 
    email: 'admin@company.com', 
    password: 'admin123', 
    role: 'admin' as const, 
    name: 'Admin User' 
  },
  { 
    id: '2', 
    email: 'client@email.com', 
    password: 'client123', 
    role: 'user' as const, 
    name: 'John Doe' 
  },
];