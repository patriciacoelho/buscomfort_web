export default {
  validate(value) {
    const valid = !!value
      .trim()
      .match(
        /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+([ ]+[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+)+$/g
      )

    if (valid) {
      return true
    }

    return 'Insira um nome válido'
  },
}
