import { expect } from 'chai'
import hotkey from '../src/index'

// Emulate global dom
import 'jsdom-global/register'

describe('#hotkey', (): void => {
  const aCallback = (): string => {
    return 'a pressed'
  }
  it('Binds Hotkey without error', (): void => {
    let result = false
    try {
      hotkey.bind('a', aCallback)
      result = true
    } catch (error) {
      result = false
    }
    expect(result).to.equal(true)
  })

  // Test Modifyer key
  const controllAcallback = (): string => {
    return 'Controll + a pressed'
  }
  it('Binds Controll + Hotkey without error', (): void => {
    let result = false
    try {
      hotkey.bind('controll+a', controllAcallback)
      result = true
    } catch (error) {
      result = false
    }
    expect(result).to.equal(true)
  })
})
