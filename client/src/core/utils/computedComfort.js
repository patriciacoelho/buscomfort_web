export default ({thermalComfort, noiseComfort, rideComfort}) => { // temporariamente média simples
  return Math.round((parseFloat(thermalComfort) + parseFloat(noiseComfort) + parseFloat(rideComfort)) / 3);
}
