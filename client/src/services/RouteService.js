import http from '../http';

class RouteService {
  create(data) {
    return http.post('/routes', data);
  }

  getAll() {
    return http.get('/routes');
  }

  findByName(name) {
    return http.get(`/routes?name=${name}`);
  }

  findByPrefix(prefix) {
    return http.get(`/routes?prefix=${prefix}`);
  }

  getBusRoutes(bus_id) {
    return http.get(`/routes/by-bus/${bus_id}`);
  }
}

export default new RouteService();
