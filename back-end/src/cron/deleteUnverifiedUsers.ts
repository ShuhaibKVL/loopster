import cron from 'node-cron'

import { deleteUnverifiedUsers } from '../services/userServices';

// Schedule the cron job to run every hour (adjust as per your need)
cron.schedule('*/2 * * * *', async () => {
    try {
    await deleteUnverifiedUsers();
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>>>>> >>>>>>>>>>> >>>>>>>>>>> >>>>> Deleted unverified users');
    } catch (error) {
    console.error('Error on deleting unverified users crone job', error);
    }
});
