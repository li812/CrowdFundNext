const cron = require('node-cron');
const Campaign = require('../models/Campaign');

class CampaignLifecycleService {
  constructor() {
    this.isRunning = false;
    this.jobs = new Map();
  }

  // Start the campaign lifecycle service
  start() {
    console.log('Starting Campaign Lifecycle Service...');
    
    // Update campaign statuses every hour
    this.scheduleStatusUpdate();
    
    // Update expired campaigns every 30 minutes
    this.scheduleExpiredUpdate();
    
    // Daily cleanup and maintenance
    this.scheduleDailyMaintenance();
    
    this.isRunning = true;
    console.log('Campaign Lifecycle Service started successfully');
  }

  // Stop the service
  stop() {
    console.log('Stopping Campaign Lifecycle Service...');
    
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`Stopped job: ${name}`);
    });
    
    this.jobs.clear();
    this.isRunning = false;
    console.log('Campaign Lifecycle Service stopped');
  }

  // Schedule status updates every hour
  scheduleStatusUpdate() {
    const job = cron.schedule('0 * * * *', async () => {
      try {
        console.log('Running scheduled campaign status update...');
        await this.updateCampaignStatuses();
      } catch (error) {
        console.error('Error in scheduled status update:', error);
      }
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    this.jobs.set('statusUpdate', job);
    console.log('Scheduled campaign status updates (hourly)');
  }

  // Schedule expired campaign updates every 30 minutes
  scheduleExpiredUpdate() {
    const job = cron.schedule('*/30 * * * *', async () => {
      try {
        console.log('Running scheduled expired campaign update...');
        await this.updateExpiredCampaigns();
      } catch (error) {
        console.error('Error in scheduled expired update:', error);
      }
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    this.jobs.set('expiredUpdate', job);
    console.log('Scheduled expired campaign updates (every 30 minutes)');
  }

  // Schedule daily maintenance at 2 AM UTC
  scheduleDailyMaintenance() {
    const job = cron.schedule('0 2 * * *', async () => {
      try {
        console.log('Running daily campaign maintenance...');
        await this.performDailyMaintenance();
      } catch (error) {
        console.error('Error in daily maintenance:', error);
      }
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    this.jobs.set('dailyMaintenance', job);
    console.log('Scheduled daily campaign maintenance (2 AM UTC)');
  }

  // Update all campaign statuses
  async updateCampaignStatuses() {
    try {
      const updatedCampaigns = await Campaign.updateAllCampaignStatuses();
      
      // Process each updated campaign
      for (const campaign of updatedCampaigns) {
        await this.processCampaignStatusChange(campaign);
      }
      
      console.log(`Updated ${updatedCampaigns.length} campaign statuses`);
      return updatedCampaigns;
    } catch (error) {
      console.error('Error updating campaign statuses:', error);
      throw error;
    }
  }

  // Update expired campaigns specifically
  async updateExpiredCampaigns() {
    try {
      const now = new Date();
      
      // Find campaigns that have expired but still show as active
      const expiredCampaigns = await Campaign.find({
        status: { $in: ['approved', 'funded'] },
        isActive: true,
        hasTimeLimit: true,
        endDate: { $lt: now }
      });

      let updatedCount = 0;
      for (const campaign of expiredCampaigns) {
        if (campaign.progressPercentage >= 100) {
          campaign.status = 'completed';
          campaign.completedAt = now;
        } else {
          campaign.status = 'failed';
          campaign.expiredAt = now;
          campaign.isSuccessful = false;
        }
        campaign.isActive = false;
        campaign.daysRemaining = 0;
        await campaign.save();
        updatedCount++;
      }

      console.log(`Updated ${updatedCount} expired campaigns`);
      return updatedCount;
    } catch (error) {
      console.error('Error updating expired campaigns:', error);
      throw error;
    }
  }

  // Process campaign status changes
  async processCampaignStatusChange(campaign) {
    try {
      const campaignSummary = campaign.getCampaignSummary();
      
      switch (campaign.status) {
        case 'funded':
          await this.handleCampaignFunded(campaign);
          break;
        case 'completed':
          await this.handleCampaignCompleted(campaign);
          break;
        case 'failed':
          await this.handleCampaignFailed(campaign);
          break;
        default:
          console.log(`Campaign ${campaign._id} status changed to: ${campaign.status}`);
      }
      
      return campaignSummary;
    } catch (error) {
      console.error(`Error processing status change for campaign ${campaign._id}:`, error);
      throw error;
    }
  }

  // Handle campaign reaching funding goal
  async handleCampaignFunded(campaign) {
    try {
      console.log(`Campaign ${campaign._id} has been funded! Progress: ${campaign.progressPercentage}%`);
      
      // Add a system comment about funding success
      const fundingComment = {
        userId: 'system',
        userName: 'CrowdFundNext',
        text: `🎉 Congratulations! This campaign has reached its funding goal of $${campaign.amountNeeded}! The campaign is now funded and will be completed.`,
        createdAt: new Date()
      };
      
      campaign.comments.push(fundingComment);
      await campaign.save();
      
      // TODO: Send notification to campaign creator
      // TODO: Send notification to all donors
      // TODO: Send email notifications
      
      return campaign;
    } catch (error) {
      console.error('Error handling funded campaign:', error);
      throw error;
    }
  }

  // Handle campaign completion
  async handleCampaignCompleted(campaign) {
    try {
      console.log(`Campaign ${campaign._id} has been completed!`);
      
      // Add a system comment about completion
      const completionComment = {
        userId: 'system',
        userName: 'CrowdFundNext',
        text: `✅ Campaign completed successfully! Total raised: $${campaign.amountReceived} (${campaign.progressPercentage}% of goal). Thank you to all supporters!`,
        createdAt: new Date()
      };
      
      campaign.comments.push(completionComment);
      await campaign.save();
      
      // TODO: Send completion notification to campaign creator
      // TODO: Send completion notification to all donors
      // TODO: Process fund distribution (if applicable)
      // TODO: Send email notifications
      
      return campaign;
    } catch (error) {
      console.error('Error handling completed campaign:', error);
      throw error;
    }
  }

  // Handle campaign failure
  async handleCampaignFailed(campaign) {
    try {
      console.log(`Campaign ${campaign._id} has failed. Progress: ${campaign.progressPercentage}%`);
      
      // Add a system comment about failure
      const failureComment = {
        userId: 'system',
        userName: 'CrowdFundNext',
        text: `❌ Campaign has ended without reaching the funding goal. Progress: ${campaign.progressPercentage}% ($${campaign.amountReceived}/${campaign.amountNeeded}).`,
        createdAt: new Date()
      };
      
      campaign.comments.push(failureComment);
      await campaign.save();
      
      // TODO: Send failure notification to campaign creator
      // TODO: Send failure notification to all donors
      // TODO: Process refunds (if applicable)
      // TODO: Send email notifications
      
      return campaign;
    } catch (error) {
      console.error('Error handling failed campaign:', error);
      throw error;
    }
  }

  // Perform daily maintenance tasks
  async performDailyMaintenance() {
    try {
      console.log('Starting daily campaign maintenance...');
      
      // Update all campaign statuses
      await this.updateCampaignStatuses();
      
      // Clean up old system comments (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const campaigns = await Campaign.find({
        'comments.userId': 'system',
        'comments.createdAt': { $lt: thirtyDaysAgo }
      });
      
      let cleanedCount = 0;
      for (const campaign of campaigns) {
        const originalLength = campaign.comments.length;
        campaign.comments = campaign.comments.filter(comment => 
          comment.userId !== 'system' || comment.createdAt >= thirtyDaysAgo
        );
        
        if (campaign.comments.length !== originalLength) {
          await campaign.save();
          cleanedCount++;
        }
      }
      
      console.log(`Daily maintenance completed. Cleaned ${cleanedCount} campaigns of old system comments.`);
      
      // Generate daily statistics
      await this.generateDailyStatistics();
      
    } catch (error) {
      console.error('Error in daily maintenance:', error);
      throw error;
    }
  }

  // Generate daily statistics
  async generateDailyStatistics() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const stats = {
        date: today,
        totalCampaigns: await Campaign.countDocuments(),
        activeCampaigns: await Campaign.countDocuments({ isActive: true, status: 'approved' }),
        successfulCampaigns: await Campaign.countDocuments({ isSuccessful: true }),
        failedCampaigns: await Campaign.countDocuments({ status: 'failed' }),
        totalRaised: await Campaign.aggregate([
          { $group: { _id: null, total: { $sum: '$amountReceived' } } }
        ]).then(result => result[0]?.total || 0),
        campaignsCreatedToday: await Campaign.countDocuments({
          createdAt: { $gte: today }
        }),
        campaignsCompletedToday: await Campaign.countDocuments({
          completedAt: { $gte: today }
        }),
        campaignsFailedToday: await Campaign.countDocuments({
          expiredAt: { $gte: today }
        })
      };
      
      console.log('Daily statistics:', stats);
      return stats;
    } catch (error) {
      console.error('Error generating daily statistics:', error);
      throw error;
    }
  }

  // Manual trigger for immediate update
  async triggerImmediateUpdate() {
    try {
      console.log('Triggering immediate campaign update...');
      const result = await this.updateCampaignStatuses();
      console.log('Immediate update completed');
      return result;
    } catch (error) {
      console.error('Error in immediate update:', error);
      throw error;
    }
  }

  // Get service status
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: Array.from(this.jobs.keys()),
      jobCount: this.jobs.size
    };
  }
}

// Create singleton instance
const campaignLifecycleService = new CampaignLifecycleService();

module.exports = campaignLifecycleService; 