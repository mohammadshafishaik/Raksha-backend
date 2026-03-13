// backend/routes/incidents.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');

const incidentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { msg: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(incidentLimiter);

// @route   POST api/incidents
// @desc    Report a new incident
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
  const { title, description, incidentType, location } = req.body;

  if (!title || !description || !incidentType) {
    return res.status(400).json({ msg: 'Title, description, and incident type are required.' });
  }

  try {
    const incident = new Incident({
      user: req.user.id,
      title,
      description,
      incidentType,
      location,
    });

    await incident.save();
    res.status(201).json({ msg: 'Incident reported successfully.', incident });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/incidents
// @desc    Get all incidents reported by the authenticated user
// @access  Private (requires authentication)
router.get('/', auth, async (req, res) => {
  try {
    const incidents = await Incident.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/incidents/recent
// @desc    Get recent incidents (community feed, anonymised)
// @access  Private (requires authentication)
router.get('/recent', auth, async (req, res) => {
  try {
    const incidents = await Incident.find({ status: { $ne: 'resolved' } })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('title incidentType location status createdAt');
    res.json(incidents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/incidents/:id
// @desc    Delete an incident reported by the authenticated user
// @access  Private (requires authentication)
router.delete('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ msg: 'Incident not found.' });
    }
    if (incident.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorised to delete this incident.' });
    }
    await incident.deleteOne();
    res.json({ msg: 'Incident deleted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
