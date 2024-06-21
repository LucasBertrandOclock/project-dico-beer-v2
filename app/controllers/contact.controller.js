import { sendContactEmail } from "../utils/nodemailer.util.js";

const contactController = {
  async sendContactMail(req, res) {
    const { email, subject, message } = req.body;
    try {
      sendContactEmail(email, subject, message);
      return res.status(200).send("ca marche !");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};

export default contactController;
