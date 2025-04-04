
import { toast } from "@/components/ui/use-toast";

// This would be replaced with a real database in production
// Mock database implementation
class MockDatabase {
  private otpStorage: Record<string, { otp: string, expiresAt: number }> = {};
  private users: Record<string, any> = {};
  
  // Generate a unique ID
  generateId(): string {
    return `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
  
  // Store an OTP
  storeOTP(email: string, otp: string, expiresInMinutes: number = 15): void {
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
    this.otpStorage[email] = { otp, expiresAt };
  }
  
  // Verify an OTP
  verifyOTP(email: string, otp: string): boolean {
    const storedData = this.otpStorage[email];
    
    if (!storedData) {
      return false;
    }
    
    const { otp: storedOtp, expiresAt } = storedData;
    
    // Check if OTP is valid and not expired
    if (storedOtp === otp && expiresAt > Date.now()) {
      // Remove the used OTP from storage
      delete this.otpStorage[email];
      return true;
    }
    
    return false;
  }
  
  // Create a user
  createUser(userData: any): string | null {
    const { email } = userData;
    
    // Check if user already exists
    if (this.users[email]) {
      return null;
    }
    
    // Generate a unique ID
    const userId = this.generateId();
    
    // Save user data
    this.users[email] = {
      ...userData,
      id: userId,
      createdAt: new Date().toISOString()
    };
    
    console.log(`[DB] User created: ${email}`, this.users[email]);
    
    return userId;
  }
  
  // Get a user by email
  getUserByEmail(email: string): any {
    return this.users[email] || null;
  }
  
  // Get all users
  getAllUsers(): any[] {
    return Object.values(this.users);
  }
  
  // Update a user
  updateUser(email: string, updates: any): boolean {
    if (!this.users[email]) {
      return false;
    }
    
    this.users[email] = {
      ...this.users[email],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return true;
  }
  
  // Delete a user
  deleteUser(email: string): boolean {
    if (!this.users[email]) {
      return false;
    }
    
    delete this.users[email];
    return true;
  }
}

// Create a single instance of the database
const db = new MockDatabase();

// Helper to generate a random OTP
const generateOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Service to send an OTP to the user's email
export const sendOTPEmail = async (email: string): Promise<boolean> => {
  try {
    // Generate a 6-digit OTP
    const otp = generateOTP(6);
    
    // Store OTP with expiration (15 minutes)
    db.storeOTP(email, otp, 15);
    
    // In a real application, this would send an actual email
    // For demo purposes, we'll log it to the console and show a toast
    console.log(`[DEMO] OTP for ${email}: ${otp}`);
    
    // Show the OTP in a toast for demo purposes only
    // In production, this would be removed
    toast({
      title: "Demo Mode: OTP Generated",
      description: `Your OTP is: ${otp} (In production, this would be sent via email)`,
    });
    
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

// Service to verify an OTP
export const verifyOTP = (email: string, otp: string): boolean => {
  return db.verifyOTP(email, otp);
};

// Service to register a new user
export const registerUser = (userData: any): boolean => {
  try {
    const userId = db.createUser(userData);
    return userId !== null;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
};

// Service to authenticate a user
export const loginUser = (email: string, password: string): any => {
  const user = db.getUserByEmail(email);
  
  if (!user || user.password !== password) {
    return null;
  }
  
  // Return user data without sensitive information
  const { password: _, ...safeUserData } = user;
  return safeUserData;
};

// Get all registered users (for demo/admin purposes)
export const getAllUsers = (): any[] => {
  return db.getAllUsers().map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
};

// Update user profile
export const updateUserProfile = (email: string, profileData: any): boolean => {
  return db.updateUser(email, profileData);
};

// Get user by ID
export const getUserById = (userId: string): any | null => {
  const allUsers = db.getAllUsers();
  const user = allUsers.find(user => user.id === userId);
  
  if (!user) {
    return null;
  }
  
  // Return user data without sensitive information
  const { password, ...safeUserData } = user;
  return safeUserData;
};
