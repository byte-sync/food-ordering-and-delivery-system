export async function sendSMS(phoneNumber: string, message: string): Promise<void> {
    console.log(`[SMS] Sending to ${phoneNumber}: ${message}`);
    // Simulate success
    return;
  }
  
  export async function sendEmail(email: string, message: string): Promise<void> {
    console.log(`[EMAIL] Sending to ${email}: ${message}`);
    // Simulate success
    return;
  }