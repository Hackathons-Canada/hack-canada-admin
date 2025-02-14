# Applicant Acceptance Scripts

This directory contains scripts for processing applicant acceptances and sending acceptance emails. The entire process is handled through a single command.

## Prerequisites

1. Ensure you have Node.js installed
2. The following environment variables must be configured:
   - Database connection settings
   - AWS SES credentials for email sending

## Usage Instructions

Run the main acceptance script:

```bash
npm run  acceptance-scripts/index.ts
```

The script supports two ways to process acceptances:

### Option 1: Interactive Process

1. **Rating Normalization**
   - If ratings have been previously normalized, you'll be asked if you want to normalize again
   - If not, ratings will be automatically normalized

2. **Operation Mode Selection**
   - Choose mode 1 to generate the list of top applicants
   - Choose mode 2 to process acceptances and send emails

3. **Applicant Count Configuration**
   - Specify how many applicants you want to process
   - Set a buffer percentage for extra applicants (e.g., 10 for 10% extra)

### Option 2: Using Existing CSV File

If you already have a CSV file with applicant data:

1. Ensure your CSV file is named `top-applicants.csv` and contains the following columns:
   - `userId`: The user's ID in the system
   - `firstName`: The applicant's first name
   - `email`: The applicant's email address

2. Place the CSV file in the project root directory

3. Run the acceptance script directly:
   ```bash
   npm run ts-node acceptance-scripts/accept-applicants.ts
   ```

For both options, the script will:
- Update application statuses in the database
- Create audit logs for each acceptance
- Send acceptance emails to accepted applicants
- Track progress and handle any failures

## Important Notes

1. Each acceptance is processed in a database transaction
2. There is a 200ms delay between processing each applicant
3. Detailed logs are provided for both successful and failed operations
4. The script handles errors gracefully and provides a summary at the end

## Monitoring Progress

The script provides real-time console output showing:
- Number of applicants being processed
- Current applicant status
- Success/failure of each operation
- Final summary with success/failure counts