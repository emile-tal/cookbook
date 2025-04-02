import postgres from 'postgres';

// Create a connection pool with a maximum of 10 connections
const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: 'require',
    max: 10, // Maximum number of connections in the pool
    idle_timeout: 20, // Max idle time in seconds
    connect_timeout: 10, // Connection timeout in seconds
});

export default sql; 