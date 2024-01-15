import { createHash } from 'crypto';
import { sendVerificationCode, verifyCode } from './twilioService'; // You need to implement these functions

export default {
  id: 'phone',
  name: 'Phone',
  type: 'credentials',
  credentials: {
    phoneNumber: { label: "Phone Number", type: "text" },
    code: {  label: "Code", type: "text" }
  },
  authorize: async (credentials) => {
    const { phoneNumber, code } = credentials;

    if (!phoneNumber || !code) {
      throw new Error('Missing phone number or code');
    }

    const isValid = await verifyCode(phoneNumber, code);

    if (!isValid) {
      throw new Error('Invalid code');
    }

    // Use phone number as ID since it's unique
    const id = createHash('md5').update(phoneNumber).digest('hex');

    return Promise.resolve({ id, phoneNumber });
  }
}