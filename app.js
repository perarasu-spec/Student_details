/**
 * Student Information & Record System
 * JavaScript Logic: State Management, Dynamic Forms, Storage, Calculations & Modal View
 */

// Storage Key
const STORAGE_KEY = 'student_portal_records_v1';

// App State
let students = [];
let editingStudentId = null;

// Initial Default Subjects for new entries
const DEFAULT_SUBJECTS = [
  { name: 'Mathematics / Discrete Structures', maxMarks: 100, marksObtained: 88 },
  { name: 'Data Structures & Algorithms', maxMarks: 100, marksObtained: 92 },
  { name: 'Computer Architecture & Org', maxMarks: 100, marksObtained: 79 },
  { name: 'Database Management Systems', maxMarks: 100, marksObtained: 85 },
  { name: 'Software Engineering & Ethics', maxMarks: 100, marksObtained: 90 }
];

// Sample demo datasets to showcase immediately
const SAMPLE_STUDENTS = [
  {
    id: 'stud-101',
    fullName: 'Sophia Martinez',
    rollNo: '2026CS101',
    dob: '2004-05-14',
    gender: 'Female',
    phone: '+1 555-019-4821',
    email: 'sophia.martinez@university.edu',
    department: 'Computer Science & Engineering',
    semester: 'Semester 4',
    family: {
      fatherName: 'Carlos Martinez',
      fatherContact: '+1 555-019-4820',
      fatherOccupation: 'Civil Engineer',
      motherName: 'Elena Martinez',
      motherContact: '+1 555-019-4822',
      motherOccupation: 'High School Teacher',
      guardianName: 'Carlos Martinez',
      guardianPhone: '+1 555-019-4820',
      homeAddress: '742 Evergreen Terrace, Springfield, OR 97477'
    },
    attendance: {
      totalClasses: 120,
      attendedClasses: 112,
      percentage: 93.33
    },
    subjects: [
      { name: 'Design & Analysis of Algorithms', maxMarks: 100, marksObtained: 94, grade: 'A+' },
      { name: 'Database Management Systems', maxMarks: 100, marksObtained: 91, grade: 'A+' },
      { name: 'Operating Systems', maxMarks: 100, marksObtained: 88, grade: 'A' },
      { name: 'Computer Networks', maxMarks: 100, marksObtained: 85, grade: 'A' },
      { name: 'Theory of Computation', maxMarks: 100, marksObtained: 89, grade: 'A' }
    ],
    summary: {
      totalMax: 500,
      totalObtained: 447,
      overallPercentage: 89.4,
      overallStanding: 'First Class with Distinction'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'stud-102',
    fullName: 'Liam Alexander Vance',
    rollNo: '2026AI204',
    dob: '2003-11-28',
    gender: 'Male',
    phone: '+1 555-014-9932',
    email: 'liam.vance@university.edu',
    department: 'Data Science & AI',
    semester: 'Semester 6',
    family: {
      fatherName: 'David Vance',
      fatherContact: '+1 555-014-9930',
      fatherOccupation: 'Financial Analyst',
      motherName: 'Sarah Vance',
      motherContact: '+1 555-014-9931',
      motherOccupation: 'Physician',
      guardianName: 'David Vance',
      guardianPhone: '+1 555-014-9930',
      homeAddress: '124 Blossom Hill Road, Austin, TX 78704'
    },
    attendance: {
      totalClasses: 110,
      attendedClasses: 78,
      percentage: 70.91
    },
    subjects: [
      { name: 'Deep Learning & Neural Networks', maxMarks: 100, marksObtained: 78, grade: 'B+' },
      { name: 'Natural Language Processing', maxMarks: 100, marksObtained: 82, grade: 'A' },
      { name: 'Big Data Engineering', maxMarks: 100, marksObtained: 74, grade: 'B' },
      { name: 'Ethics in Artificial Intelligence', maxMarks: 100, marksObtained: 88, grade: 'A' },
      { name: 'Computer Vision', maxMarks: 100, marksObtained: 71, grade: 'B' }
    ],
    summary: {
      totalMax: 500,
      totalObtained: 393,
      overallPercentage: 78.6,
      overallStanding: 'First Class'
    },
    createdAt: new Date().toISOString()
  }
];

// DOM Elements
const studentForm = document.getElementById('student-form');
const formTitle = document.getElementById('form-title');
const editIndicator = document.getElementById('edit-indicator');
const studentIdInput = document.getElementById('student-id');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const saveStudentBtn = document.getElementById('save-student-btn');

// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const nextTabButtons = document.querySelectorAll('.next-tab-btn');
const prevTabButtons = document.querySelectorAll('.prev-tab-btn');

// Attendance Elements
const totalClassesInput = document.getElementById('totalClasses');
const attendedClassesInput = document.getElementById('attendedClasses');
const attendancePercentageInput = document.getElementById('attendancePercentage');
const attendanceBadge = document.getElementById('attendanceBadge');

// Subject & Marks Elements
const subjectsContainer = document.getElementById('subjects-container');
const addSubjectBtn = document.getElementById('add-subject-btn');
const summaryTotalScored = document.getElementById('summary-total-scored');
const summaryPercentage = document.getElementById('summary-percentage');
const summaryStanding = document.getElementById('summary-standing');

// Records & Search Elements
const studentCardsGrid = document.getElementById('student-cards-grid');
const emptyState = document.getElementById('empty-state');
const totalStudentsCount = document.getElementById('total-students-count');
const searchInput = document.getElementById('search-input');
const departmentFilter = document.getElementById('department-filter');
const clearAllBtn = document.getElementById('clear-all-btn');
const loadSampleBtn = document.getElementById('load-sample-btn');
const exportCsvBtn = document.getElementById('export-csv-btn');

// Modal Elements
const studentModal = document.getElementById('student-modal');
const modalStudentName = document.getElementById('modal-student-name');
const modalStudentRoll = document.getElementById('modal-student-roll');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal-btn');
const closeModalFooterBtn = document.getElementById('close-modal-footer-btn');
const editFromModalBtn = document.getElementById('edit-from-modal-btn');
const printModalBtn = document.getElementById('print-modal-btn');

// Active Modal Student ID
let activeModalStudentId = null;

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  setupEventListeners();
  populateInitialSubjectRows();
  renderStudentRecords();
});

function loadFromLocalStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      students = JSON.parse(rawData);
    } else {
      // First time experience: preload demo data so app is immediately alive
      students = [...SAMPLE_STUDENTS];
      saveToLocalStorage();
    }
  } catch (e) {
    console.error('Error loading records from LocalStorage:', e);
    students = [];
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Error saving records to LocalStorage:', e);
    showToast('Failed to save data to local storage', 'danger');
  }
}

// ==========================================
// Event Listeners Setup
// ==========================================
function setupEventListeners() {
  // Tab Switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  nextTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTabId = btn.dataset.next;
      switchTab(nextTabId);
    });
  });

  prevTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const prevTabId = btn.dataset.prev;
      switchTab(prevTabId);
    });
  });

  // Attendance Auto-calculation
  totalClassesInput.addEventListener('input', calculateAttendanceFromClasses);
  attendedClassesInput.addEventListener('input', calculateAttendanceFromClasses);
  attendancePercentageInput.addEventListener('input', () => {
    updateAttendanceBadge(parseFloat(attendancePercentageInput.value) || 0);
  });

  // Subjects Management
  addSubjectBtn.addEventListener('click', () => {
    addSubjectRow();
    updateMarksSummary();
  });

  // Form Submission
  studentForm.addEventListener('submit', handleFormSubmit);

  // Cancel Edit
  cancelEditBtn.addEventListener('click', resetForm);

  // Search and Filter
  searchInput.addEventListener('input', filterAndRenderStudents);
  departmentFilter.addEventListener('change', filterAndRenderStudents);

  // Quick Action Buttons
  loadSampleBtn.addEventListener('click', handleLoadSampleData);
  exportCsvBtn.addEventListener('click', exportToCsv);
  clearAllBtn.addEventListener('click', handleClearAll);

  // Modal Controls
  closeModalBtn.addEventListener('click', closeModal);
  closeModalFooterBtn.addEventListener('click', closeModal);
  editFromModalBtn.addEventListener('click', () => {
    if (activeModalStudentId) {
      closeModal();
      startEditingStudent(activeModalStudentId);
    }
  });
  printModalBtn.addEventListener('click', () => {
    window.print();
  });

  // Close modal when clicking outside
  studentModal.addEventListener('click', (e) => {
    if (e.target === studentModal) {
      closeModal();
    }
  });
}

// ==========================================
// Tab Switching
// ==========================================
function switchTab(tabId) {
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

// ==========================================
// Attendance Functions
// ==========================================
function calculateAttendanceFromClasses() {
  const total = parseFloat(totalClassesInput.value);
  const attended = parseFloat(attendedClassesInput.value);

  if (!isNaN(total) && !isNaN(attended) && total > 0) {
    if (attended > total) {
      attendedClassesInput.value = total;
      showToast('Attended classes cannot exceed total classes', 'warning');
    }
    const safeAttended = Math.min(attended, total);
    const percentage = ((safeAttended / total) * 100).toFixed(2);
    attendancePercentageInput.value = percentage;
    updateAttendanceBadge(parseFloat(percentage));
  }
}

function updateAttendanceBadge(percent) {
  if (isNaN(percent) || percent <= 0) {
    attendanceBadge.textContent = 'Enter %';
    attendanceBadge.className = 'status-pill status-warning';
    return;
  }

  if (percent >= 75) {
    attendanceBadge.textContent = `Good (${percent}% >= 75%)`;
    attendanceBadge.className = 'status-pill status-good';
  } else if (percent >= 60) {
    attendanceBadge.textContent = `Warning (${percent}% < 75%)`;
    attendanceBadge.className = 'status-pill status-warning';
  } else {
    attendanceBadge.textContent = `Critical (${percent}% < 60%)`;
    attendanceBadge.className = 'status-pill status-danger';
  }
}

// ==========================================
// Subject & Marks Handling
// ==========================================
function populateInitialSubjectRows(subjects = DEFAULT_SUBJECTS) {
  subjectsContainer.innerHTML = '';
  subjects.forEach(subj => addSubjectRow(subj.name, subj.maxMarks, subj.marksObtained));
  updateMarksSummary();
}

function addSubjectRow(name = '', maxMarks = 100, marksObtained = '') {
  const tr = document.createElement('tr');
  tr.className = 'subject-row';

  tr.innerHTML = `
    <td>
      <input type="text" class="subject-name" placeholder="Subject Name" value="${escapeHtml(name)}" required />
    </td>
    <td>
      <input type="number" class="subject-max" min="1" max="500" value="${maxMarks}" required />
    </td>
    <td>
      <input type="number" class="subject-scored" min="0" max="500" placeholder="Marks" value="${marksObtained}" required />
    </td>
    <td>
      <span class="subject-grade-badge status-pill status-good">-</span>
    </td>
    <td style="text-align: center;">
      <button type="button" class="delete-row-btn" title="Remove subject">&times;</button>
    </td>
  `;

  // Dynamic calculation on row inputs
  const scoredInput = tr.querySelector('.subject-scored');
  const maxInput = tr.querySelector('.subject-max');
  const deleteBtn = tr.querySelector('.delete-row-btn');

  const recalculateRow = () => {
    const scored = parseFloat(scoredInput.value) || 0;
    const max = parseFloat(maxInput.value) || 100;

    if (scored > max) {
      scoredInput.value = max;
    }

    const effectiveScore = Math.min(scored, max);
    const rowPercent = max > 0 ? (effectiveScore / max) * 100 : 0;
    const gradeBadge = tr.querySelector('.subject-grade-badge');
    const { grade, className } = computeGrade(rowPercent);
    gradeBadge.textContent = grade;
    gradeBadge.className = `subject-grade-badge status-pill ${className}`;

    updateMarksSummary();
  };

  scoredInput.addEventListener('input', recalculateRow);
  maxInput.addEventListener('input', recalculateRow);

  deleteBtn.addEventListener('click', () => {
    const totalRows = subjectsContainer.querySelectorAll('.subject-row').length;
    if (totalRows <= 1) {
      showToast('At least one subject is required', 'warning');
      return;
    }
    tr.remove();
    updateMarksSummary();
  });

  subjectsContainer.appendChild(tr);
  recalculateRow();
}

function computeGrade(percentage) {
  if (percentage >= 90) return { grade: 'A+', className: 'status-good' };
  if (percentage >= 80) return { grade: 'A', className: 'status-good' };
  if (percentage >= 70) return { grade: 'B', className: 'status-good' };
  if (percentage >= 60) return { grade: 'C', className: 'status-warning' };
  if (percentage >= 50) return { grade: 'D', className: 'status-warning' };
  return { grade: 'F (Fail)', className: 'status-danger' };
}

function updateMarksSummary() {
  const rows = subjectsContainer.querySelectorAll('.subject-row');
  let totalMax = 0;
  let totalObtained = 0;

  rows.forEach(row => {
    const max = parseFloat(row.querySelector('.subject-max').value) || 0;
    const scored = parseFloat(row.querySelector('.subject-scored').value) || 0;
    totalMax += max;
    totalObtained += scored;
  });

  summaryTotalScored.textContent = `${totalObtained} / ${totalMax}`;

  let avgPercent = 0;
  let standing = 'No Data';

  if (totalMax > 0) {
    avgPercent = ((totalObtained / totalMax) * 100).toFixed(2);
    summaryPercentage.textContent = `${avgPercent}%`;

    if (avgPercent >= 85) {
      standing = 'Distinction';
      summaryStanding.style.color = '#059669';
    } else if (avgPercent >= 70) {
      standing = 'First Class';
      summaryStanding.style.color = '#2563eb';
    } else if (avgPercent >= 55) {
      standing = 'Second Class';
      summaryStanding.style.color = '#d97706';
    } else if (avgPercent >= 40) {
      standing = 'Pass';
      summaryStanding.style.color = '#64748b';
    } else {
      standing = 'Needs Improvement / Fail';
      summaryStanding.style.color = '#dc2626';
    }
  } else {
    summaryPercentage.textContent = '0.00%';
  }

  summaryStanding.textContent = standing;
}

// ==========================================
// Form Submission & Validation
// ==========================================
function handleFormSubmit(e) {
  e.preventDefault();

  // Validate form fields
  if (!validateForm()) {
    return;
  }

  // Gather basic details
  const fullName = document.getElementById('fullName').value.trim();
  const rollNo = document.getElementById('rollNo').value.trim();
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const department = document.getElementById('department').value;
  const semester = document.getElementById('semester').value;

  // Check unique roll number if adding new or changing
  const isDuplicate = students.some(s => s.rollNo.toLowerCase() === rollNo.toLowerCase() && s.id !== editingStudentId);
  if (isDuplicate) {
    showToast(`Roll Number "${rollNo}" already exists! Please use a unique Roll No.`, 'danger');
    switchTab('tab-basic');
    document.getElementById('rollNo').focus();
    return;
  }

  // Gather family details
  const family = {
    fatherName: document.getElementById('fatherName').value.trim(),
    fatherContact: document.getElementById('fatherContact').value.trim(),
    fatherOccupation: document.getElementById('fatherOccupation').value.trim(),
    motherName: document.getElementById('motherName').value.trim(),
    motherContact: document.getElementById('motherContact').value.trim(),
    motherOccupation: document.getElementById('motherOccupation').value.trim(),
    guardianName: document.getElementById('guardianName').value.trim(),
    guardianPhone: document.getElementById('guardianPhone').value.trim(),
    homeAddress: document.getElementById('homeAddress').value.trim()
  };

  // Gather attendance
  const totalClasses = parseFloat(totalClassesInput.value) || 0;
  const attendedClasses = parseFloat(attendedClassesInput.value) || 0;
  const attendancePercentage = parseFloat(attendancePercentageInput.value) || 0;

  const attendance = {
    totalClasses,
    attendedClasses,
    percentage: attendancePercentage
  };

  // Gather subjects & marks
  const subjectRows = subjectsContainer.querySelectorAll('.subject-row');
  const subjects = [];
  let totalMax = 0;
  let totalObtained = 0;

  subjectRows.forEach(row => {
    const sName = row.querySelector('.subject-name').value.trim();
    const sMax = parseFloat(row.querySelector('.subject-max').value) || 100;
    const sScored = parseFloat(row.querySelector('.subject-scored').value) || 0;
    const percent = sMax > 0 ? (sScored / sMax) * 100 : 0;
    const { grade } = computeGrade(percent);

    if (sName) {
      subjects.push({
        name: sName,
        maxMarks: sMax,
        marksObtained: sScored,
        grade
      });
      totalMax += sMax;
      totalObtained += sScored;
    }
  });

  const overallPercentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(2)) : 0;
  let overallStanding = 'Pass';
  if (overallPercentage >= 85) overallStanding = 'First Class with Distinction';
  else if (overallPercentage >= 70) overallStanding = 'First Class';
  else if (overallPercentage >= 55) overallStanding = 'Second Class';
  else if (overallPercentage < 40) overallStanding = 'Fail';

  const summary = {
    totalMax,
    totalObtained,
    overallPercentage,
    overallStanding
  };

  if (editingStudentId) {
    // Update existing student
    const index = students.findIndex(s => s.id === editingStudentId);
    if (index !== -1) {
      students[index] = {
        ...students[index],
        fullName,
        rollNo,
        dob,
        gender,
        phone,
        email,
        department,
        semester,
        family,
        attendance,
        subjects,
        summary,
        updatedAt: new Date().toISOString()
      };
      showToast(`Record for ${fullName} updated successfully!`, 'success');
    }
  } else {
    // Add new student
    const newStudent = {
      id: 'stud-' + Date.now(),
      fullName,
      rollNo,
      dob,
      gender,
      phone,
      email,
      department,
      semester,
      family,
      attendance,
      subjects,
      summary,
      createdAt: new Date().toISOString()
    };
    students.unshift(newStudent);
    showToast(`Student ${fullName} registered successfully!`, 'success');
  }

  saveToLocalStorage();
  resetForm();
  renderStudentRecords();
}

function validateForm() {
  let isValid = true;
  let firstInvalidTab = null;

  // Validate Basic Fields
  const basicRequired = ['fullName', 'rollNo', 'dob', 'gender', 'phone', 'email', 'department', 'semester'];
  basicRequired.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      markInvalid(el);
      isValid = false;
      if (!firstInvalidTab) firstInvalidTab = 'tab-basic';
    } else {
      markValid(el);
    }
  });

  // Validate Family Required
  const familyRequired = ['fatherName', 'motherName', 'guardianPhone', 'homeAddress'];
  familyRequired.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      markInvalid(el);
      isValid = false;
      if (!firstInvalidTab) firstInvalidTab = 'tab-family';
    } else {
      markValid(el);
    }
  });

  // Validate Attendance Percentage
  const attendanceVal = parseFloat(attendancePercentageInput.value);
  if (isNaN(attendanceVal) || attendanceVal < 0 || attendanceVal > 100) {
    markInvalid(attendancePercentageInput);
    isValid = false;
    if (!firstInvalidTab) firstInvalidTab = 'tab-academics';
  } else {
    markValid(attendancePercentageInput);
  }

  if (!isValid && firstInvalidTab) {
    switchTab(firstInvalidTab);
    showToast('Please fill in all required fields accurately.', 'danger');
  }

  return isValid;
}

function markInvalid(el) {
  el.classList.add('is-invalid');
  const parent = el.closest('.form-group');
  if (parent) parent.classList.add('has-error');
}

function markValid(el) {
  el.classList.remove('is-invalid');
  const parent = el.closest('.form-group');
  if (parent) parent.classList.remove('has-error');
}

function resetForm() {
  studentForm.reset();
  editingStudentId = null;
  formTitle.innerHTML = '<span class="step-num">➕</span> Add New Student Record';
  editIndicator.classList.add('hidden');
  cancelEditBtn.classList.add('hidden');
  saveStudentBtn.innerHTML = '💾 Save Student Record';
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

  populateInitialSubjectRows();
  updateAttendanceBadge(0);
  switchTab('tab-basic');
}

// ==========================================
// Rendering Student Directory
// ==========================================
function filterAndRenderStudents() {
  const query = searchInput.value.toLowerCase().trim();
  const dept = departmentFilter.value;

  const filtered = students.filter(student => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(query) ||
      student.rollNo.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query);

    const matchesDept = !dept || student.department === dept;

    return matchesSearch && matchesDept;
  });

  renderStudentCards(filtered);
}

function renderStudentRecords() {
  filterAndRenderStudents();
}

function renderStudentCards(list) {
  totalStudentsCount.textContent = list.length;

  if (list.length === 0) {
    emptyState.classList.remove('hidden');
    studentCardsGrid.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  studentCardsGrid.classList.remove('hidden');
  studentCardsGrid.innerHTML = '';

  list.forEach(student => {
    const card = document.createElement('div');
    card.className = 'student-card';

    const attendanceColor = student.attendance.percentage >= 75
      ? 'status-good'
      : student.attendance.percentage >= 60
        ? 'status-warning'
        : 'status-danger';

    const initials = student.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    card.innerHTML = `
      <div class="student-card-top">
        <div class="student-avatar">${initials}</div>
        <div class="student-badges">
          <span class="status-pill ${attendanceColor}">${student.attendance.percentage}% Attn</span>
          <span class="badge badge-warning">${escapeHtml(student.semester)}</span>
        </div>
      </div>

      <h4>${escapeHtml(student.fullName)}</h4>
      <div><span class="student-roll">${escapeHtml(student.rollNo)}</span></div>

      <div class="student-meta">
        <div class="student-meta-item">
          <span>🏛️</span>
          <span>${escapeHtml(student.department)}</span>
        </div>
        <div class="student-meta-item">
          <span>📧</span>
          <span>${escapeHtml(student.email)}</span>
        </div>
        <div class="student-meta-item">
          <span>👨‍👩‍👧</span>
          <span>Parents: ${escapeHtml(student.family.fatherName)} & ${escapeHtml(student.family.motherName)}</span>
        </div>
      </div>

      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-label">Semester Marks</span>
          <span class="stat-val">${student.summary ? student.summary.totalObtained : 0} / ${student.summary ? student.summary.totalMax : 0}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Score %</span>
          <span class="stat-val">${student.summary ? student.summary.overallPercentage : 0}%</span>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn btn-sm btn-outline view-card-btn" data-id="${student.id}">
          👁️ View Details
        </button>
        <button class="btn btn-sm btn-secondary edit-card-btn" data-id="${student.id}">
          ✏️ Edit
        </button>
        <button class="btn btn-sm btn-danger-outline delete-card-btn" data-id="${student.id}" title="Delete">
          🗑️
        </button>
      </div>
    `;

    // Hook card action events
    card.querySelector('.view-card-btn').addEventListener('click', () => openStudentModal(student.id));
    card.querySelector('.edit-card-btn').addEventListener('click', () => startEditingStudent(student.id));
    card.querySelector('.delete-card-btn').addEventListener('click', () => deleteStudent(student.id));

    studentCardsGrid.appendChild(card);
  });
}

// ==========================================
// Edit, Delete, View Modal
// ==========================================
function startEditingStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  editingStudentId = id;
  formTitle.innerHTML = `<span class="step-num">✏️</span> Edit Record: ${escapeHtml(student.fullName)}`;
  editIndicator.classList.remove('hidden');
  cancelEditBtn.classList.remove('hidden');
  saveStudentBtn.innerHTML = '💾 Update Student Record';

  // Populate basic
  document.getElementById('fullName').value = student.fullName;
  document.getElementById('rollNo').value = student.rollNo;
  document.getElementById('dob').value = student.dob;
  document.getElementById('gender').value = student.gender;
  document.getElementById('phone').value = student.phone;
  document.getElementById('email').value = student.email;
  document.getElementById('department').value = student.department;
  document.getElementById('semester').value = student.semester;

  // Populate family
  document.getElementById('fatherName').value = student.family.fatherName || '';
  document.getElementById('fatherContact').value = student.family.fatherContact || '';
  document.getElementById('fatherOccupation').value = student.family.fatherOccupation || '';
  document.getElementById('motherName').value = student.family.motherName || '';
  document.getElementById('motherContact').value = student.family.motherContact || '';
  document.getElementById('motherOccupation').value = student.family.motherOccupation || '';
  document.getElementById('guardianName').value = student.family.guardianName || '';
  document.getElementById('guardianPhone').value = student.family.guardianPhone || '';
  document.getElementById('homeAddress').value = student.family.homeAddress || '';

  // Populate attendance
  totalClassesInput.value = student.attendance.totalClasses || '';
  attendedClassesInput.value = student.attendance.attendedClasses || '';
  attendancePercentageInput.value = student.attendance.percentage;
  updateAttendanceBadge(student.attendance.percentage);

  // Populate subjects
  if (student.subjects && student.subjects.length > 0) {
    populateInitialSubjectRows(student.subjects);
  } else {
    populateInitialSubjectRows();
  }

  // Switch to first tab and scroll to form smoothly
  switchTab('tab-basic');
  studentForm.scrollIntoView({ behavior: 'smooth' });
}

function deleteStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  if (confirm(`Are you sure you want to delete the record of ${student.fullName} (${student.rollNo})?`)) {
    students = students.filter(s => s.id !== id);
    saveToLocalStorage();
    if (editingStudentId === id) resetForm();
    renderStudentRecords();
    showToast(`Record for ${student.fullName} deleted`, 'warning');
  }
}

function openStudentModal(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  activeModalStudentId = id;
  modalStudentName.textContent = student.fullName;
  modalStudentRoll.textContent = `${student.rollNo} • ${student.department} • ${student.semester}`;

  const attendanceStatus = student.attendance.percentage >= 75
    ? '<span class="status-pill status-good">Good Standing (Eligible for Exams)</span>'
    : '<span class="status-pill status-danger">Low Attendance Alert (<75%)</span>';

  // Construct Subject table rows
  let subjectsHtml = '';
  if (student.subjects && student.subjects.length > 0) {
    subjectsHtml = student.subjects.map((sub, index) => {
      const { grade, className } = computeGrade((sub.marksObtained / sub.maxMarks) * 100);
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${index + 1}. ${escapeHtml(sub.name)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${sub.maxMarks}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: 700;">${sub.marksObtained}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;"><span class="status-pill ${className}">${grade}</span></td>
        </tr>
      `;
    }).join('');
  }

  modalContent.innerHTML = `
    <!-- 1. Personal & Contact -->
    <div class="modal-section">
      <h4>👤 Student Information</h4>
      <div class="modal-details-grid">
        <div class="detail-row">
          <span class="detail-label">Full Name</span>
          <span class="detail-value">${escapeHtml(student.fullName)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Roll / Reg Number</span>
          <span class="detail-value">${escapeHtml(student.rollNo)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date of Birth</span>
          <span class="detail-value">${escapeHtml(student.dob)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Gender</span>
          <span class="detail-value">${escapeHtml(student.gender)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email Address</span>
          <span class="detail-value">${escapeHtml(student.email)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Contact Phone</span>
          <span class="detail-value">${escapeHtml(student.phone)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Department</span>
          <span class="detail-value">${escapeHtml(student.department)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Current Semester</span>
          <span class="detail-value">${escapeHtml(student.semester)}</span>
        </div>
      </div>
    </div>

    <!-- 2. Attendance Status -->
    <div class="modal-section">
      <h4>📅 Attendance Record</h4>
      <div class="modal-details-grid">
        <div class="detail-row">
          <span class="detail-label">Classes Attended</span>
          <span class="detail-value">${student.attendance.attendedClasses || 0} / ${student.attendance.totalClasses || 0}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Attendance Percentage</span>
          <span class="detail-value" style="font-size: 1.15rem; color: #4f46e5; font-weight: 800;">
            ${student.attendance.percentage}%
          </span>
        </div>
        <div class="detail-row" style="grid-column: span 2;">
          <span class="detail-label">Status</span>
          <span class="detail-value">${attendanceStatus}</span>
        </div>
      </div>
    </div>

    <!-- 3. Family & Emergency Contacts -->
    <div class="modal-section">
      <h4>👨‍👩‍👧 Family & Guardian Details</h4>
      <div class="modal-details-grid">
        <div class="detail-row">
          <span class="detail-label">Father's Name & Occupation</span>
          <span class="detail-value">${escapeHtml(student.family.fatherName)} ${student.family.fatherOccupation ? '(' + escapeHtml(student.family.fatherOccupation) + ')' : ''}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Father's Contact</span>
          <span class="detail-value">${escapeHtml(student.family.fatherContact) || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Mother's Name & Occupation</span>
          <span class="detail-value">${escapeHtml(student.family.motherName)} ${student.family.motherOccupation ? '(' + escapeHtml(student.family.motherOccupation) + ')' : ''}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Mother's Contact</span>
          <span class="detail-value">${escapeHtml(student.family.motherContact) || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Emergency Guardian</span>
          <span class="detail-value">${escapeHtml(student.family.guardianName || student.family.fatherName)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Emergency Phone</span>
          <span class="detail-value">${escapeHtml(student.family.guardianPhone)}</span>
        </div>
        <div class="detail-row" style="grid-column: span 2;">
          <span class="detail-label">Home Address</span>
          <span class="detail-value">${escapeHtml(student.family.homeAddress)}</span>
        </div>
      </div>
    </div>

    <!-- 4. Semester Marks & Performance -->
    <div class="modal-section">
      <h4>📊 Semester Academic Marks Report</h4>
      <div style="overflow-x: auto; margin-bottom: 12px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
          <thead>
            <tr style="background: #f1f5f9; text-align: left;">
              <th style="padding: 8px;">Subject</th>
              <th style="padding: 8px; text-align: center;">Max Marks</th>
              <th style="padding: 8px; text-align: center;">Marks Scored</th>
              <th style="padding: 8px; text-align: center;">Grade</th>
            </tr>
          </thead>
          <tbody>
            ${subjectsHtml}
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #eef2ff; padding: 12px 16px; border-radius: 8px; border: 1px solid #c7d2fe;">
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #4f46e5; font-weight: 700; display: block;">Total Marks</span>
          <strong style="font-size: 1.1rem; color: #1e293b;">${student.summary.totalObtained} / ${student.summary.totalMax}</strong>
        </div>
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #4f46e5; font-weight: 700; display: block;">Semester Average</span>
          <strong style="font-size: 1.1rem; color: #1e293b;">${student.summary.overallPercentage}%</strong>
        </div>
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #4f46e5; font-weight: 700; display: block;">Academic Standing</span>
          <strong style="font-size: 1.1rem; color: #059669;">${escapeHtml(student.summary.overallStanding)}</strong>
        </div>
      </div>
    </div>
  `;

  studentModal.classList.remove('hidden');
}

function closeModal() {
  studentModal.classList.add('hidden');
  activeModalStudentId = null;
}

// ==========================================
// Quick Tools: Demo Data, CSV Export, Clear
// ==========================================
function handleLoadSampleData() {
  SAMPLE_STUDENTS.forEach(sample => {
    const exists = students.some(s => s.rollNo === sample.rollNo);
    if (!exists) {
      students.push({ ...sample, id: 'stud-' + Math.random().toString(36).substring(2, 9) });
    }
  });

  saveToLocalStorage();
  renderStudentRecords();
  showToast('Sample records loaded successfully!', 'success');
}

function exportToCsv() {
  if (students.length === 0) {
    showToast('No student records available to export', 'warning');
    return;
  }

  const headers = [
    'Student ID',
    'Full Name',
    'Roll Number',
    'DOB',
    'Gender',
    'Email',
    'Phone',
    'Department',
    'Semester',
    'Attendance %',
    'Total Scored',
    'Max Marks',
    'Semester %',
    'Standing',
    'Father Name',
    'Father Contact',
    'Mother Name',
    'Emergency Phone',
    'Address'
  ];

  const rows = students.map(s => [
    `"${s.id}"`,
    `"${s.fullName}"`,
    `"${s.rollNo}"`,
    `"${s.dob}"`,
    `"${s.gender}"`,
    `"${s.email}"`,
    `"${s.phone}"`,
    `"${s.department}"`,
    `"${s.semester}"`,
    `"${s.attendance.percentage}"`,
    `"${s.summary.totalObtained}"`,
    `"${s.summary.totalMax}"`,
    `"${s.summary.overallPercentage}"`,
    `"${s.summary.overallStanding}"`,
    `"${s.family.fatherName}"`,
    `"${s.family.fatherContact}"`,
    `"${s.family.motherName}"`,
    `"${s.family.guardianPhone}"`,
    `"${(s.family.homeAddress || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `student_records_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Student records exported to CSV!', 'success');
}

function handleClearAll() {
  if (students.length === 0) {
    showToast('No records to clear', 'warning');
    return;
  }

  if (confirm('Are you sure you want to clear ALL student records? This action cannot be undone.')) {
    students = [];
    saveToLocalStorage();
    resetForm();
    renderStudentRecords();
    showToast('All student records cleared', 'warning');
  }
}

// ==========================================
// Toast Notification & Helper Functions
// ==========================================
let toastTimer = null;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;

  if (type === 'danger') toast.style.backgroundColor = '#dc2626';
  else if (type === 'warning') toast.style.backgroundColor = '#d97706';
  else toast.style.backgroundColor = '#0f172a';

  toast.classList.remove('hidden');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
