const ControllerId = {
  ONE: 'one',
  TWO: 'two',
}

class Application {
  static init () {
    Application.routes = {
      [ControllerId.ONE]: '',
      [ControllerId.TWO]: '',
    }

    alert('init')
  }
}

export default Application
