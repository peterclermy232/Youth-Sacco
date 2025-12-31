# SMS Notification Setup Guide

This guide explains how to set up SMS notifications using Africa's Talking API for the SACCO system.

## Overview

The system sends SMS notifications to members when:
- Their contribution is verified by an admin
- Their contribution is rejected by an admin

## Africa's Talking Setup

### 1. Create an Account

1. Visit [Africa's Talking](https://africastalking.com)
2. Click "Sign Up" and create an account
3. Verify your email address
4. Complete your profile

### 2. Get API Credentials

1. Log in to your Africa's Talking dashboard
2. Navigate to **Settings** → **API Key**
3. Generate a new API key
4. Copy your:
   - **Username** (usually "sandbox" for testing)
   - **API Key**

### 3. Sandbox Mode (Testing)

For testing without spending money:

1. Go to **SMS** → **Sandbox**
2. Add test phone numbers in the format: `+254XXXXXXXXX`
3. You can add up to 10 test numbers
4. SMS sent to these numbers will be simulated (not actually sent)

### 4. Production Mode

To send real SMS:

1. Purchase SMS credits in your dashboard
2. Go to **Settings** → **Sender ID**
3. Register a sender ID (e.g., "SACCO")
4. Wait for approval (usually 24-48 hours)
5. Update your username from "sandbox" to your actual username

## Configuration

### Backend Configuration

1. **Update .env file**

```env
# Sandbox mode (testing)
AT_USERNAME=sandbox
AT_API_KEY=your_api_key_here
AT_SENDER_ID=SACCO

# Production mode
AT_USERNAME=your_actual_username
AT_API_KEY=your_api_key_here
AT_SENDER_ID=YourApprovedSenderID
```

2. **Verify settings.py**

The settings should already be configured in `backend/sacco_project/settings.py`:

```python
# Africa's Talking Configuration
AT_USERNAME = config('AT_USERNAME', default='sandbox')
AT_API_KEY = config('AT_API_KEY', default='')
AT_SENDER_ID = config('AT_SENDER_ID', default='SACCO')
```

### SMS Service Implementation

The SMS service is implemented in `backend/notifications/services.py`:

```python
class SMSService:
    def send_contribution_verified_sms(self, contribution):
        """Send SMS when contribution is verified"""
        
    def send_contribution_rejected_sms(self, contribution):
        """Send SMS when contribution is rejected"""
        
    def send_bulk_sms(self, recipients, message):
        """Send SMS to multiple users"""
```

## Testing SMS Notifications

### 1. Using Django Shell

```bash
cd backend
source venv/bin/activate
python manage.py shell
```

```python
from notifications.services import SMSService
from accounts.models import User
from contributions.models import Contribution, ContributionType

# Get a test user
user = User.objects.first()

# Create a test contribution
contrib_type = ContributionType.objects.first()
contribution = Contribution.objects.create(
    member=user,
    contribution_type=contrib_type,
    amount=5000,
    mpesa_transaction_code='TEST123',
    mpesa_phone_number=user.phone_number,
    status='VERIFIED'
)

# Send test SMS
sms_service = SMSService()
result = sms_service.send_contribution_verified_sms(contribution)

print(f"SMS Status: {result.status}")
print(f"Message: {result.message}")
```

### 2. Using the API

1. **Login as admin**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+254712345678",
    "password": "your_password"
  }'
```

2. **Verify a contribution** (this will trigger SMS)
```bash
curl -X POST http://localhost:8000/api/contributions/1/verify/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "status": "VERIFIED"
  }'
```

### 3. Check SMS Logs

View SMS notification logs in Django admin:
1. Go to `http://localhost:8000/admin/`
2. Navigate to **Notifications** → **SMS Notifications**
3. Check the status of sent messages

Or via Django shell:
```python
from notifications.models import SMSNotification

# View recent SMS
recent_sms = SMSNotification.objects.all()[:10]
for sms in recent_sms:
    print(f"{sms.phone_number}: {sms.status} - {sms.message[:50]}")
```

## SMS Message Templates

### Verification Message
```
Dear {first_name}, your contribution of KES {amount} for {contribution_type} has been verified. Transaction: {mpesa_code}. Thank you!
```

### Rejection Message
```
Dear {first_name}, your contribution of KES {amount} for {contribution_type} has been rejected. Reason: {rejection_reason}. Please contact admin for more details.
```

## Customizing SMS Messages

To customize SMS messages, edit `backend/notifications/services.py`:

```python
def send_contribution_verified_sms(self, contribution):
    message = (
        f"Dear {contribution.member.first_name}, "
        f"your contribution of KES {contribution.amount} "
        f"for {contribution.contribution_type.name} has been verified. "
        f"Transaction: {contribution.mpesa_transaction_code}. "
        f"Thank you!"
    )
    return self.send_sms(contribution.member, message)
```

## Troubleshooting

### Issue: SMS not sending

**Check:**
1. API credentials are correct in `.env`
2. Phone numbers are in international format (+254...)
3. Phone numbers are added to sandbox (if testing)
4. Africa's Talking account has credits (if production)

**Debug:**
```python
from notifications.services import SMSService
from accounts.models import User

user = User.objects.first()
sms_service = SMSService()

try:
    result = sms_service.send_sms(user, "Test message")
    print(f"Status: {result.status}")
    print(f"Error: {result.error_message}")
except Exception as e:
    print(f"Exception: {str(e)}")
```

### Issue: "Invalid API Key"

- Verify your API key in `.env`
- Regenerate API key in Africa's Talking dashboard
- Ensure no extra spaces in `.env` file

### Issue: "Invalid Phone Number"

- Phone numbers must be in international format: `+254XXXXXXXXX`
- For Kenya, replace `0` with `+254`
- Example: `0712345678` → `+254712345678`

### Issue: SMS shows as "FAILED"

Check the error message in the database:
```python
from notifications.models import SMSNotification

failed_sms = SMSNotification.objects.filter(status='FAILED').last()
print(failed_sms.error_message)
```

## Cost Estimation

### Africa's Talking Pricing (Kenya)

- **SMS to Kenya**: ~KES 0.80 per SMS
- **SMS to other countries**: Varies by country

### Example Costs

For a SACCO with 5 members:
- **Monthly contributions**: 5 members × 2 contribution types = 10 SMS
- **Cost**: 10 SMS × KES 0.80 = **KES 8.00 per month**

For 100 members:
- **Monthly contributions**: 100 members × 2 types = 200 SMS
- **Cost**: 200 SMS × KES 0.80 = **KES 160.00 per month**

## Production Checklist

Before going live:

- [ ] Register a sender ID with Africa's Talking
- [ ] Wait for sender ID approval
- [ ] Purchase SMS credits
- [ ] Update `.env` with production credentials
- [ ] Test with real phone numbers
- [ ] Monitor SMS delivery rates
- [ ] Set up low balance alerts

## Alternative SMS Providers

If Africa's Talking doesn't work for your region, you can integrate:

1. **Twilio**
   - Global coverage
   - Similar API structure
   - Update `notifications/services.py`

2. **Nexmo (Vonage)**
   - Good for international SMS
   - Requires API changes

3. **Local SMS Gateway**
   - Contact local telecom providers
   - May offer better rates

## Bulk SMS Feature (Future Enhancement)

To send SMS to all members:

```python
from notifications.services import SMSService
from accounts.models import User

sms_service = SMSService()
members = User.objects.filter(role='MEMBER')

message = "Important announcement: Monthly meeting on Friday at 2 PM."
results = sms_service.send_bulk_sms(members, message)

print(f"Sent: {len([r for r in results if r.status == 'SENT'])}")
print(f"Failed: {len([r for r in results if r.status == 'FAILED'])}")
```

## Support

For Africa's Talking support:
- **Email**: support@africastalking.com
- **Documentation**: https://developers.africastalking.com/
- **Community**: https://help.africastalking.com/

For SACCO system SMS issues:
- Check Django logs: `python manage.py runserver`
- Check database: SMS Notifications table
- Test w