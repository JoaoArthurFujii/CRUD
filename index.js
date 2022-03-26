const getLocalStorage = () => JSON.parse(localStorage.getItem('dbMaterial')) ?? []
const setLocalStorage = (dbMaterial) => localStorage.setItem('dbMaterial',JSON.stringify(dbMaterial))
//CRUD
const createMaterial = (material) => {
    const dbMaterial = getLocalStorage()
    dbMaterial.push(material)
    setLocalStorage(dbMaterial) 
}

const readMaterial = () => getLocalStorage()

const updateMaterial = (index, material) => {
    const dbMaterial = readMaterial()
    dbMaterial[index] = material
    setLocalStorage(dbMaterial)
}

const deleteMaterial = () => {
    const response = confirm('Deseja excluir o Material?')
    if (response) {        
        const index = document.getElementById('enderecoImg').dataset.index
        const dbMaterial = readMaterial()
        dbMaterial.splice(index,1)
        setLocalStorage(dbMaterial)
        document.getElementById('deleteMaterial').toggleAttribute('hidden')
        let myModalEl = document.querySelector('#exampleModal')
        let modal = bootstrap.Modal.getOrCreateInstance(myModalEl)
        modal.hide()
        myModalEl = document.querySelector('#confirmaModal')
        modal = bootstrap.Modal.getOrCreateInstance(myModalEl)
        modal.show()
        updateCard()
    }
}
//html
const limpaCampos = () => {
    document.getElementById('enderecoImg').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('deleteMaterial').removeAttribute('hidden')
    document.getElementById('deleteMaterial').toggleAttribute('hidden')
}

const validateField = () => {
    return document.getElementById('form').reportValidity()
}

const changeModal = () => {
    let myModalEl = document.querySelector('#exampleModal')
    let modal = bootstrap.Modal.getOrCreateInstance(myModalEl)
    modal.hide()
    myModalEl = document.querySelector('#confirmaModal')
    modal = bootstrap.Modal.getOrCreateInstance(myModalEl)
    modal.show()
}

const saveMaterial = () => {
    if (validateField()) {
        const activeMaterial = document.querySelector('input[name="activeRadio"]:checked').value
        let dateInactive = ''
        if(activeMaterial == 'false'){
            dateInactive = new Date()
        }
        const material = {
            imagem: document.getElementById('enderecoImg').value,
            descricao: document.getElementById('descricao').value,
            ativo: activeMaterial,
            marca: document.getElementById('selectMarca').value,
            datainativo: dateInactive
        }
        const index = document.getElementById('enderecoImg').dataset.index
        if(index == 'new'){
            createMaterial(material);
            changeModal()
            limpaCampos()
            updateCard()      
        } else {
            updateMaterial(index,material)
            limpaCampos()
            changeModal()
            document.getElementById('enderecoImg').setAttribute('data-index','new')
            updateCard()
        }
    }
}

const createCard = (material,index) => {
    const newCard = document.createElement('div')
    newCard.classList.add('col')
    newCard.setAttribute('id','cardCol')
    newCard.innerHTML = `
        <div class="card shadow-sm h-100">
            <img class="card-img-top"
                src="${material.imagem}" />
            <div class="card-body" >
                <p class="card-text text-black fs-4" id="marca">${material.marca}</p>
                <p class="card-text text-muted " style="display: block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${material.descricao}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-dark" data-bs-toggle="modal"
                            data-bs-target="#infoModal" id="verMais-${index}">
                            Ver+</button>
                        <button type="button" class="btn btn-sm btn-outline-dark" id="edit-${index}" data-bs-toggle="modal"
                            data-bs-target="#exampleModal">Editar</button>
                    </div>
                </div>
            </div>
        </div>
    `
    document.querySelector('#cardRoot').appendChild(newCard)
}

const clearCard = () => {
    const cards = document.querySelectorAll('#cardCol')
    cards.forEach(card => card.remove())
}

const updateCard = () => {
    const dbMaterial = readMaterial()
    clearCard()
    dbMaterial.forEach(createCard)
}

const fillFields = (material) => {
    document.getElementById('enderecoImg').value = material.imagem
    document.getElementById('descricao').value = material.descricao    
    if(material.ativo == 'true'){
        document.getElementById('inactive').removeAttribute('checked')
        document.getElementById('active').removeAttribute('checked')
        document.getElementById('active').toggleAttribute('checked')
    } else {
        document.getElementById('inactive').removeAttribute('checked')
        document.getElementById('active').removeAttribute('checked')
        document.getElementById('inactive').toggleAttribute('checked')
    }
    let selectItems = document.querySelectorAll('#selectItem')
        .forEach(item => {
            item.removeAttribute('selected')
            if(item.value == material.marca){
                item.toggleAttribute('selected')
            }
        })
}

const editMaterial = (index) => {
    const material = readMaterial()[index]
    fillFields(material)
}

const verMais = (index) => {
    const material = readMaterial()[index]
    document.getElementById('imgInfo').setAttribute('src',material.imagem)
    document.getElementById('marcaInfo').textContent ='Marca: '+material.marca
    document.getElementById('descInfo').textContent = 'Descrição: '+material.descricao
    const ativoInfo = material.ativo == 'true' ? 'Ativo' : 'Inativo'
    document.getElementById('ativoInfo').textContent = ativoInfo
}

const getEditMaterial = (event) => {
    if(event.target.type == 'button'){
        const [action,index] = event.target.id.split('-')
        if(action == 'edit'){
            document.getElementById('enderecoImg').setAttribute('data-index',index)
            document.getElementById('deleteMaterial').removeAttribute('hidden')
            editMaterial(index)
        }
        if(action == 'verMais'){
            verMais(index)
        }
    }
}

const formatAddModal = () => {
    limpaCampos()
    document.getElementById('inactive').removeAttribute('checked')
    document.getElementById('active').removeAttribute('checked')
    document.getElementById('active').toggleAttribute('checked')
    document.getElementById('enderecoImg').setAttribute('data-index','new')
}

const marcas = {
    Portobello: 'Portobello', 
    Decortiles: 'Decortiles',
    Portinari: 'Portinari', 
    Delta: 'Delta',  
    Ceusa: 'Ceusa'
}

const loadSelect = () => {
    var selectValues = document.createElement('option')
    selectValues.textContent = 'Choose'
    selectValues.setAttribute('value',"")
    document.getElementById('selectMarca').appendChild(selectValues)
    for (let marca in marcas){
        selectValues = document.createElement('option')
        selectValues.setAttribute('value',marca)
        selectValues.setAttribute('id','selectItem')
        selectValues.textContent = marca
        document.getElementById('selectMarca').appendChild(selectValues)
    }
}

loadSelect()

document.getElementById('salvar').addEventListener('click',saveMaterial)
document.getElementById('cardRoot').addEventListener('click',getEditMaterial)
document.getElementById('deleteMaterial').addEventListener('click',deleteMaterial)
document.getElementById('addMaterial').addEventListener('click',formatAddModal)
document.getElementById('filter').addEventListener('input',()=>{
    const inputValue = event.target.value.trim().toLowerCase()
    let marcas = document.querySelectorAll('#marca')
    Array.from(marcas)
    .filter(marca => !marca.textContent.toLowerCase().includes(inputValue))
    .forEach(marca => {
        marca.parentElement.parentElement.parentElement.classList.add('visually-hidden')
    })

    Array.from(marcas)
    .filter(marca => marca.textContent.includes(inputValue))
    .forEach(marca => {
        marca.parentElement.parentElement.parentElement.classList.remove('visually-hidden')
    })
})

updateCard()
