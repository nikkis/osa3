const Person = require('./models/person')
const mongoose = require('mongoose')

if (process.argv.length<4) {
  Person
    .find({})
    .then( persons => {
      persons.forEach( person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
} else {
  const name = process.argv[2]
  const number = process.argv[3]

  const person = new Person({
    name, number
  })
  person
    .save()
    .then(response => {
      console.log(`${response.name} saved!`)
      mongoose.connection.close()
    })
}
