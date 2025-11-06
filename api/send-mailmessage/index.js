const Grecaptcha = require('grecaptcha');
const { EmailClient } = require("@azure/communication-email");

const grecaptchaClient = new Grecaptcha('#{CAPTCHA_SECRET}#');
const connectionString = '#{COMMUNICATION_SERVICES_CONNECTION_STRING}#';
const emailClient = new EmailClient(connectionString);

// Simple in-memory rate limiting (resets on function cold start)
const requestLog = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_IP = 5; // Max 5 emails per hour per IP

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

// Rate limiting check
function checkRateLimit(ip) {
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
    if (!checkRateLimit(clientIP)) {
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

            const poller = await emailClient.beginSend(emailMessage);
            const response = await poller.pollUntilDone();

            context.log('Email sent successfully:', response);

            context.res = {
                status: 200,
                body: {
                    message: "Email sent successfully",
                    id: response.id
                }
            };
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
