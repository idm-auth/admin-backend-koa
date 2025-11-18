/**
 * Test constants for consistent test data across the test suite.
 * These are NOT production credentials and are safe for testing.
 */

// Test password that meets OWASP requirements
// Used across all tests for consistency and security compliance
export const TEST_PASSWORD = 'Password123!'; // TEST_PASSWORD - Test credential - not production';

// Test email domain for all test scenarios
export const TEST_EMAIL_DOMAIN = 'idm-auth.io';

import { v4 as uuidv4 } from 'uuid';

// Helper to generate test emails with optional UUID
export const generateTestEmail = (prefix = 'test', uuid?: string) => {
  const id = uuid || uuidv4();
  return `${prefix}-${id}@${TEST_EMAIL_DOMAIN}`;
};

// Helper for simple static test emails
export const createTestEmail = (name: string) => `${name}@${TEST_EMAIL_DOMAIN}`;
