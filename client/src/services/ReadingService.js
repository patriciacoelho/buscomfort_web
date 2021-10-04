import http from '../http';

class ReadingService {
  create(data) {
    return http.post('/readings', data);
  }

  getLatest(bus_id) {
    return http.get(`/readings/${bus_id}/latest`);
  }

  getAllByBus(bus_id, params) {
    return http.get(`/readings/${bus_id}`, { params });
  }

  getWeekAmounts(bus_id) {
    return http.get(`/readings/${bus_id}/week-amounts`);
  }
}

export default new ReadingService();
