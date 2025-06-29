# Campaign Lifecycle Management System

## Overview

The CrowdFundNext platform implements a comprehensive campaign lifecycle management system that automatically handles campaign status transitions, funding goals, time limits, and completion states. This system ensures campaigns are properly managed from creation to completion.

## Campaign Statuses

### 1. **Pending** (`pending`)
- **Description**: Campaign submitted and awaiting admin approval
- **Actions**: Admin can approve or reject
- **UI**: Shows warning color with timer icon
- **Donations**: Not allowed

### 2. **Active** (`approved`)
- **Description**: Campaign approved and live for donations
- **Actions**: Users can donate, like, comment, share
- **UI**: Shows success color with info icon
- **Donations**: Allowed
- **Auto-transition**: Can become `funded` when goal reached

### 3. **Funded** (`funded`)
- **Description**: Campaign reached 100% funding goal
- **Actions**: Still accepts donations (overfunding)
- **UI**: Shows success color with trophy icon, green border
- **Donations**: Still allowed
- **Auto-transition**: Becomes `completed` when time expires

### 4. **Completed** (`completed`)
- **Description**: Campaign successfully completed with funding goal met
- **Actions**: Read-only, no more donations
- **UI**: Shows success color with check icon, blue border
- **Donations**: Not allowed
- **Final State**: No further transitions

### 5. **Failed** (`failed`)
- **Description**: Campaign ended without reaching funding goal
- **Actions**: Read-only, no more donations
- **UI**: Shows error color with cancel icon, red border
- **Donations**: Not allowed
- **Final State**: No further transitions

### 6. **Rejected** (`rejected`)
- **Description**: Campaign rejected by admin
- **Actions**: Creator can edit and resubmit
- **UI**: Shows error color with cancel icon
- **Donations**: Not allowed

## Campaign Lifecycle Flow

```
[Creation] → [Pending] → [Approved] → [Funded] → [Completed]
                ↓           ↓           ↓
             [Rejected]  [Failed]   [Failed]
```

### Detailed Flow:

1. **Campaign Creation**
   - User creates campaign
   - Status: `pending`
   - Admin reviews and approves/rejects

2. **Campaign Approval**
   - Admin approves campaign
   - Status: `approved`
   - Campaign becomes live for donations

3. **Funding Goal Reached**
   - When `amountReceived >= amountNeeded`
   - Status: `approved` → `funded`
   - System adds congratulatory comment
   - Campaign continues accepting donations

4. **Campaign Completion**
   - When time limit expires AND goal reached
   - Status: `funded` → `completed`
   - Campaign becomes read-only
   - System adds completion comment

5. **Campaign Failure**
   - When time limit expires AND goal NOT reached
   - Status: `approved`/`funded` → `failed`
   - Campaign becomes read-only
   - System adds failure comment

## Time Limit Handling

### Fixed Time Limits
- Campaigns with specific end dates
- Automatically expire on the end date
- Status updates based on funding progress

### Flexible Time Limits
- Campaigns with maximum duration (default: 90 days)
- Automatically expire after max duration
- Status updates based on funding progress

### No Time Limits
- Campaigns without time constraints
- Only status changes based on funding progress
- Can remain active indefinitely

## Automated Status Updates

### Scheduled Updates
- **Hourly**: Update all campaign statuses
- **Every 30 minutes**: Check for expired campaigns
- **Daily (2 AM UTC)**: Maintenance and cleanup

### Real-time Updates
- Status changes on donation success
- Immediate progress updates
- Real-time UI feedback

## System Comments

The system automatically adds comments for important events:

### Funding Success
```
🎉 Congratulations! This campaign has reached its funding goal of $X! The campaign is now funded and will be completed.
```

### Campaign Completion
```
✅ Campaign completed successfully! Total raised: $X (Y% of goal). Thank you to all supporters!
```

### Campaign Failure
```
❌ Campaign has ended without reaching the funding goal. Progress: Y% ($X/$Z).
```

## Frontend UI Features

### Visual Indicators
- **Status chips**: Color-coded with icons
- **Progress bars**: Real-time funding progress
- **Time indicators**: Days remaining with urgency colors
- **Border colors**: Green (funded), Blue (completed), Red (failed)

### Interactive Elements
- **Donate button**: Only shown for active campaigns
- **Status-specific messages**: Contextual information
- **Overfunding display**: Shows excess amount raised
- **Final state buttons**: Disabled buttons for completed/failed campaigns

### Responsive Design
- **Mobile-friendly**: All features work on mobile
- **Real-time updates**: Progress updates without page refresh
- **Smooth transitions**: Animated status changes

## Backend Services

### Campaign Lifecycle Service
- **Location**: `server/services/campaignLifecycleService.js`
- **Features**: Automated status updates, cron jobs, maintenance
- **Scheduling**: Hourly, 30-minute, and daily tasks

### Model Enhancements
- **Location**: `server/models/Campaign.js`
- **Features**: Status tracking, lifecycle timestamps, virtual properties
- **Methods**: Status updates, campaign summaries

### Controller Functions
- **Location**: `server/controllers/campaignController.js`
- **Features**: Status management, lifecycle processing, statistics
- **Endpoints**: Status updates, campaign filtering, statistics

## API Endpoints

### Campaign Lifecycle
```
POST /api/campaigns/lifecycle/update
GET /api/campaigns/statistics
GET /api/campaigns/status/:status
PATCH /api/campaigns/:campaignId/status
```

### Campaign Management
```
GET /api/campaigns (with status filtering)
POST /api/campaigns/:id/donate
POST /api/campaigns/:id/like
POST /api/campaigns/:id/comments
```

## Configuration

### Environment Variables
```env
# Campaign settings
CAMPAIGN_MAX_DURATION=90
CAMPAIGN_UPDATE_INTERVAL=3600000  # 1 hour
CAMPAIGN_EXPIRED_CHECK_INTERVAL=1800000  # 30 minutes
```

### Database Schema
```javascript
// Campaign status fields
status: ['pending', 'approved', 'rejected', 'expired', 'completed', 'funded', 'failed']
fundedAt: Date
completedAt: Date
expiredAt: Date
isSuccessful: Boolean
isFullyFunded: Boolean
isOverFunded: Boolean
```

## Testing Scenarios

### 1. Campaign Funding Success
1. Create campaign with $1000 goal
2. Donate $1000
3. Verify status changes to `funded`
4. Verify system comment added
5. Continue donating (overfunding)
6. Wait for time expiration
7. Verify status changes to `completed`

### 2. Campaign Failure
1. Create campaign with $1000 goal and 7-day limit
2. Donate $500
3. Wait for time expiration
4. Verify status changes to `failed`
5. Verify system comment added
6. Verify donations disabled

### 3. Real-time Updates
1. Open campaign in multiple browser tabs
2. Donate in one tab
3. Verify progress updates in all tabs
4. Verify status changes propagate

## Monitoring and Maintenance

### Daily Statistics
- Total campaigns by status
- Funding success rates
- Average campaign duration
- Total amount raised

### Cleanup Tasks
- Remove old system comments (30+ days)
- Archive completed campaigns
- Update expired campaigns
- Generate daily reports

### Error Handling
- Failed status updates
- Database connection issues
- Invalid campaign data
- Notification failures

## Future Enhancements

### Planned Features
- Email notifications for status changes
- SMS notifications for urgent campaigns
- Campaign analytics dashboard
- Automated refund processing
- Campaign templates
- Social media integration

### Advanced Features
- AI-powered campaign recommendations
- Predictive funding success
- Dynamic time limit adjustments
- Multi-currency support
- International campaign support

## Troubleshooting

### Common Issues
1. **Campaign not updating status**: Check cron job logs
2. **Progress not updating**: Verify donation endpoint
3. **UI not reflecting changes**: Check real-time updates
4. **System comments missing**: Verify lifecycle service

### Debug Commands
```bash
# Check service status
curl http://localhost:4800/health

# Trigger manual update
curl -X POST http://localhost:4800/api/campaigns/lifecycle/update

# Get campaign statistics
curl http://localhost:4800/api/campaigns/statistics
```

This comprehensive lifecycle management system ensures campaigns are properly tracked, updated, and managed throughout their entire lifecycle, providing a professional and reliable crowdfunding experience. 