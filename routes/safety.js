    // backend/routes/safety.js
    const express = require('express');
    const router = express.Router();
    const User = require('../models/User'); // Import User model
    const auth = require('../middleware/auth'); // Import auth middleware

    // Expo Push Notification API endpoint
    const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

    // @route   PUT api/safety/location
    // @desc    Update user's real-time location
    // @access  Private (requires authentication)
    router.put('/location', auth, async (req, res) => {
      const { latitude, longitude } = req.body; // Get location data from request

      try {
        // Find the user by ID (ID comes from the auth middleware)
        let user = await User.findById(req.user.id);

        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }

        // Update user's current location
        user.currentLocation = {
          latitude,
          longitude,
          timestamp: Date.now() // Update timestamp
        };

        await user.save(); // Save changes to the database

        res.json({ msg: 'Location updated successfully', location: user.currentLocation });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   POST api/safety/sos
    // @desc    Trigger an SOS alert and send push notifications
    // @access  Private (requires authentication)
    router.post('/sos', auth, async (req, res) => {
      try {
        const user = await User.findById(req.user.id);

        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }

        console.log(`\n--- SOS ALERT from ${user.name} (${user.email}) ---`);
        console.log(`Last known location: Latitude ${user.currentLocation.latitude}, Longitude ${user.currentLocation.longitude}`);
        console.log('Attempting to notify trusted contacts:');

        const messages = []; // Array to hold push notification messages

        if (user.trustedContacts && user.trustedContacts.length > 0) {
          for (const contact of user.trustedContacts) {
            // SIMULATE SMS/Email
            if (contact.phone) {
              console.log(`  - SIMULATING SMS to ${contact.name} at ${contact.phone}: "SOS! ${user.name} needs help. Last known location: https://maps.google.com/?q=${user.currentLocation.latitude},${user.currentLocation.longitude}"`);
            }
            if (contact.email) {
              console.log(`  - SIMULATING EMAIL to ${contact.name} at ${contact.email}: "Subject: SOS Alert from Raksha App - ${user.name} needs help!"`);
            }
            if (!contact.phone && !contact.email) {
              console.log(`  - Contact ${contact.name} has no phone or email to notify.`);
            }

            // --- PUSH NOTIFICATION LOGIC ---
            // Find the trusted contact's user account to get their push token
            if (contact.email) { // Assuming trusted contacts are also users in your app by email
              const trustedUser = await User.findOne({ email: contact.email });
              if (trustedUser && trustedUser.expoPushToken) {
                messages.push({
                  to: trustedUser.expoPushToken,
                  sound: 'default',
                  title: `SOS Alert from ${user.name}`,
                  body: `Your contact ${user.name} needs help! Last location: Lat ${user.currentLocation.latitude.toFixed(4)}, Lng ${user.currentLocation.longitude.toFixed(4)}.`,
                  data: {
                    type: 'SOS',
                    userId: user.id,
                    userName: user.name,
                    location: user.currentLocation,
                    timestamp: Date.now()
                  },
                });
                console.log(`  - Preparing Push Notification for ${contact.name} (${trustedUser.email}).`);
              } else if (contact.email) {
                console.log(`  - Trusted contact ${contact.name} (${contact.email}) is not a Raksha app user or has no push token.`);
              }
            }
          }

          // Send all prepared push notification messages
          if (messages.length > 0) {
            console.log(`Sending ${messages.length} push notifications...`);
            try {
              const pushResponse = await fetch(EXPO_PUSH_ENDPOINT, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Accept-encoding': 'gzip, deflate',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(messages),
              });
              const pushData = await pushResponse.json();
              console.log('Expo Push API Response:', pushData);
            } catch (pushError) {
              console.error('Error sending push notifications:', pushError);
            }
          }
        } else {
          console.log('No trusted contacts configured for this user. Please add contacts to enable SOS notifications.');
        }
        console.log('-------------------------------------\n');

        res.json({ msg: 'SOS alert triggered successfully. Trusted contacts notified (simulated SMS/Email, and push if app user).' });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   POST api/safety/trusted-contacts
    // @desc    Add a trusted contact to the user's profile
    // @access  Private (requires authentication)
    router.post('/trusted-contacts', auth, async (req, res) => {
      const { name, phone, email } = req.body;

      // Basic validation: At least name and one contact method
      if (!name || (!phone && !email)) {
        return res.status(400).json({ msg: 'Name and at least one of Phone or Email are required for trusted contact.' });
      }

      try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }

        // Create new contact object
        const newContact = { name, phone, email };

        // Add to trusted contacts array
        user.trustedContacts.push(newContact);

        await user.save();
        res.status(201).json(user.trustedContacts); // Return updated list of contacts with 201 Created status

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   PUT api/safety/trusted-contacts/:contact_id
    // @desc    Update a trusted contact
    // @access  Private (requires authentication)
    router.put('/trusted-contacts/:contact_id', auth, async (req, res) => {
      const { name, phone, email } = req.body;
      const contactId = req.params.contact_id;

      if (!name || (!phone && !email)) {
        return res.status(400).json({ msg: 'Name and at least one of Phone or Email are required for trusted contact update.' });
      }

      try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }

        // Find the specific contact by its _id within the trustedContacts array
        const contactToUpdate = user.trustedContacts.id(contactId); // Mongoose subdocument .id() method

        if (!contactToUpdate) {
          return res.status(404).json({ msg: 'Trusted contact not found.' });
        }

        // Update fields
        contactToUpdate.name = name;
        contactToUpdate.phone = phone;
        contactToUpdate.email = email;

        await user.save();
        res.json(user.trustedContacts); // Return updated list

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   DELETE api/safety/trusted-contacts/:contact_id
    // @desc    Delete a trusted contact
    // @access  Private (requires authentication)
    router.delete('/trusted-contacts/:contact_id', auth, async (req, res) => {
      try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }

        // Remove the contact by its _id
        user.trustedContacts.pull({ _id: req.params.contact_id }); // Mongoose subdocument .pull() method

        await user.save();
        res.json({ msg: 'Trusted contact removed successfully.', trustedContacts: user.trustedContacts });

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    // @route   GET api/safety/trusted-contacts
    // @desc    Get all trusted contacts for the user
    // @access  Private (requires authentication)
    router.get('/trusted-contacts', auth, async (req, res) => {
      try {
        const user = await User.findById(req.user.id).select('trustedContacts'); // Only fetch trustedContacts
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.trustedContacts);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    module.exports = router;
    