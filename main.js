const KEY_BD = '@usuariosestudo'




var listaRegistros = {
     ultimosIdGerado: 0,
     usuarios:[]
 }

 var FILTRO = ''

 function gravarBD() {
      localStorage.setItem(KEY_BD , JSON.stringify(listaRegistros) )
 }


function lerBD() {
      const data = localStorage.getItem(KEY_BD, )
      if(data){
          listaRegistros = JSON.parse(data)
      } 
      desenhar()
}

function pesquisar(value){
      FILTRO = value;
    desenhar()
}

function desenhar(){
    const tbody = document.getElementById('listaRegistroBody')
    if(tbody){
        var data = listaRegistros.usuarios;
        if(FILTRO.trim()){
            FILTRO = FILTRO.replace(/á/i, 'a')
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test(usuario.nome) || expReg.test(usuario.fone)
            })
        }
        data = data
        .sort( (a, b)  => {
            return a.nome < b.nome ? -1 : 1
        })
        .map(usuario =>{
           
            return     `<tr>
                           <td>${usuario.id}</td>
                           <td>${usuario.nome}</td>
                           <td>${usuario.fone}</td>
                           <td>
                              <button onclick='visualizar("cadastro",false,${usuario.id} )'>Editar</button>
                              <button class='vermelho' onClick='pergutarSeDeleta(${usuario.id})'>Deletar</button>
                           </td>
            
                        </tr>`
         } )
         tbody.innerHTML = data.join('')
    }
}


 function insertUsuario( nome, fone){
        const id = listaRegistros.ultimosIdGerado + 1;
        listaRegistros.ultimosIdGerado = id; 
        listaRegistros.usuarios.push({
            id, nome, fone
        })
        gravarBD()
        desenhar ()
        visualizar('lista')
 }


 function editUsuarios(id, nome, fone){
           const usuario = listaRegistros.usuarios.find( usuario => usuario.id == id)
           usuario.nome = nome
           usuario.fone = fone
           gravarBD()
           desenhar()
           visualizar('lista')
 }


 function deleteUsuario(id){
         listaRegistros.usuarios = listaRegistros.usuarios.filter(usuario => {
             return usuario.id != id
         })
         gravarBD()
         desenhar ()
 }

 function pergutarSeDeleta(id) {
        if(confirm('Quer deletar o registro de id' +  id)){
            deleteUsuario(id)
          
        }
 }



function linparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('fone').value = ''
}



function visualizar(pagina , novo=false, id=null) {
       document.body.setAttribute('page', pagina)
       if(pagina === 'cadastro'){
           if(novo) linparEdicao()
           if(id){
               const usuario = listaRegistros.usuarios.find(usuario => usuario.id == id)
               if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('fone').value = usuario.fone
               }
           }
           document.getElementById('nome').focus()
       }
     
 }
function submeter(e) {
     e.preventDefault()
     const data = {
         id: document.getElementById('id').value,
         nome: document.getElementById('nome').value,
         fone: document.getElementById('fone').value,
     }
     if(data.id){
          editUsuarios(data.id, data.nome, data.fone)
     } else{
          insertUsuario( data.nome, data.fone)
     }
    
}

 window.addEventListener('load', () =>{
      lerBD()

      document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
      document.getElementById('inputpesquisa').addEventListener('keyup', e => {
          pesquisar(e.target.value)
      })
   
 })
