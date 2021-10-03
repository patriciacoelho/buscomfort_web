import http from '../http';

class ReadingService {
  create(data) {
    return http.post('/readings', data);
  }

  getLatest(bus_id) {
    return http.get(`/readings/${bus_id}/latest`);
  }

  getAllByBus(bus_id, query) { // alternativamente pode dividir em três services por interval
    return http.get(`/readings/${bus_id}?${query.interval ? `interval=${query.interval}, ` : ''}${query.route ? `route=${query.route}, ` : ''}${query.driver ? `driver=${query.driver}` : ''}`);
  }
}

export default new ReadingService();
