import http from '../http';

class ReadingService {
  create(data) {
    return http.post('/readings', data);
  }

  getLatest(bus_id) {
    return http.get(`/readings/${bus_id}/latest`);
  }

  getAllByBus(bus_id, query) { // alternativamente pode dividir em três services por interval
    return http.get(`/readings/${bus_id}?interval=${query.interval}, route=${query.route}, driver=${query.driver}`);
  }
}

export default new ReadingService();
