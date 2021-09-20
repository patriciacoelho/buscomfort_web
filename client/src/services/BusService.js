import http from '../http';

class BusService {
  getAll() {
    return http.get('/buses/list');
  }

  getAllGroupedByStatus() {
    return http.get('/buses/grouped-by-status');
  }

  get(id) {
    return http.get(`/buses/${id}`);
  }

  getWithCurrentSchedule(id) {
    return http.get(`/buses/${id}/current-schedule`);
  }

  create(data) {
    return http.post('/buses', data);
  }

  update(id, data) {
    return http.put(`/buses/${id}`, data);
  }
}

export default new BusService();
