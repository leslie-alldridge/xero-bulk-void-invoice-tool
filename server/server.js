var path = require('path')
var express = require('express')

var server = express()

server.use(express.json())
server.use(express.static(path.join(__dirname, '../public')))

module.exports = server
