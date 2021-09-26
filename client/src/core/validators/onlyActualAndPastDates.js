export default {
  validate(value) {
    const dateString = value

    if (value.length !== 10) {
      return 'Insira uma data válida'
    }

    const dateParts = dateString.split('/')

    if (dateParts.length !== 3) {
      return 'Insira uma data válida'
    }

    // month is 0-based, that's why we need dataParts[1] - 1
    const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])

    const currentDate = new Date().toJSON().slice(0, 10) + ' 11:59:00'

    const difference = Date.now(currentDate) - dateObject

    if (difference < 0) {
      return 'É necessário informar uma data anterior ou igual a data atual'
    }

    return true
  },
}
