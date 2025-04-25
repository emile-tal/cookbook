import postgres from 'postgres';

// Create a connection pool with more resilient settings
const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: 'require',
    max: 20, // Increased max connections
    idle_timeout: 30, // Increased idle timeout
    connect_timeout: 20, // Increased connection timeout
    max_lifetime: 60 * 30, // 30 minutes max lifetime for connections
    prepare: false, // Disable prepared statements to avoid the "prepared statement does not exist" error
});

export default sql; 