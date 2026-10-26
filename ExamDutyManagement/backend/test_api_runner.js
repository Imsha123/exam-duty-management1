const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function request(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const bodyStr = data ? JSON.stringify(data) : null;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    if (bodyStr) {
      reqHeaders['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: reqHeaders,
      timeout: 8000,
    };

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(rawData);
        } catch {
          parsed = rawData;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (bodyStr) {
      req.write(bodyStr);
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('STARTING AUTOMATED QA TEST EXECUTION FOR EXAM DUTY MANAGEMENT');
  console.log('================================================================\n');

  const results = [];

  function record(id, suite, name, status, details = '') {
    results.push({ id, suite, name, status, details });
    const mark = status === 'PASS' ? '✅ PASS' : '❌ FAIL';
    console.log(`[${id}] ${mark} - ${suite}: ${name} ${details ? `(${details})` : ''}`);
  }

  try {
    // 1. Health API
    const health = await request('GET', '/health');
    if (health.statusCode === 200 && health.data?.database === 'connected') {
      record('TC-01', 'System Health', 'Database & API Connectivity', 'PASS', 'Status 200, DB connected');
    } else {
      record('TC-01', 'System Health', 'Database & API Connectivity', 'FAIL', `Status: ${health.statusCode}`);
    }

    // 2. Auth: Admin Login 1 (devsupport / dev@support123)
    const devLogin = await request('POST', '/auth/login', {
      resourceId: 'devsupport',
      mobile: 'dev@support123',
    });
    if ((devLogin.statusCode === 200 || devLogin.statusCode === 201) && devLogin.data?.employee?.isAdmin === true) {
      record('TC-02A', 'Authentication', 'Admin 1 Login (devsupport / dev@support123)', 'PASS', `Welcome ${devLogin.data?.employee?.name} (Admin Portal access verified)`);
    } else {
      record('TC-02A', 'Authentication', 'Admin 1 Login (devsupport / dev@support123)', 'FAIL', `Status: ${devLogin.statusCode}`);
    }

    // 2B. Auth: Admin Login 2 (Mohan / Mohan@123)
    const mohanLogin = await request('POST', '/auth/login', {
      resourceId: 'Mohan',
      mobile: 'Mohan@123',
    });
    if ((mohanLogin.statusCode === 200 || mohanLogin.statusCode === 201) && mohanLogin.data?.employee?.isAdmin === true) {
      record('TC-02B', 'Authentication', 'Admin 2 Login (Mohan / Mohan@123)', 'PASS', `Welcome ${mohanLogin.data?.employee?.name} (Admin Portal access verified)`);
    } else {
      record('TC-02B', 'Authentication', 'Admin 2 Login (Mohan / Mohan@123)', 'FAIL', `Status: ${mohanLogin.statusCode}`);
    }

    // 3. Auth: Negative Test (Invalid credentials)
    const invalidLogin = await request('POST', '/auth/login', {
      resourceId: 'devsupport',
      mobile: 'wrongpassword',
    });
    if (invalidLogin.statusCode === 401 || invalidLogin.statusCode === 400 || invalidLogin.statusCode === 404) {
      record('TC-03', 'Authentication', 'Reject Invalid Password for devsupport', 'PASS', `Correctly rejected with HTTP ${invalidLogin.statusCode}`);
    } else {
      record('TC-03', 'Authentication', 'Reject Invalid Password for devsupport', 'FAIL', `Expected 4xx, got ${invalidLogin.statusCode}`);
    }

    // 4. Cities: Get all cities
    const citiesRes = await request('GET', '/cities');
    if (citiesRes.statusCode === 200 && Array.isArray(citiesRes.data) && citiesRes.data.length >= 7) {
      record('TC-04', 'Master Data: City', 'Fetch All Registered Cities', 'PASS', `Fetched ${citiesRes.data.length} cities`);
    } else {
      record('TC-04', 'Master Data: City', 'Fetch All Registered Cities', 'FAIL', `Status: ${citiesRes.statusCode}`);
    }

    // 5. Cities: Create, Update, Delete City
    const testCityName = 'QA-City-' + Date.now().toString().slice(-4);
    const createCityRes = await request('POST', '/cities', { name: testCityName, state: 'Karnataka' });
    let createdCityId = null;
    if ((createCityRes.statusCode === 200 || createCityRes.statusCode === 201) && createCityRes.data?.id) {
      createdCityId = createCityRes.data.id;
      record('TC-05', 'Master Data: City', 'Create New City', 'PASS', `Created city: ${testCityName} (ID: ${createdCityId})`);
    } else {
      record('TC-05', 'Master Data: City', 'Create New City', 'FAIL', `Status: ${createCityRes.statusCode}`);
    }

    if (createdCityId) {
      const updateCityRes = await request('PUT', `/cities/${createdCityId}`, { name: testCityName + '-Updated' });
      if (updateCityRes.statusCode === 200) {
        record('TC-06', 'Master Data: City', 'Update City Details', 'PASS', 'City updated successfully');
      } else {
        record('TC-06', 'Master Data: City', 'Update City Details', 'FAIL', `Status: ${updateCityRes.statusCode}`);
      }

      const delCityRes = await request('DELETE', `/cities/${createdCityId}`);
      if (delCityRes.statusCode === 200) {
        record('TC-07', 'Master Data: City', 'Delete City', 'PASS', 'City deleted cleanly');
      } else {
        record('TC-07', 'Master Data: City', 'Delete City', 'FAIL', `Status: ${delCityRes.statusCode}`);
      }
    }

    // 6. Exam Centers: Fetch centers
    const centersRes = await request('GET', '/centers');
    if (centersRes.statusCode === 200 && Array.isArray(centersRes.data) && centersRes.data.length > 0) {
      record('TC-08', 'Master Data: Centers', 'Fetch Centers with City Relation', 'PASS', `Fetched ${centersRes.data.length} centers`);
    } else {
      record('TC-08', 'Master Data: Centers', 'Fetch Centers with City Relation', 'FAIL', `Status: ${centersRes.statusCode}`);
    }

    // 7. Exam Center: Create, Update, Delete
    const targetCityId = citiesRes.data[0]?.id;
    const testCenterCode = 'QA-' + Date.now().toString().slice(-4);
    const createCenterRes = await request('POST', '/centers', {
      centerCode: testCenterCode,
      centerName: 'QA Test Center ' + testCenterCode,
      cityId: targetCityId,
      address: 'QA Test Center Address',
    });
    let createdCenterId = null;
    if ((createCenterRes.statusCode === 200 || createCenterRes.statusCode === 201) && createCenterRes.data?.id) {
      createdCenterId = createCenterRes.data.id;
      record('TC-09', 'Master Data: Centers', 'Create New Examination Center', 'PASS', `Created center: ${testCenterCode}`);
    } else {
      record('TC-09', 'Master Data: Centers', 'Create New Examination Center', 'FAIL', `Status: ${createCenterRes.statusCode}`);
    }

    if (createdCenterId) {
      const delCenterRes = await request('DELETE', `/centers/${createdCenterId}`);
      if (delCenterRes.statusCode === 200) {
        record('TC-10', 'Master Data: Centers', 'Delete Examination Center', 'PASS', 'Center deleted cleanly');
      } else {
        record('TC-10', 'Master Data: Centers', 'Delete Examination Center', 'FAIL', `Status: ${delCenterRes.statusCode}`);
      }
    }

    // 8. Exams: Fetch all exams
    const examsRes = await request('GET', '/exams');
    if (examsRes.statusCode === 200 && Array.isArray(examsRes.data) && examsRes.data.length > 0) {
      record('TC-11', 'Master Data: Exams', 'Fetch Registered Examinations & Mock Tests', 'PASS', `Found ${examsRes.data.length} exams`);
    } else {
      record('TC-11', 'Master Data: Exams', 'Fetch Registered Examinations & Mock Tests', 'FAIL', `Status: ${examsRes.statusCode}`);
    }

    // 9. Exams: Create & Delete
    const testExamName = 'QA Exam ' + Date.now().toString().slice(-4);
    const createExamRes = await request('POST', '/exams', {
      name: testExamName,
      code: 'QA-' + Date.now().toString().slice(-3),
      type: 'Exam',
    });
    let createdExamId = null;
    if ((createExamRes.statusCode === 200 || createExamRes.statusCode === 201) && createExamRes.data?.id) {
      createdExamId = createExamRes.data.id;
      record('TC-12', 'Master Data: Exams', 'Create New Examination Record', 'PASS', `Created exam: ${testExamName}`);
    } else {
      record('TC-12', 'Master Data: Exams', 'Create New Examination Record', 'FAIL', `Status: ${createExamRes.statusCode}`);
    }

    if (createdExamId) {
      const delExamRes = await request('DELETE', `/exams/${createdExamId}`);
      if (delExamRes.statusCode === 200) {
        record('TC-13', 'Master Data: Exams', 'Delete Examination Record', 'PASS', 'Exam deleted cleanly');
      } else {
        record('TC-13', 'Master Data: Exams', 'Delete Examination Record', 'FAIL', `Status: ${delExamRes.statusCode}`);
      }
    }

    // 10. Master Data: Roles & Shifts
    const rolesRes = await request('GET', '/roles');
    if (rolesRes.statusCode === 200 && Array.isArray(rolesRes.data) && rolesRes.data.length > 0) {
      record('TC-14', 'Master Data: Roles', 'Fetch Standard Duty Roles', 'PASS', `Found ${rolesRes.data.length} duty roles`);
    } else {
      record('TC-14', 'Master Data: Roles', 'Fetch Standard Duty Roles', 'FAIL', `Status: ${rolesRes.statusCode}`);
    }

    const shiftsRes = await request('GET', '/shifts');
    if (shiftsRes.statusCode === 200 && Array.isArray(shiftsRes.data) && shiftsRes.data.length >= 3) {
      record('TC-15', 'Master Data: Shifts', 'Fetch Shift Timings (Shift 1, 2, 3)', 'PASS', `Found ${shiftsRes.data.length} shifts`);
    } else {
      record('TC-15', 'Master Data: Shifts', 'Fetch Shift Timings (Shift 1, 2, 3)', 'FAIL', `Status: ${shiftsRes.statusCode}`);
    }

    // 11. Employees: Fetch all employees
    const employeesRes = await request('GET', '/employees');
    if (employeesRes.statusCode === 200 && Array.isArray(employeesRes.data) && employeesRes.data.length > 0) {
      record('TC-16', 'Workforce Management', 'Fetch Registered Workforce Members', 'PASS', `Found ${employeesRes.data.length} workforce members`);
    } else {
      record('TC-16', 'Workforce Management', 'Fetch Registered Workforce Members', 'FAIL', `Status: ${employeesRes.statusCode}`);
    }

    // 12. Duties: Fetch all assigned duties
    const dutiesRes = await request('GET', '/duties');
    if (dutiesRes.statusCode === 200 && dutiesRes.data?.status === 'ok') {
      record('TC-17', 'Duty Assignment', 'Fetch Assigned Duties with Full Relations', 'PASS', `Found ${dutiesRes.data.count} duty record(s)`);
    } else {
      record('TC-17', 'Duty Assignment', 'Fetch Assigned Duties with Full Relations', 'FAIL', `Status: ${dutiesRes.statusCode}`);
    }

    // 13. Dashboard Analytics
    const dashboardRes = await request('GET', '/dashboard/employee?resourceId=ALL&year=2026');
    if (dashboardRes.statusCode === 200 && dashboardRes.data?.status === 'ok' && dashboardRes.data?.stats) {
      record('TC-18', 'Dashboard & Reporting', 'Fetch KPI Statistics & Monthly Duty Trends', 'PASS', `Total Duties: ${dashboardRes.data.stats.totalDuties}`);
    } else {
      record('TC-18', 'Dashboard & Reporting', 'Fetch KPI Statistics & Monthly Duty Trends', 'FAIL', `Status: ${dashboardRes.statusCode}`);
    }

    // 14. Identity Verification Lookup
    const idCheckRes = await request('GET', '/employees/597305');
    if (idCheckRes.statusCode === 200 && idCheckRes.data?.resourceId === '597305') {
      record('TC-19', 'Identity Verification', 'Verify Employee Identity Status', 'PASS', `Verified status: ${idCheckRes.data.isIdentityVerified}`);
    } else {
      record('TC-19', 'Identity Verification', 'Verify Employee Identity Status', 'FAIL', `Status: ${idCheckRes.statusCode}`);
    }

    // 15. Duty Lifecycle: Create New Duty Assignment
    const testDutyDate = '2026-11-' + Math.floor(10 + Math.random() * 18);
    const createDutyRes = await request('POST', '/duties', {
      resourceId: '597305',
      employeeResourceId: '597305',
      dutyDate: testDutyDate,
      dutyType: 'Exam',
      cityId: citiesRes.data[0]?.id,
      centerId: centersRes.data[0]?.id,
      examId: examsRes.data[0]?.id,
      roleId: rolesRes.data[0]?.id,
      shiftId: shiftsRes.data[0]?.id,
      reportingTime: '07:30 AM',
      shiftEndTime: '01:30 PM',
      comments: 'Automated QA Test Duty',
    });

    let createdDutyId = null;
    if ((createDutyRes.statusCode === 200 || createDutyRes.statusCode === 201) && createDutyRes.data?.duty?.id) {
      createdDutyId = createDutyRes.data.duty.id;
      record('TC-20', 'Duty Lifecycle', 'Create New Duty Assignment', 'PASS', `Duty ID: ${createdDutyId}`);
    } else {
      record('TC-20', 'Duty Lifecycle', 'Create New Duty Assignment', 'FAIL', `Status: ${createDutyRes.statusCode}`);
    }

    // 16. Duty Conflict Prevention (Duplicate Assignment Rejection)
    if (createdDutyId) {
      const duplicateRes = await request('POST', '/duties', {
        resourceId: '597305',
        employeeResourceId: '597305',
        dutyDate: testDutyDate,
        dutyType: 'Exam',
        cityId: citiesRes.data[0]?.id,
        centerId: centersRes.data[0]?.id,
        examId: examsRes.data[0]?.id,
        roleId: rolesRes.data[0]?.id,
        shiftId: shiftsRes.data[0]?.id,
      });

      if (duplicateRes.statusCode === 409 || duplicateRes.statusCode === 400) {
        record('TC-21', 'Duty Lifecycle', 'Conflict Prevention (Duplicate Duty Blocked)', 'PASS', `Correctly blocked duplicate (HTTP ${duplicateRes.statusCode})`);
      } else {
        record('TC-21', 'Duty Lifecycle', 'Conflict Prevention (Duplicate Duty Blocked)', 'FAIL', `Expected 409 Conflict, got ${duplicateRes.statusCode}`);
      }

      // 17. Update Duty Status
      const updateDutyRes = await request('PUT', `/duties/${createdDutyId}`, {
        reportingTime: '08:00 AM',
      });
      if (updateDutyRes.statusCode === 200) {
        record('TC-22', 'Duty Lifecycle', 'Update Duty Schedule / Timings', 'PASS', 'Timings updated to 08:00 AM');
      } else {
        record('TC-22', 'Duty Lifecycle', 'Update Duty Schedule / Timings', 'FAIL', `Status: ${updateDutyRes.statusCode}`);
      }

      // 18. Delete Test Duty
      const delDutyRes = await request('DELETE', `/duties/${createdDutyId}`);
      if (delDutyRes.statusCode === 200) {
        record('TC-23', 'Duty Lifecycle', 'Delete Duty Assignment & Clean Up', 'PASS', 'Duty deleted cleanly');
      } else {
        record('TC-23', 'Duty Lifecycle', 'Delete Duty Assignment & Clean Up', 'FAIL', `Status: ${delDutyRes.statusCode}`);
      }
    }

    // 19. Workforce Registration & Lifecycle
    const testResId = 'QA' + Date.now().toString().slice(-4);
    const testMobile = '98' + Math.floor(10000000 + Math.random() * 89999999);
    const createEmpRes = await request('POST', '/employees', {
      resourceId: testResId,
      name: 'QA Test Staff ' + testResId,
      mobile: testMobile,
      city: 'Mysuru',
      email: `qa_${testResId}@examduty.gov.in`,
    });

    if ((createEmpRes.statusCode === 200 || createEmpRes.statusCode === 201) && createEmpRes.data?.id) {
      record('TC-24', 'Workforce Management', 'Register New Workforce Employee', 'PASS', `Registered Staff ID: ${testResId}`);

      // Delete temporary employee
      const delEmpRes = await request('DELETE', `/employees/${testResId}`);
      if (delEmpRes.statusCode === 200) {
        record('TC-25', 'Workforce Management', 'Delete Employee Record & Clean Up', 'PASS', `Cleaned up test staff ${testResId}`);
      } else {
        record('TC-25', 'Workforce Management', 'Delete Employee Record & Clean Up', 'FAIL', `Status: ${delEmpRes.statusCode}`);
      }
    } else {
      record('TC-24', 'Workforce Management', 'Register New Workforce Employee', 'FAIL', `Status: ${createEmpRes.statusCode}`);
    }

  } catch (err) {
    console.error('Fatal test error:', err);
  }

  console.log('\n================================================================');
  console.log(`TEST EXECUTION SUMMARY: ${results.filter(r => r.status === 'PASS').length}/${results.length} PASSED`);
  console.log('================================================================');
  return results;
}

runTestSuite();
