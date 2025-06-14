/* ~~/src/stores/contracts.js */

export const useContracts = defineStore('contracts', () => {
  let loadContract = async name => {
    let url = `contracts/${name}.py`
    return await fetch(url).then(response => response.text())
  }

  return { loadContract }
})

export default useContracts
