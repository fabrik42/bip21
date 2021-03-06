// https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki
// bitcoin:<address>[?amount=<amount>][?label=<label>][?message=<message>]

var qs = require('qs')

function decode (uri, urnScheme) {
  var scheme = urnScheme || 'bitcoin'
  var qregex = new RegExp(scheme + ':/?/?([^?]+)(\\?([^]+))?').exec(uri)
  if (!qregex) throw new Error('Invalid BIP21 URI: ' + uri)

  var address = qregex[1]
  var query = qregex[3]
  var options = qs.parse(query)

  if (options.amount) {
    options.amount = Number(options.amount)
    if (!isFinite(options.amount)) throw new Error('Invalid amount')
    if (options.amount < 0) throw new Error('Invalid amount')
  }

  return { address: address, options: options }
}

function encode (address, options, urnScheme) {
  options = options || {}
  var scheme = urnScheme || 'bitcoin'
  var query = qs.stringify(options)

  if (options.amount) {
    if (!isFinite(options.amount)) throw new TypeError('Invalid amount')
    if (options.amount < 0) throw new TypeError('Invalid amount')
  }

  return scheme + ':' + address + (query ? '?' : '') + query
}

module.exports = {
  decode: decode,
  encode: encode
}
