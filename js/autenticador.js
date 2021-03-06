// JavaScript Document
var confTutor;
var retorno;
var alunoNomeAno;

var alunoID = localStorage.getItem("alunoId");
var dadosUsuario = JSON.parse(localStorage.getItem("objetoUsuario"));
if(dadosUsuario){
	var usuario = dadosUsuario.perfil.perfil;
	var usuarioId = dadosUsuario.idusuario;
}else{
	alert("Deve-se logar antes");
	window.location = 'index.html';
}

var dadosUser;
var textoMsgNLida;	

switch (usuario){
	case 'Aluno':
		$.ajax({
			url: path+"AlunoVariavel/aluno/"+alunoID,
			type: "GET",
			async:false,
			crossDomain: true,
			success: function(d) {
				dadosUser = d;				
				localStorage.setItem("objetoAlunoVariavel", JSON.stringify(d));		
			}		
		});
		msgNaoVistas(usuarioId);
		dadosForum(usuarioId);		
	break;
	
	case 'Professor':
		verificaUsuarioTurtor(dadosUsuario.professor.idprofessorFuncionario);		
		msgNaoVistas(usuarioId);
		dadosForum(usuarioId);		
		localStorage.setItem("tutoriaProfessor",JSON.stringify(getTutoria(dadosUsuario.professor.idprofessorFuncionario)));
		setTimeout(function(){
			$(".mensagens").addClass('mn_professor');
			$(".forum").addClass('mn_professor');
		},1000);
	break;
	
	case 'Coordenacao':
		verificaUsuarioTurtor(dadosUsuario.professor.idprofessorFuncionario);
		msgNaoVistas(usuarioId);
		dadosForum(usuarioId);		
	break;

}

//Verfica se o usuário é tutor
function verificaUsuarioTurtor(idProfessor){
	if (verificaTutor(idProfessor) == 1) {
		confTutor = true;
	}else {
		confTutor = false;
	}	
	
	return confTutor;
}

//Lista as mensagens não vistas do usuário e mostra no menu
function msgNaoVistas(usuarioId){
	var textoMsgNLida;
	$.ajax({
		url: path+"Mensagens/ProprietarioCount/"+usuarioId,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(d) {
			if (d > 0){
				localStorage.setItem("textoMsgNLida", d);
			}else 
				localStorage.setItem("textoMsgNLida", '');
		}		
	});
}

//Lista oficina do professor logado
function oficinaProfessor(idProfessor){
	var objetoOficina;
	$.ajax({
		url: path+"OficinaProfessor/listarProfessor/"+idProfessor,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(d) {
			objetoOficina = d;
		}		
	});
	return objetoOficina;
}

//Lista as questões criadas nos ultimos 3 meses,
//lista respostas das quetões que o usuário criou e que não fora vistas.
//e mostra no menu
function dadosForum(usuarioId){	
	var totalForum = 0;
	$.ajax({
		url: path+"ForumQuestao/RespostasNVistas/"+usuarioId,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(t1) {
			totalForum+=t1;
		}		
	});
	
	$.ajax({
		url: path+"ForumQuestao/RangeDataCount/",
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(t2) {
			totalForum+=t2;
		}		
	});
	
	if (totalForum == 0){
		textoForum = '';
	}else{
		textoForum = totalForum;
	}
	localStorage.setItem("totalForum", totalForum);	
}
 
/*Function que abrevia nome do usuário*/
function abreviaNome(nome){
	nome = nome.split(" ");
	var nomeFinal = new Array();
	var nomeAbreviado = "";
	nome = nome.filter(function(item, index, array){
		if(item != "de" && item != "De"){
			return item;
		}		
	});	
	for(var i=0;i<nome.length;i++){
		if(i<1){
			nomeFinal[i] = nome[i];
		}else if(i==nome.length-1){
			nomeFinal[i] = nome[i];
		}else{
			nomeFinal[i] = nome[i].substring(0, 1)+"."; 
		}
		nomeAbreviado += nomeFinal[i]+" ";
	}	
	return nomeAbreviado;
}

function getTutoria(professorId){
	var ano = new Date();
	var retorno;
	if(professorId){
		$.ajax({
			url: path + 'Tutoria/Professor/'+professorId+'/'+ano.getFullYear(),
			async: false,
			crossDomain: true,
			type: "GET",
			success: function(d) {
				retorno = d;
			}
		});
	}else{
		retorno = "Não é tutor!";
	}    
	return retorno;
}

function buscaUsuarios(idPerfil){
	var retorno;
	$.ajax({
		url: path+'Usuario/ListarPerfil/'+idPerfil,
		type: 'Get',
		async: false,
		success: function (data) {
			retorno = data;
		}
	});

	return retorno;
}