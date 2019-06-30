import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      file_id: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title, description, location, date, file_id } = req.body;

    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'Meetup date invalid' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      user_id: req.userId,
      file_id,
    });

    return res.json(meetup);
  }
}

export default new MeetupsController();
