const Grecaptcha = require('grecaptcha');
const { EmailClient } = require("@azure/communication-email");
const { TableClient } = require("@azure/data-tables");

const grecaptchaClient = new Grecaptcha('#{CAPTCHA_SECRET}#');
const connectionString = '#{COMMUNICATION_SERVICES_CONNECTION_STRING}#';
const emailClient = new EmailClient(connectionString);

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5; // Max 5 emails per hour per IP

// Azure Table Storage for rate limiting (shared across all function instances)
let tableClient = null;
const USE_TABLE_STORAGE = '#{AZURE_STORAGE_CONNECTION_STRING}#';

// Initialize table client if connection string is available
if (USE_TABLE_STORAGE && !USE_TABLE_STORAGE.includes('#{')) {
    try {
        tableClient = TableClient.fromConnectionString(
            USE_TABLE_STORAGE,
            "RateLimiting"
        );
        // Create table if it doesn't exist (async, doesn't block)
        tableClient.createTable().catch(() => { }); // Ignore error if table already exists
    } catch (error) {
        console.log('Table storage not configured, using in-memory rate limiting');
    }
}

// Fallback: In-memory rate limiting (for development or if Table Storage not configured)
const requestLog = new Map();

// Input validation
function validateInput(body) {
    const errors = [];
    
    // Check required fields
    if (!body.name || !body.email || !body.message || !body.type || !body.captcha) {
        errors.push('Missing required fields');
    }
    
    // Check for spam patterns
    const spamPatterns = [
        /\b(viagra|cialis|pharmacy|lottery|casino)\b/i,
        /(http|https):\/\/.*\.(xyz|top|loan|click)/i, // Suspicious TLDs
        /\b\w+@\w+\.\w+\b.*\b\w+@\w+\.\w+\b.*\b\w+@\w+\.\w+\b/i // Multiple email addresses
    ];
    
    if (body.message && spamPatterns.some(pattern => pattern.test(body.message))) {
        errors.push('Message contains suspicious content');
    }
    
    return errors;
}

// Rate limiting check using Azure Table Storage (persistent across instances)
async function checkRateLimitWithStorage(ip, context) {
    const now = Date.now();
    const cutoffTime = now - RATE_LIMIT_WINDOW;
    const sanitizedIP = ip.replace(/[^a-zA-Z0-9]/g, ''); // Azure Table requires valid RowKey
    
    try {
        // Get existing rate limit record
        let entity;
        try {
            entity = await tableClient.getEntity("ratelimit", sanitizedIP);
        } catch (error) {
            // Entity doesn't exist, create new one
            entity = {
                partitionKey: "ratelimit",
                rowKey: sanitizedIP,
                requests: JSON.stringify([now])
            };
            await tableClient.createEntity(entity);
            return true;
        }
        
        // Parse existing requests
        const requests = JSON.parse(entity.requests || '[]');
        
        // Filter out old requests
        const recentRequests = requests.filter(timestamp => timestamp > cutoffTime);
        
        // Check if limit exceeded
        if (recentRequests.length >= MAX_REQUESTS_PER_IP) {
            context.log(`Rate limit exceeded for IP ${ip}: ${recentRequests.length} requests in window`);
            return false;
        }
        
        // Add current request and update
        recentRequests.push(now);
        entity.requests = JSON.stringify(recentRequests);
        await tableClient.updateEntity(entity, "Merge");
        
        return true;
    } catch (error) {
        context.log.error('Error checking rate limit in Table Storage:', error);
        // Fall back to allowing request if there's a storage error
        return true;
    }
}

// Fallback: In-memory rate limiting (for development)
function checkRateLimitInMemory(ip) {
    const now = Date.now();
    const userRequests = requestLog.get(ip) || [];
    
    // Clean old requests outside the time window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= MAX_REQUESTS_PER_IP) {
        return false; // Rate limit exceeded
    }
    
    // Add current request
    recentRequests.push(now);
    requestLog.set(ip, recentRequests);
    
    return true; // Rate limit OK
}

// Main rate limiting function that chooses the appropriate method
async function checkRateLimit(ip, context) {
    if (tableClient) {
        return await checkRateLimitWithStorage(ip, context);
    } else {
        return checkRateLimitInMemory(ip);
    }
}

module.exports = async function (context, req) {
    context.log('Processing email request');

    if (!req.body) {
        context.res = {
            status: 400,
            body: "Request body is missing"
        };
        return;
    }
    
    // Get client IP for rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    context.log(`Request from IP: ${clientIP}`);
    
    // Check rate limit
    if (!(await checkRateLimit(clientIP, context))) {
        context.log(`Rate limit exceeded for IP: ${clientIP}`);
        context.res = {
            status: 429,
            body: "Too many requests. Please try again later."
        };
        return;
    }
    
    // Validate input
    const validationErrors = validateInput(req.body);
    if (validationErrors.length > 0) {
        context.log(`Validation failed: ${validationErrors.join(', ')}`);
        context.res = {
            status: 400,
            body: {
                message: "Validation failed",
                errors: validationErrors
            }
        };
        return;
    }

    // Verify reCAPTCHA
    if (await grecaptchaClient.verify(req.body.captcha)) {
        try {
            const emailMessage = {
                senderAddress: '#{EMAIL_FROM}#', // e.g., "DoNotReply@<your-domain>.azurecomm.net"
                content: {
                    subject: `${req.body.name}: New ${req.body.type} submission`,
                    plainText: req.body.message,
                },
                recipients: {
                    to: [
                        { address: '#{EMAIL_TO}#' },
                        { address: req.body.email }
                    ]
                }
            };

            // Start sending email (returns immediately with operation ID)
            const poller = await emailClient.beginSend(emailMessage);
            const messageId = poller.getOperationState().id;

            context.log('Email queued successfully:', messageId);

            // Return success immediately without waiting for delivery
            context.res = { 
                status: 200,
                body: {
                    message: "Email sent successfully",
                    id: messageId
                }
            };

            // Optional: Continue polling in background (non-blocking)
            // This allows logging of final status without delaying the response
            poller.pollUntilDone()
                .then(result => {
                    context.log('Email delivery completed:', result);
                })
                .catch(error => {
                    context.log.error('Email delivery failed:', error);
                });

        } catch (error) {
            context.log.error('Error sending email:', error);
            context.res = {
                status: 500,
                body: {
                    message: "Failed to send email",
                    error: error.message
                }
            };
        }
    } else {
        context.log('reCAPTCHA verification failed');
        context.res = {
            status: 400,
            body: "reCAPTCHA verification failed"
        };
    }
};
