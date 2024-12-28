import { MailtrapClient } from 'mailtrap'
import dotenv from 'dotenv'

dotenv.config()

const TOKEN = process.env.MAILTRAP_TOKEN;

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "nexify.eco@gmail.com",
  name: "Nexify",
};

export { mailtrapClient, sender }