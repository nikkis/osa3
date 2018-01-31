const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Person = require('./models/person')

const cors = require('cors')

app.use(cors())


app.use(bodyParser.json())
morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :response-time :body'))

app.use(express.static('build'))


app.get('/info', (request, response) => {
  Person
    .find({})
    .then(result => {
      const text = `puhelinluettelossa ${result.length} henkilön tiedot<br/>${new Date()}`
      response.send(text)
    })

})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
})


app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if ( name === undefined || number === undefined ) {
    return response.status(404).json({
      error: 'name of number missing'
    })
  }

  Person
    .find( { name } )
    .then( result => {
      if ( result.length>0) {
        return response.status(400).json({
          error: 'name must be unique'
        })
      }

      const person = new Person({
        name, number
      })

      person
        .save()
        .then(savedPerosn => {
          response.json(Person.format(savedPerosn))
        })
    })


})

app.put('/api/persons/:id', (request, response) => {
  const { name, number } = request.body

  Person
    .findByIdAndUpdate(request.params.id, { name, number }, { new: true })
    .then(result => {
      response.json(result)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })

})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
