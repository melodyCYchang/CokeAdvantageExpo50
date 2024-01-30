// send-email.js

// We can use react-native Linking to send email
import { Linking } from 'react-native';

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  options = {}
) {
  const url = `mailto:${to}?subject=${subject}&body=${body}`;

  // check if we can use this link
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Provided URL can not be handled');
  }

  return Linking.openURL(url);
}
