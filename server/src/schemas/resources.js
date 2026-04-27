const toProject = (project) => ({
  id: project.id,
  name: project.name,
  description: project.description,
});

const toEvent = (event) => ({
  id: event.id,
  projectId: event.project_id,
  name: event.name,
  date: event.date,
  location: event.location,
  qrCode: event.qr_code,
});

const toTask = (task) => ({
  id: task.id,
  volunteerId: task.volunteer_id,
  eventId: task.event_id,
  description: task.description,
  status: task.status,
});

const toAttendance = (attendance) => ({
  id: attendance.id,
  volunteerId: attendance.volunteer_id,
  eventId: attendance.event_id,
  scanDate: attendance.scan_date,
  scanTime: attendance.scan_time,
});

const toPerson = (person) => ({
  id: person.id,
  firstName: person.first_name,
  lastName: person.last_name,
  email: person.email,
  phone: person.phone,
  password: person.password,
  isCoordinator: person.is_coordinator,
  isAdministrator: person.is_administrator,
});

const resourceSchemas = {
  project: {
    id: 'number',
    name: 'string',
    description: 'string',
  },
  event: {
    id: 'number',
    projectId: 'number',
    name: 'string',
    date: 'string',
    location: 'string',
    qrCode: 'string',
  },
  task: {
    id: 'number',
    volunteerId: 'number',
    eventId: 'number',
    description: 'string',
    status: 'string',
  },
  attendance: {
    id: 'number',
    volunteerId: 'number',
    eventId: 'number',
    scanDate: 'string',
    scanTime: 'string',
  },
  person: {
    id: 'number',
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    phone: 'string',
    password: 'string',
    isCoordinator: 'boolean',
    isAdministrator: 'boolean',
  },
};

module.exports = {
  toProject,
  toEvent,
  toTask,
  toAttendance,
  toPerson,
  resourceSchemas,
};
