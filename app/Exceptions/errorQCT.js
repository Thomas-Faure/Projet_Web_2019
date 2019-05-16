const { LogicalException } = require('@adonisjs/generic-exceptions')
const message = 'The item is in an status where modifications are disallowed'
const status = 403
const code = 'E_NOT_EDITABLE'

class errorQCT extends LogicalException {
  constructor() {
    super(message, status, code)
  }
}

module.exports = errorQCT