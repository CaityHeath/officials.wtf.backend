'use strict'

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.get('/findreps', getReps);

function getReps(request, response){
  let address = request.query.data;
  searchGoogleCivic(address)
  .then(results => {
    response.send(results)
  })
}

function filterResults(data){
  let reps = []
  data.offices.forEach((office, idx) => {
    reps.push(new Reps(office))
  });
  
  reps.forEach(rep => {
      rep.indices.forEach(index => {
        if (rep.level === 'country'){
        var representative = new Federal(rep)
        } else if (rep.level === 'administrativeArea1'){
        var representative = new State(rep)
        } else {
        var representative = new County(rep)
        }
        representative.name = data.officials[index].name;
        representative.address = data.officials[index].address;
        representative.party = data.officials[index].phones[0] || '';
        representative.photoUrl = data.officials[index].photoUrl;
        representative.social = data.officials[index].channels || '';
      })
    })
    return {
      fed: feds,
      state: states,
      county: counties
    }
  }


function Reps(data){
  this.name = data.name;
  this.indices = data.officialIndices;
  this.level = data.levels[0];
}

let feds = [];
function Federal(data){
  this.title = data.name
  feds.push(this);
}

let states = [];
function State(data){
  this.title = data.name;
  states.push(this)
}

let counties = []
function County(data){
  this.title = data.name;
  counties.push(this)
}

function searchGoogleCivic(address) {
let url = `https://www.googleapis.com/civicinfo/v2/representatives?key=${process.env.CIVIC}&address=${address}`
return superagent.get(url)
.then(result =>{
  let seats = filterResults(result.body)
  return seats
})
.catch(err => {
  console.log(err)
})
}

app.listen(PORT, () => console.log(`App is up on ${PORT}`));
