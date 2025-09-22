import { OpenPhoneClient } from './client';

// Simple test to verify the client can be instantiated
function testClientInstantiation() {
  console.log('🧪 Testing client instantiation...');

  try {
    const client = new OpenPhoneClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://api.openphone.com',
    });

    const config = client.getConfig();

    if (
      config.apiKey === 'test-api-key' &&
      config.baseUrl === 'https://api.openphone.com'
    ) {
      console.log('✅ Client instantiation test passed');
      return true;
    } else {
      console.log('❌ Client instantiation test failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Client instantiation test failed with error:', error);
    return false;
  }
}

// Test configuration update
function testConfigUpdate() {
  console.log('🧪 Testing configuration update...');

  try {
    const client = new OpenPhoneClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://api.openphone.com',
    });

    client.updateConfig({
      baseUrl: 'https://staging-api.openphone.com',
      timeout: 60000,
    });

    const config = client.getConfig();

    if (
      config.baseUrl === 'https://staging-api.openphone.com' &&
      config.timeout === 60000
    ) {
      console.log('✅ Configuration update test passed');
      return true;
    } else {
      console.log('❌ Configuration update test failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Configuration update test failed with error:', error);
    return false;
  }
}

// Run all tests
function runTests() {
  console.log('🚀 Running OpenPhone SDK tests...\n');

  const tests = [testClientInstantiation, testConfigUpdate];

  let passed = 0;
  const total = tests.length;

  for (const test of tests) {
    if (test()) {
      passed++;
    }
    console.log(''); // Add spacing between tests
  }

  console.log(`📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('💥 Some tests failed!');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runTests();
} else if (typeof import.meta !== 'undefined' && (import.meta as any).main) {
  runTests();
}
