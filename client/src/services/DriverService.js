import http from '../http';

class DriverService {
  create(data) {
    return http.post('/drivers', data);
  }

  getAll() {
    return http.get('/drivers');
  }

  findByName(name) {
    return http.get(`/drivers?name=${name}`);
  }

  findByCpf(cpf) {
    return http.get(`/drivers?cpf=${cpf}`);
  }

  getBusDrivers(bus_id) {
    return http.get(`/drivers/by-bus/${bus_id}`);
  }
}

export default new DriverService();
