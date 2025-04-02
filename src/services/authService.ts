
import { toast } from "@/components/ui/use-toast";

// This would be stored in a real database in production
const inMemoryOtpStorage: Record<string, { otp: string, expiresAt: number }> = {};
const inMemoryUsers: Record<string, any> = {};

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
    const expiresAt = Date.now() + 15 * 60 * 1000;
    inMemoryOtpStorage[email] = { otp, expiresAt };
    
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
  const storedData = inMemoryOtpStorage[email];
  
  if (!storedData) {
    return false;
  }
  
  const { otp: storedOtp, expiresAt } = storedData;
  
  // Check if OTP is valid and not expired
  if (storedOtp === otp && expiresAt > Date.now()) {
    // Remove the used OTP from storage
    delete inMemoryOtpStorage[email];
    return true;
  }
  
  return false;
};

// Service to register a new user
export const registerUser = (userData: any): boolean => {
  try {
    const { email } = userData;
    
    // Check if user already exists
    if (inMemoryUsers[email]) {
      return false;
    }
    
    // Generate a unique ID (in production, this would be handled by the database)
    const userId = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Save user data (in production, this would go to a database)
    inMemoryUsers[email] = {
      ...userData,
      id: userId,
      createdAt: new Date().toISOString()
    };
    
    console.log(`[DEMO] User registered: ${email}`, inMemoryUsers[email]);
    
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
};

// Service to authenticate a user
export const loginUser = (email: string, password: string): any => {
  const user = inMemoryUsers[email];
  
  if (!user || user.password !== password) {
    return null;
  }
  
  // Return user data without sensitive information
  const { password: _, ...safeUserData } = user;
  return safeUserData;
};

// Get all registered users (for demo/admin purposes)
export const getAllUsers = (): any[] => {
  return Object.values(inMemoryUsers).map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
};
