document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = 'http://localhost:3000/pups'
  const dogBar = document.getElementById('dog-bar')
  const dogInfo = document.getElementById('dog-info')
  const goodDogFilterButton = document.getElementById('good-dog-filter')
  let filterGoodDogs = false

  function fetchPups() {
    fetch(baseUrl)
      .then(response => response.json())
      .then(pups => {
        displayPups(pups)
      })
  }

  function displayPups(pups) {
    dogBar.innerHTML = ''
    const filteredPups = filterGoodDogs ? pups.filter(pup => pup.isGoodDog) : pups
    filteredPups.forEach(pup => {
      const span = document.createElement('span')
      span.textContent = pup.name
      span.addEventListener('click', () => showPupInfo(pup))
      dogBar.appendChild(span)
    })
  }

  function showPupInfo(pup) {
    dogInfo.innerHTML = `
      <img src="${pup.image}" />
      <h2>${pup.name}</h2>
      <button>${pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
    `
    const button = dogInfo.querySelector('button')
    button.addEventListener('click', () => toggleGoodness(pup, button))
  }

  function toggleGoodness(pup, button) {
    const newGoodness = !pup.isGoodDog
    fetch(`${baseUrl}/${pup.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isGoodDog: newGoodness }),
    })
      .then(response => response.json())
      .then(updatedPup => {
        pup.isGoodDog = updatedPup.isGoodDog
        button.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!'
      })
  }

  goodDogFilterButton.addEventListener('click', () => {
    filterGoodDogs = !filterGoodDogs
    goodDogFilterButton.textContent = `Filter good dogs: ${filterGoodDogs ? 'ON' : 'OFF'}`
    fetchPups()
  })

  fetchPups()
})