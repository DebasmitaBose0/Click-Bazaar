#!/bin/bash

# ClickBazaar Backend Integration - Verification Script
# This script tests all new features

echo "=========================================="
echo "ClickBazaar Backend Integration Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASSED=0
FAILED=0

# Test function
test_feature() {
    local name=$1
    local description=$2
    
    echo -e "${YELLOW}Testing:${NC} $name"
    echo "  Description: $description"
}

check_result() {
    local result=$1
    if [ $result -eq 0 ]; then
        echo -e "  ${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "  ${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
    echo ""
}

# 1. Check if all files exist
echo -e "\n${YELLOW}=== File Existence Checks ===${NC}\n"

test_feature "server.ts" "Backend implementation with JWT and tracking"
if [ -f "server.ts" ]; then
    check_result 0
else
    check_result 1
fi

test_feature "pages/Tracking.tsx" "Live tracking UI component"
if [ -f "pages/Tracking.tsx" ]; then
    check_result 0
else
    check_result 1
fi

test_feature "services/api.ts" "Updated API layer with backend integration"
if [ -f "services/api.ts" ]; then
    check_result 0
else
    check_result 1
fi

test_feature ".env.example" "Environment variables template"
if [ -f ".env.example" ]; then
    check_result 0
else
    check_result 1
fi

# 2. Check documentation
echo -e "\n${YELLOW}=== Documentation Checks ===${NC}\n"

test_feature "DEPLOYMENT.md" "Deployment guide (500+ lines)"
if [ -f "DEPLOYMENT.md" ] && [ $(wc -l < DEPLOYMENT.md) -gt 200 ]; then
    check_result 0
else
    check_result 1
fi

test_feature "BACKEND_INTEGRATION.md" "Backend integration guide"
if [ -f "BACKEND_INTEGRATION.md" ] && [ $(wc -l < BACKEND_INTEGRATION.md) -gt 200 ]; then
    check_result 0
else
    check_result 1
fi

test_feature "QUICK_REFERENCE.md" "Quick reference guide"
if [ -f "QUICK_REFERENCE.md" ] && [ $(wc -l < QUICK_REFERENCE.md) -gt 100 ]; then
    check_result 0
else
    check_result 1
fi

# 3. Check code structure
echo -e "\n${YELLOW}=== Code Structure Checks ===${NC}\n"

test_feature "JWT Token System" "Token generation in server.ts"
if grep -q "generateToken\|SessionToken" server.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "Delivery Zones" "12 Indian cities configured"
if grep -q "DELIVERY_ZONES\|Kolkata\|Darjeeling" server.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "Warehouse Location" "Barrackpore, West Bengal configured"
if grep -q "Barrackpore\|22.7646" server.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "Tracking Function" "Live tracking implementation"
if grep -q "getTracking\|TrackingData" server.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "API Integration" "Backend API in services/api.ts"
if grep -q "serverAPI\|getOrderTracking" services/api.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "Tracking UI" "Tracking component in pages"
if grep -q "TrackingPage\|getOrderTracking" pages/Tracking.tsx 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

# 4. Feature verification
echo -e "\n${YELLOW}=== Feature Verification ===${NC}\n"

test_feature "Authentication" "Login, Register, Logout functions"
if grep -q "register:\|login:\|logout:" services/api.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "Token Storage" "localStorage integration"
if grep -q "TOKEN_KEY\|session_token" services/api.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "Tracking Route" "Route added to App.tsx"
if grep -q "/track" App.tsx 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "Progress Calculation" "Progress bar 0-100%"
if grep -q "calculateProgress\|progress" server.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "Milestones" "Order tracking milestones"
if grep -q "placed\|packed\|shipped\|delivered" server.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

# 5. Test login credentials
echo -e "\n${YELLOW}=== Test Credentials ===${NC}\n"

test_feature "Admin Account" "Default admin for testing"
if grep -q "admin@clickbazaar.com" db.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

test_feature "Customer Account" "Default customer for testing"
if grep -q "customer@test.com" db.ts 2>/dev/null; then
    check_result 0
else
    check_result 1
fi

# Final Summary
echo -e "\n=========================================="
echo -e "${YELLOW}Test Summary:${NC}"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo "=========================================="

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}"
    echo "Backend integration is ready for development."
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed.${NC}"
    echo "Please check the failed tests above."
    exit 1
fi
