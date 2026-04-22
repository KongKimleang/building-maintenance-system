require('dotenv').config();

const connectDB = require('../config/db');
require('../models/User');
const Notification = require('../models/Notification');
const User = require('../models/User');

const seedMessages = [
  'A new maintenance request was submitted.',
  'A request has been assigned and needs attention.',
  'A maintenance request status has changed.',
  'Someone added a comment on a request.',
  'A maintenance request was completed successfully.',
];

const cleanup = async () => {
  try {
    await connectDB();

    const dara = await User.findOne({ username: 'sok.dara' }).select('_id');

    if (!dara) {
      throw new Error('Could not find user sok.dara');
    }

    const result = await Notification.deleteMany({
      userId: dara._id,
      message: { $in: seedMessages },
    });

    console.log(
      `Removed ${result.deletedCount || 0} seed notifications for sok.dara.`
    );
  } catch (error) {
    console.error('Failed to clean up seed notifications:', error.message);
    process.exitCode = 1;
  } finally {
    await Notification.db.close().catch(() => {});
    await User.db.close().catch(() => {});
  }
};

cleanup();