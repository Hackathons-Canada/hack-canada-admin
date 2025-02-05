# Daedalus Rating Normalization System

## Overview
The Daedalus Rating Normalization System is designed to standardize reviewer ratings across the application review process. This system ensures fair evaluation by adjusting for individual reviewer biases while maintaining the relative ordering of applications within each reviewer's set.

## Rating Normalization Process

### 1. Basic Concepts

- **Raw Rating**: The original rating (0-10) given by a reviewer
- **Adjusted Rating**: The normalized rating after applying the standardization algorithm
- **Target Average**: Set to 6.0 (±0.5) across all reviewers
- **Minimum Review Threshold**: 5 reviews required for normalization

### 2. Normalization Algorithm

The system uses a linear transformation approach to normalize ratings:

```typescript
adjusted_rating = raw_rating + adjustment_factor
adjustment_factor = TARGET_AVG - reviewer_current_avg
```

#### Key Properties:
- Preserves relative differences between applications
- Maintains the 0-10 scale through clamping
- Handles edge cases (few reviews, extreme ratings)

### 3. Implementation Details

#### Data Structure
```typescript
interface ReviewerStats {
  reviewerId: string;
  name: string;
  avgRating: number;
  reviewCount: number;
}
```

#### Process Flow
1. Calculate current averages for all reviewers
2. Compute adjustment factors
3. Apply adjustments to all reviews
4. Clamp final values to [0, 10]
5. Update database with adjusted ratings

### 4. Usage Guidelines

#### When to Run Normalization
- After significant number of new reviews (e.g., 50+)
- Before major decision points
- When adding new reviewers to the system

#### Monitoring and Maintenance
- Regular checks for average drift
- Verification of reviewer consistency
- Adjustment factor analysis

### 5. Database Schema

```sql
-- Key fields in applicationReview table
rating: integer           -- Original rating (0-10)
adjusted_rating: integer  -- Normalized rating
reviewDuration: integer   -- Time spent on review (seconds)
```

### 6. Error Handling

The system handles several edge cases:
- Reviewers with insufficient reviews (< 5)
- Missing or null ratings
- Extreme outlier ratings

### 7. Performance Considerations

- Batch processing for large datasets
- Indexed queries for efficient lookups
- Transaction management for consistency

### 8. Example Scenarios

#### Example 1: Standard Adjustment
```
Reviewer A:
- Original Average: 7.5
- Adjustment Factor: -1.5
- New Average: 6.0

Original Ratings: [8, 7, 8, 7, 8]
Adjusted Ratings: [6.5, 5.5, 6.5, 5.5, 6.5]
```

#### Example 2: Edge Case Handling
```
Reviewer B:
- Original Average: 4.0
- Adjustment Factor: +2.0
- New Average: 6.0

Original Ratings: [3, 4, 4, 5, 4]
Adjusted Ratings: [5, 6, 6, 7, 6]
```

### 9. Monitoring and Analytics

Key metrics to track:
- Distribution of adjustment factors
- Average ratings before/after normalization
- Review count distribution
- Time trends in rating patterns

### 10. Future Improvements

Potential enhancements:
1. Machine learning-based bias detection
2. Real-time normalization
3. Advanced statistical methods
4. Reviewer feedback systems

## Technical Notes

### Running the Normalization Script

```bash
# Development
pnpm run normalize-ratings

# Production
NODE_ENV=production pnpm run normalize-ratings
```

### Configuration Options

```typescript
const CONFIG = {
  TARGET_AVERAGE: 6.0,
  ACCEPTABLE_DEVIATION: 0.5,
  MIN_REVIEWS: 5,
  MAX_ADJUSTMENT: 3.0
};
```