# Implementation Approach & Challenges

## Implementation Approach

### Architecture Decision

I chose a class-based OOP approach for the backend to maintain clean separation of concerns and improve code maintainability. The main classes are:

- **AuthClass**: Handles JWT token generation, verification, and user authentication logic
- **SbAuthClient**: Manages all user-related database operations (CRUD for users table)
- **SbDataClient**: Manages all post/issue-related database operations
- **RateLimiter**: Implements in-memory rate limiting using a Map data structure

This separation allowed me to keep authentication logic independent from database operations, making the code easier to test and modify.

### Database Design

I used Supabase (PostgreSQL) with two main tables:

- `usersAuth`: Stores user credentials with hashed passwords using bcrypt
- `posts`: Stores security issues with relationships to users via email

I chose email as the foreign key reference instead of user IDs to simplify the public issue viewing feature, where users can see issues without authentication.

### Authentication Flow

I implemented JWT-based authentication where:

1. User registers/logs in → Server generates JWT token
2. Token is stored client-side
3. Protected routes verify token on each request
4. Token contains user ID, email, and name for quick access without database hits

### Rate Limiting Strategy

Since this was my first time implementing rate limiting from scratch, I researched different approaches and settled on an in-memory solution using JavaScript Maps. The rate limiter:

- Tracks requests per IP address
- Allows 100 requests per 15-minute window
- Automatically cleans up expired entries
- Runs on every API route before processing requests

I initially considered Redis but chose the simpler in-memory approach given the project scope and deployment constraints on Vercel.

### API Design

I followed RESTful principles:

- GET for retrieving data (with query parameters for filtering)
- POST for creating resources
- PUT for updates
- DELETE for removal

I made all GET requests for issues public (no auth required) but protected all write operations (POST, PUT, DELETE) with JWT authentication.

## Challenges Faced and Solutions

### Challenge 1: Rate Limiter Implementation

**Problem**: This was my first time building a rate limiter from scratch. I initially tried to use Redis but ran into connection issues in the serverless Vercel environment.

**Solution**: I switched to an in-memory Map-based implementation. The key insight was using a cleanup function that runs on each request to remove expired entries, preventing memory leaks. I tested it by making rapid requests and confirmed it properly blocks after the limit.

### Challenge 2: Token Persistence Across Requests

**Problem**: During testing, I noticed that after the first successful authenticated request, subsequent requests were failing with 401 errors. The token seemed to be getting lost between requests.

**Solution**: The issue was in how I was extracting the token from the Authorization header. I needed to consistently split the "Bearer <token>" format and handle edge cases where the header might be malformed. I also added JWT expiry (7 days) to handle token lifecycle properly.

### Challenge 3: Supabase Authentication vs Custom JWT

**Problem**: Supabase has built-in auth, but the assignment required custom JWT implementation. I had to decide whether to use Supabase Auth or roll my own.

**Solution**: I chose to implement custom JWT auth while still using Supabase as the database. This meant manually hashing passwords with bcrypt, generating my own JWT tokens, and building the entire auth flow. It gave me more control and better learning experience, though it took longer than using the built-in solution.

### Challenge 4: Password Hashing with Environment Variables

**Problem**: I initially tried to use the NEXT_PUBLIC_SALT environment variable directly in bcrypt.hash(), but bcrypt expects a number, not a string.

**Solution**: I changed the implementation to use a hardcoded number (10) for salt rounds instead of parsing the environment variable. This is acceptable since salt rounds don't need to be secret, just the JWT secret does.

### Challenge 5: UUID vs Integer IDs

**Problem**: Supabase uses UUIDs by default, but I initially wrote my database methods expecting integer IDs, causing type mismatches.

**Solution**: I updated all ID parameters from `number` to `string` type and adjusted the Supabase queries to work with UUID strings. This actually improved security since UUIDs are harder to guess than sequential integers.

### Challenge 6: Testing Authentication Flow

**Problem**: Writing comprehensive tests for 31 endpoints was time-consuming, especially handling token persistence across tests.

**Solution**: I created a bash script that:

1. Registers a user and captures the token
2. Reuses that token for all subsequent authenticated requests
3. Tests both success and failure cases
4. Provides clear pass/fail output

The script helped me catch several bugs, like routes that weren't properly checking for authentication headers.

### Challenge 7: Deployment Environment Variables

**Problem**: The app worked locally but failed on Vercel because environment variables weren't configured.

**Solution**: I had to add all environment variables in the Vercel dashboard and redeploy. I also learned to differentiate between `NEXT_PUBLIC_` variables (exposed to client) and server-only variables.

### Challenge 8: Email Integration (Ongoing)

**Problem**: The Resend email service for password reset isn't working yet. I suspect it's either an API key issue or the email format.

**Solution**: Since this is a nice-to-have feature and not core to the assignment requirements, I decided to submit with email as a known issue and continue debugging it separately. All core authentication and CRUD operations work perfectly.

## Key Learnings

1. **Rate limiting** is more nuanced than I expected - had to think about memory management, cleanup strategies, and edge cases
2. **JWT authentication** requires careful handling of token lifecycle, expiration, and security
3. **Serverless limitations** - can't use stateful solutions like Redis easily
4. **Type safety** in TypeScript caught several bugs early
5. **Comprehensive testing** revealed edge cases I hadn't considered

## What I'd Do Differently

If I were to rebuild this project, I would:

1. Set up proper error logging from the start (would have caught the token issue faster)
2. Write tests alongside development rather than at the end
3. Research deployment environment constraints earlier
4. Consider using a state management library for the frontend
5. Implement proper API documentation with Swagger/OpenAPI

Overall, this was a great learning experience. Building the rate limiter from scratch and implementing custom JWT auth gave me much deeper understanding than using pre-built solutions would have.
