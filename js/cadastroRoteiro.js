// JavaScript Document
var ultimo_id;
var dataAnoEstudo = getData("AnoEstudo", null);
var dataRoteiro = getData("Roteiro", null);
var dataObjetivo = getData("Objetivo", null);
var dataAtividade = getData("Atividade", null);

$(document).ready(function(){
	
	/*Function do accordion*/
	$('a.accordion').click(function(){
		$(this).parent().find('div.secao_cadastro').slideToggle("slow");
		$(this).closest('div.secao_bloco').attr('id') ;
	});
	
	/*lista anoEstudo e cadastra roteiros*/
    HtmlContent = ""; 
    for(var b=0;b<dataAnoEstudo.length; b++)
    {
        HtmlContent += "<option value='"+dataAnoEstudo[b].idanoEstudo+"'>"+(dataAnoEstudo[b].ano)+"º</option>";
    }

    //Carrega os selects com os anos!!!
    $('.anoEstudoRoteiro').html("<option value=''></option>"+HtmlContent);
	$("#anoEObj").html("<option value=''></option>"+HtmlContent);
	$("#anoEAtv").html("<option value=''></option>"+HtmlContent);	
	
	/*Function que pega os dados do formulário de roteiro e executa function que cadastra roteiro*/
    $("#btnSalvar").click(function(){
		var anoEstudo = $("#anoEstudo").val();
		var nome = $("#nome").val();
		var descricao = "";		
		var cadastrado;	
		var HtmlContentREx = "";
		if(nome==""){
			mensagem("Campo nome é obrigatório!","OK","bt_ok","alerta");
		}else{	
			ultimo_id = criarRoteiro(anoEstudo,nome,descricao);			
			cadastrado = getData("Roteiro", ultimo_id);
			  
			HtmlContentREx +="<div class='item' id=rot_"+cadastrado.idroteiro+"><div class='titulo_roteiro'>"+cadastrado.nome+"</div> <span class='editar' onclick='editarROA(\"Roteiro\","+cadastrado.idroteiro+")'></span><span class='excluir' onclick='excluirROA(\"Roteiro\","+cadastrado.idroteiro+")'></span></div>";							
			debugger;
			var elementos = $('#roteiros_listados .item');					
			if(elementos.length>0){
				$(HtmlContentREx).insertBefore( "#roteiros_listados .item:first");
			}else{
				$("#roteiros_listados").html(HtmlContentREx);
			}
			mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
		}
		
	});	
	
	
	/*Function que pega os dados do formulário de objetivo e executa function que cadastra objetivo*/
	$("#btnSalvarObjetivo").click(function(){
		var nome = $("#nomeObj").val();;
		var numero = $("#numeroObj").val();
		var descricao = "";
		var HtmlContentOEx="";
		var roteiro = $("#roteiroObj").val();
		mensagem("Os campos nome, número e roteiro são obrigatórios!","OK","bt_ok","alerta");
		if(nome=="" || numero=="" || roteiro==""){
			mensagem("Os campos nome, número e roteiro são obrigatórios!","OK","bt_ok","alerta");
		}else{			
			ultimo_id = criarObjetivo(nome,numero,descricao,roteiro);
			cadastrado = getData("Objetivo", ultimo_id);
			HtmlContentOEx +="<div class='item' id='obj_"+cadastrado.idobjetivo+"'><div class='titulo_objetivo'>"+cadastrado.nome+"</div> <span class='editar' onclick='editarROA(\"Objetivo\","+cadastrado.idobjetivo+")'></span><span class='excluir' onclick='excluirROA(\"Objetivo\","+cadastrado.idobjetivo+")'></span></div>";					
					
			var elementos = $('#objetivos_listados .item');					
			if(elementos.length>0){
				$(HtmlContentOEx).insertBefore( "#objetivos_listados .item:first")
			}else{
				$("#objetivos_listados").html(HtmlContentOEx);
			}
			mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");	
		}						
	});
	
	/*Function que pega os dados do formulário de atividade e executa function que cadastra atividade*/
	$("#btnSalvarAtividade").click(function(){
		
		var nome = "";
		var numero = $("#numeroAtv").val();
		var descricao = $("#nomeAtv").val();
		var objetivo = $("#objetivoAtv").val();
		var pagina = $("#paginaAtv").val();
		var livro = $("#livroAtv").val();
		var HtmlContentAtv="";
		var ultimo_id="";
		if(descricao=="" || numero=="" || objetivo=="" || livro==""){
			mensagem("Os campos nome, número, objetivo e livro são obrigatórios!","OK","bt_ok","alerta");
		}else{	
			ultimo_id = criarAtividade(nome,numero,descricao,objetivo,pagina,livro);
			cadastrado = getData("Atividade", ultimo_id);
			//console.log(cadastrado);
			HtmlContentAtv +="<div class='item'  id='atv_"+cadastrado.idatividade+"'><div class='titulo_atividade'>"+cadastrado.descricao+"</div> <span class='editar' onclick='editarROA(\"Atividade\","+cadastrado.idatividade+")'></span><span class='excluir' onclick='excluirROA(\"Atividade\","+cadastrado.idatividade+")'></span></div>";	
				
			var elementos = $('#atividades_listadas .item');					
			if(elementos.length>0){
				$(HtmlContentAtv).insertBefore( "#atividades_listadas .item:first");
			}else{
				$("#atividades_listadas").html(HtmlContentAtv);
			}						
			mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
			$("#idAtv").val('');
			$("#nomeAtv").val('');
			$("#numeroAtv").val('');
			$("#livroAtv").val('');
			$("#paginaAtv").val('');
			
		}
			
		return false;
	});	
	
	$("#roteiros_cabecalho div").click(function(){
		$("#roteiros_cabecalho div").css("background", "#87CFDE");
		$(this).css("background-color", "#29B8CE");
	
		/* Mudando estado da aba (ativando a aba clicada e inativando a outra)*/
		if($(this).attr("id") == "cabecalho_roteiro"){
			$("#Roteiro").show();
			$("#Objetivo").hide();
			$("#Atividade").hide();
			$("#RoteiroExtra").hide();
		} 
		else if($(this).attr("id") == "cabecalho_objetivo"){
			$("#Roteiro").hide();
			$("#Objetivo").show();
			$("#Atividade").hide();
			$("#RoteiroExtra").hide();
		}
		else if($(this).attr("id") == "cabecalho_atividade"){
			$("#Roteiro").hide();
			$("#Objetivo").hide();
			$("#Atividade").show();
			$("#RoteiroExtra").hide();
		}
		else{
			$("#Roteiro").hide();
			$("#Objetivo").hide();
			$("#Atividade").hide();
			$("#RoteiroExtra").show();
		}
	});
	
	/* Selecionando item dos menus */
	$("body").on("click", ".item", function(){
		$(".item").removeClass("selecionado");
		$(this).addClass("selecionado");
	});
	
	/* Hover do botão inserir atividade */
	$("#inserir_atividade").hover(function(){
		$("#over_inserir").css("opacity", "1");
	}, function(){
		$("#over_inserir").css("opacity", "0")
	});
		
	$("#inserir_atividade").click(function(){
		$("#separador").append(
		"<input id='nomeAtv' name='novaAtividade' placeholder='Atividade'> </div>")
	});

	//Lista os professores ativo=1	
	$.ajax({
	   type: "GET",
	   crossDomain: true,
	   url: path+"AlunoVariavel/listar/1"           
	}).then(function(data) {
		var aluSelecao=[[]];
		$("#alunos_listados").empty();	
		//lista todos os alunos
		for(var i = 0; i < data.length;i++){
			if(data[i].aluno != null){
								
				$('#alunos_listados').append('<div class="box_item_aluno">'+
					'<div class="item" onclick="abreCombo(\'lista_combo_'+data[i].idalunoVariavel+'\',\''+data[i].anoEstudo.idanoEstudo+'\');">'+
						'<div class="titulo_objetivo">'+data[i].aluno.nome+'</div>'+
					'</div>'+                                            
					'<div class="lista_combo" id="lista_combo_'+data[i].idalunoVariavel+'">'+
						'<div class="celulaPequena rightMargin">'+
							'<div class="infoP"> Ano estudo </div>'+
							'<div class="infoValueP">'+
								'<div class="anoEstudoValor styled-select" >'+
									//'<input value="'+ano+'" type="text" class="anoEstudo" readonly id="ano_'+data[i].idalunoVariavel+'" value="" >'+
									'<select class="anoEstudo" name="ano_'+data[i].idalunoVariavel+'" id="ano_'+data[i].idalunoVariavel+'" onchange="listaRoteiroMultiplaEscolhas(\'ano_'+data[i].idalunoVariavel+'\',\'roteiro_'+data[i].idalunoVariavel+'\',\''+data[i].aluno.idAluno+'\')"></select>'+
								'</div>'+
							'</div>'+
						'</div>'+                   
						'<div class="celulaMedia">'+
							'<div class="infoM"> Motivo </div>'+
							'<div class="infoValueM">'+
								'<input type="text" class="" name="motivo'+data[i].idalunoVariavel+'" id="motivo'+data[i].idalunoVariavel+'" >'+
							'</div>'+
						'</div>'+
						'<div class="celulaGrande">'+
							'<div class="infoP" style="width: 14.5%"> Roteiro </div>'+
							'<div class="infoValueG">'+
								'<div id="roteiro_'+data[i].idalunoVariavel+'">'+
							'</div>'+
						'</div>'+
					'</div>'+
						//Botão enviar carrega o id do aluno variavel, id do aluno e o id do ano letivo
						'<div class="btnAtribuirRoteiro" idVar="'+data[i].idalunoVariavel+'" id="'+data[i].aluno.idAluno+'" anoLetivo="'+data[i].anoLetivo.idanoLetivo+'"> Salvar </div>'+
					'</div>'+
				'</div>');
			}	
			
			aluSelecao[i]=[];
			aluSelecao[i][0]=data[i];
			aluSelecao[i][1]=0;
		}
		
		var texto;
		
		//Mesmo procedimento anterior ocorre ao pesquisar um aluno, Deve ser alterado de forma semelhante mudando apenas o nome das variaveis
		$("#pesquisaAluno").keyup(function(){

			aux = [];
			texto = $( "#pesquisaAluno" ).val();
			//Seleciona alunos e coloca no aux e depois no aluSelecao
			for(var i = 0; i < aluSelecao.length;i++){
				if( ( (aluSelecao[i][0].aluno.nome).toLowerCase() ).search( (texto.toLowerCase() ) )  == 0) {
					aux[aux.length]=[];
					aux[aux.length-1][0]=aluSelecao[i][0];
					aux[aux.length-1][1]=aluSelecao[i][1];
				}
			}

			$("#alunos_listados").empty();
			for(var i = 0; i < aux.length;i++){

				$('#alunos_listados').append('<div class="box_item_aluno">'+ 
						'<div class="item" onclick="abreCombo(\'lista_combo_'+aux[i][0].idalunoVariavel+'\',\''+aux[i][0].anoEstudo.idanoEstudo+'\');">'+
							'<div class="titulo_objetivo">'+aux[i][0].aluno.nome+'</div>'+
						'</div>'+                                            
						'<div class="lista_combo" id="lista_combo_'+aux[i][0].idalunoVariavel+'">'+
							'<div class="celulaPequena rightMargin">'+
								'<div class="infoP"> Ano estudo </div>'+
								'<div class="infoValueP">'+
									'<div class="anoEstudoValor styled-select" >'+
										'<select class="anoEstudo" name="ano_'+aux[i][0].idalunoVariavel+'" id="ano_'+aux[i][0].idalunoVariavel+'" onchange="listaRoteiroMultiplaEscolhas(\'ano_'+aux[i][0].idalunoVariavel+'\',\'roteiro_'+aux[i][0].idalunoVariavel+'\',\''+aux[i][0].aluno.idAluno+'\')"></select>'+
									'</div>'+
								'</div>'+
							'</div>'+                   
							'<div class="celulaMedia">'+
								'<div class="infoM"> Motivo </div>'+
								'<div class="infoValueM">'+
									'<input type="text" class="" name="motivo'+aux[i][0].idalunoVariavel+'" id="motivo'+aux[i][0].idalunoVariavel+'" >'+
								'</div>'+
							'</div>'+
							'<div class="celulaGrande">'+
								'<div class="infoP" style="width: 14.5%"> Roteiro </div>'+
								'<div class="infoValueG">'+
									'<div id="roteiro_'+aux[i][0].idalunoVariavel+'">'+
								'</div>'+
							'</div>'+
						'</div>'+
							'<div class="btnAtribuirRoteiro" idVar="'+aux[i][0].idalunoVariavel+'" id="'+aux[i][0].aluno.idAluno+'" anoLetivo="'+data[i].anoLetivo.idanoLetivo+'"> Salvar </div>'+
						'</div>'+
					'</div>');
					
				}
		});
	});
	
	//Salvar roteiro extra
	$("body").delegate(".btnAtribuirRoteiro", "click", function() {

		//Cria as variaveis
		var id = $(this).attr('id');
		var ano = $(this).attr('anoLetivo');
		var idVar = $(this).attr('idVar');
		var motivo = $('#motivo'+idVar).val();
		var data = new Date();
		var conf = false;
		//Salva os valores fixos a serem enviados
		var valores = 'idaluno='+id+'&motivo='+motivo+'&idano_letivo='+ano;

		var valoresEnviar = '';
		var action = 'AtribuicaoRoteiroExtra';
		
		//Percorre apenas as opções do roteiro referentes
		$('.op_roteiro_'+idVar).each(function(){
			
			//Se tiver a classe checado....
			if($(this).hasClass('checado') == true){
				//Concatena os valores fixo com o valor do roteiro
				valoresEnviar = valores+'&idroteiro='+$(this).attr('name');
				//E salva no banco
				if (setCreateData('AtribuicaoRoteiroExtra/',valoresEnviar) != 'erro'){
					//Muda o valor da var conf
					conf = true;
					//remove a linha adicionada 
					var i = $(this).attr('id');
					$('.'+i).remove();
				}
			}

		});

		//Verifica através da var conf se houve sucesso nos cadastros e exibe uma mensagem!!
		if (conf == false) {
			mensagem("Por favor, selecione um roteiro!","OK","bt_ok","erro");
		}else{
			mensagem("Roteiros adicionados com sucesso!","OK","bt_ok","sucesso");
		}

		
		return false;
	});
});

function abreCombo(item_linha, ano){
	
	$("#"+item_linha).toggle();
	
	//Se a div estiver visivel, as opções no select e esconde o ano do aluno
	if ($('#'+item_linha).css('display') == 'block'){
		var id = item_linha.replace(/[^0-9]+/g,'');
		$('#ano_'+id).html("<option value=''></option>"+HtmlContent);
		$('#ano_'+id+' option[value='+ano+']').hide();
	}
	
	return false;
}

/*-------------------------------------------ROTEIROS-------------------------------------------------------*/

function listaRoteiroMultiplaEscolhas(anoEstudo,comboRoteiro,idAluno){
	
	//Retira ano_ da variavel 'anoEstudo' e coloca lista_combo_
	var idCombo =  "lista_combo_"+anoEstudo.substring(4);

	//Pega o valor do input com o ano do estudo
	var anoEstudo = $("#"+anoEstudo).val();
	
		//Busca os roteiros que podem ser atribuidos ao aluno (apenas os roteiros do ano seguinte)
	var dataRoteiroAno = getData("Roteiro/RoteiroAno", anoEstudo);
	//console.log(anoEstudo);
	//console.log(dataRoteiroAno);
	
	//Cria o Html com os selects
	HtmlContentR = '<div class="multiselect">';
	HtmlContentR += '<div class="selectBox  styled-select" onclick="showCheckboxes(\'check_'+comboRoteiro+'\')" name="ok">';
	HtmlContentR += '<select>'
	HtmlContentR += '<option>Selecione um roteiro</option>';
	HtmlContentR += '</select>';
	HtmlContentR += '<div class="overSelect"></div>';
	HtmlContentR += '</div>';
	HtmlContentR += '<div class="checkboxes check_'+comboRoteiro+'">';

	//variavel para contar quantos roteiros estão disponiveis
	var cont = 0;

	//Passa por todos os roteiros...
	for(var a=0;a<dataRoteiroAno.length; a++){
		//e verifica se não está atribuido ao aluno
		if(VerificaAtribuicaoRoteiroExtra(idAluno, dataRoteiroAno[a].idroteiro)==0){
			//Se não tiver, adiciona ele no html!!
			HtmlContentR += '<label class="'+comboRoteiro+'_'+dataRoteiroAno[a].idroteiro+'" for="'+comboRoteiro+'_'+dataRoteiroAno[a].idroteiro+'"><input type="checkbox" id="'+comboRoteiro+'_'+dataRoteiroAno[a].idroteiro+'" name="'+dataRoteiroAno[a].idroteiro+'" class="op op_'+comboRoteiro+'"/>'+dataRoteiroAno[a].nome+'</label>';
			cont++;
		}
	}
	
	HtmlContentR += '</div>';
	HtmlContentR += '</div>';
	if (cont > 0){
		$('#'+comboRoteiro).html(HtmlContentR);
	}else $('#'+comboRoteiro).html('<div class="celulaGrande"><div class="infoTotal"> Nenhum roteiro disponível!!</div></div>');
	
	return false;
}

/*Function para cadastrar roteiro*/
function criarRoteiro(anoEstudo,nome,descricao)
{
	var retorno;
	var status;
	var valores = "nome="+nome+"&descricao="+descricao+"&anoEstudo="+anoEstudo+"&ativo=1";
	
	retorno = setCreateData("Roteiro",valores);
	
	if(retorno != "erro"){
		mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
		status = retorno;		
	}else{
		mensagem("Erro ao cadastrar!","OK","bt_ok","erro");
		status = "erro";
	}
	return status;
}

function fltRoteiro(){	
	var anoEstudo = $("#anoEstudo").val();
	/*var status = $("#status").val();*/
	
	/*lista roteiros para excluir*/
	HtmlContentRot = ""; 	
    for(var h=0;h<dataRoteiro.length; h++)
    {		
        if(anoEstudo == dataRoteiro[h].anoEstudo.idanoEstudo){
			HtmlContentRot +="<div class='item' id=rot_"+dataRoteiro[h].idroteiro+"><div class='titulo_roteiro'>"+dataRoteiro[h].nome+"</div> <span class='editar' onclick='editarROA(\"Roteiro\","+dataRoteiro[h].idroteiro+")'></span><span class='excluir' onclick='excluirROA(\"Roteiro\","+dataRoteiro[h].idroteiro+")'></span></div>";
		}
    }
	
	$('#roteiros_listados').html(HtmlContentRot);	
}
/*-------------------------------------------OBJETIVOS-------------------------------------------------------*/
/*Function para cadastrar objetivo*/
function criarObjetivo(nome,numero,descricao,roteiro)
{
	
	var retorno;
	var valores = "nome="+nome+"&numero="+numero+"&descricao="+descricao+"&roteiro="+roteiro+"&ativo=1";
	
	retorno = setCreateData("Objetivo",valores);

	if(retorno != "erro"){
		mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
		status = retorno;		
	}else{
		mensagem("Erro ao cadastrar!","OK","bt_ok","erro");
		status = "erro";
	}
	return status;
}

function listaRoteiro(anoEstudo,comboRoteiro){	
	var dataRoteiro = getData("Roteiro", null);
	var anoEstudo = $("#"+anoEstudo).val();
	HtmlContentR = ""; 
    for(var a=0;a<dataRoteiro.length; a++)
    {
		if(anoEstudo==dataRoteiro[a].anoEstudo.idanoEstudo){
        	HtmlContentR += "<option value='"+dataRoteiro[a].idroteiro+"'>"+(dataRoteiro[a].nome)+"</option>";
		}
    }
    $('#'+comboRoteiro).html("<option value=''></option>"+HtmlContentR);
}

function fltRoteiroObjetivo(){	
	var roteiroObj = $("#roteiroObj").val();
	var anoEObj = $("#anoEObj").val();
	var retorno;
	
	/*lista objetivos para excluir*/
	HtmlContentOEx = ""; 		
    for(var h=0;h<dataObjetivo.length; h++)
    {	
        if((roteiroObj == dataObjetivo[h].roteiro.idroteiro || roteiroObj == "")&&(anoEObj == dataObjetivo[h].roteiro.anoEstudo.idanoEstudo || anoEObj=="")){
			HtmlContentOEx +="<div class='item' id='obj_"+dataObjetivo[h].idobjetivo+"'><div class='titulo_objetivo'>"+dataObjetivo[h].nome+"</div> <span class='editar' onclick='editarROA(\"Objetivo\","+dataObjetivo[h].idobjetivo+")'> </span><span class='excluir' onclick='excluirROA(\"Objetivo\","+dataObjetivo[h].idobjetivo+")'></div>";
		}
    }
	retorno = $('#objetivos_listados').html(HtmlContentOEx);	
}

/*-------------------------------------------ATIVIDADES-------------------------------------------------------*/
/*Function para cadastrar atividade*/
function criarAtividade(nome,numero,descricao,objetivo,pagina,livro)
{
	var retorno;
	var valores = "nome="+nome+"&numero="+numero+"&descricao="+descricao+"&objetivo="+objetivo+"&paginaLivro="+pagina+"&livro="+livro+"&ativo=1";
	
	retorno = setCreateData("Atividade",valores);

	if(retorno != "erro"){
		mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
		status = retorno;		
	}else{
		mensagem("Erro ao cadastrar!","OK","bt_ok","erro");
		status = "erro";
	}
	return status;
}

function listagemObjetivo(comboObjetivo){	
	var dataObjetivo = getData("Objetivo", null);
	var anoEAtv = $("#anoEAtv").val();
	var roteiroAtv = $("#roteiroAtv").val();
	HtmlContentR = ""; 
    for(var a=0;a<dataObjetivo.length; a++)
    {			
		if((anoEAtv==dataObjetivo[a].roteiro.anoEstudo.idanoEstudo)&&(roteiroAtv==dataObjetivo[a].roteiro.idroteiro)){			
			HtmlContentR += "<option value='"+dataObjetivo[a].idobjetivo+"'>"+(dataObjetivo[a].nome)+"</option>";
    	}
	}
    $('#'+comboObjetivo).html("<option value=''></option>"+HtmlContentR);
}

function fltAtividades(){
	var dataAtividade = getData("Atividade", null);
	var objAtividade = $("#objetivoAtv").val();
	var roteiroAtv = $("#roteiroAtv").val();
	var anoEAtv = $("#anoEAtv").val();
	$("#idAtv").val('');
	$("#nomeAtv").val('');
	$("#numeroAtv").val('');
	$("#livroAtv").val('');
	$("#paginaAtv").val('');				
	$("#btnSalvarAtividade").css("display","block");
	$("#btnEditarAtividade").css("display","none");
	
	var retorno;
	
	/*lista atividades para excluir*/
	HtmlContentARx = ""; 	
    for(var l=0;l<dataAtividade.length; l++)
    {
    	//console.log(dataAtividade[l]);
    	if(dataAtividade[l].objetivo == null)
    	{
    		//debugger;
    	}
        else if((objAtividade == dataAtividade[l].objetivo.idobjetivo)&&(roteiroAtv==dataAtividade[l].objetivo.roteiro.idroteiro)&&(anoEAtv==dataAtividade[l].objetivo.roteiro.anoEstudo.idanoEstudo)){			
			HtmlContentARx +="<div class='item' id='atv_"+dataAtividade[l].idatividade+"'><div class='titulo_atividade'>"+dataAtividade[l].descricao+"</div> <span class='editar' onclick='editarROA(\"Atividade\","+dataAtividade[l].idatividade+")'> </span><span class='excluir' onclick='excluirROA(\"Atividade\","+dataAtividade[l].idatividade+")'></div>";
		}
    }
	$('#atividades_listadas').html(HtmlContentARx);	
}

function editarROA(servico,id){
	/*coloca os dados do roteiro selecionado nos campos*/	
	var dataServico = getData(servico,id);
	if(servico=="Roteiro"){		
		$("#id").val(id);
		$("#nome").val(dataServico.nome);
		$("#btnSalvar").css("display","none");
		$("#btnEditar").css("display","block");			
	}else if(servico=="Objetivo"){
		$("#idObj").val(id);
		$("#nomeObj").val(dataServico.nome);
		$("#numeroObj").val(dataServico.numero);		
		$("#btnSalvarObjetivo").css("display","none");
		$("#btnEditarObjetivo").css("display","block");			
	}else if(servico=="Atividade"){
		$("#idAtv").val(id);
		$("#nomeAtv").val(dataServico.descricao);
		$("#numeroAtv").val(dataServico.numero);
		$("#livroAtv").val(dataServico.livro);
		$("#paginaAtv").val(dataServico.paginaLivro);				
		$("#btnSalvarAtividade").css("display","none");
		$("#btnEditarAtividade").css("display","block");			
	}		
}

function alterarROA(servico){
	loading('inicial');
	var retorno="";
	var alterar="";
	var linha="";
	var descricao="";
	var msg;
	HtmlContent="";
	
	if(servico == "Roteiro"){		
		var anoEstudo = $("#anoEstudo").val();
		var nome = $("#nome").val();
		var id = $("#id").val();
		linha = "rot_"+id;
		var descricao = "";
		alterar = "&nome="+nome+"&descricao="+descricao+"&anoEstudo="+anoEstudo+"&ativo=1&id="+id;
		HtmlContent = "<div class='item selecionado'><div class='titulo_roteiro'>"+nome+"</div> <span class='editar' onclick='editarROA(\"Roteiro\","+id+")'></span><span class='excluir' onclick='excluirROA(\"Roteiro\","+id+")'></div>";
		msg = "Roteiro alterado com sucesso!";
	
	}else if(servico == "Objetivo"){		
		var roteiroObj = $("#roteiroObj").val();
		var anoEObj = $("#anoEObj").val();
		var numeroObj = $("#numeroObj").val();		
		var nomeObj = $("#nomeObj").val();
		var idObj = $("#idObj").val();		
		linha = "obj_"+idObj;
		var descricao = "";			
		alterar = "&nome="+nomeObj+"&numero="+numeroObj+"&descricao="+descricao+"&roteiro="+roteiroObj+"&ativo=1&id="+id;		
		HtmlContent = "<div class='item selecionado'><div class='titulo_objetivo'>"+nomeObj+"</div> <span class='editar' onclick='editarROA(\"Objetivo\","+id+")'></span><span class='excluir' onclick='excluirROA(\"Objetivo\","+id+")'></div>";
		msg = "Objetivo alterado com sucesso!";
	
	}else if(servico == "Atividade"){
		var objetivoAtv = $("#objetivoAtv").val();			
		var idAtv = $("#idAtv").val();
		var descricao = $("#nomeAtv").val();
		var nomeAtv = '';
		var numeroAtv = $("#numeroAtv").val();		
		var livroAtv = $("#livroAtv").val();
		var paginaAtv = $("#paginaAtv").val();			
		linha = "atv_"+idAtv;
		alterar ="&nome="+nomeAtv+"&numero="+numeroAtv+"&descricao="+descricao+"&objetivo="+objetivoAtv+"&paginaLivro="+paginaAtv+"&livro="+livroAtv+"&ativo=1&id="+idAtv,				
		HtmlContent = "<div class='item selecionado'><div class='titulo_objetivo'>"+descricao+"</div> <span class='editar' onclick='editarROA(\"Atividade\","+idAtv+")'></span><span class='excluir' onclick='excluirROA(\"Atividade\","+idAtv+")'></div>";
		msg = "Atividade alterada com sucesso!";
		
		if(descricao=="" || numeroAtv=="" || objetivoAtv=="" || livroAtv==""){
			mensagem("Os campos nome, número, objetivo e livro são obrigatórios!","OK","bt_ok","alerta");
			return false;
		}else{
			
			
			$("#idAtv").val('');
			$("#nomeAtv").val('');
			$("#numeroAtv").val('');
			$("#livroAtv").val('');
			$("#paginaAtv").val('');				
			$("#btnSalvarAtividade").css("display","block");
			$("#btnEditarAtividade").css("display","none");
		}
	}	
	var retorno = setUpdateData(servico,alterar,id);
	loading('inicial');
	if(retorno != "erro"){
		
		$('#'+linha).html(HtmlContent);
		mensagem(msg,"OK","bt_ok","sucesso")
		loading('final');
		console.log('8');
		return false;
	}else{
		mensagem("Erro ao alterar!","OK","bt_ok","erro")
		loading('final');
		return false;
	}
}

function excluirROA(servico,id){
	mensagem("Deseja realmente excluir?","Cancelar","bt_cancelar","confirm",servico,id,"excluirRegistro");
}

function excluirRegistro(servico,id){
	var dataServico = getData(servico,id);
	

	if(servico == "Roteiro"){		
		alterar = "&nome="+dataServico.nome+"&descricao="+dataServico.descricao+"&anoEstudo="+dataServico.anoEstudo.idanoEstudo+"&ativo=0&id="+id;
		$("#rot_"+id).remove();
		msg = "Roteiro excluído com sucesso!";		
	}else if(servico == "Objetivo"){			
		alterar = "&nome="+dataServico.nome+"&numero="+dataServico.numero+"&descricao="+dataServico.descricao+"&roteiro="+dataServico.roteiro.idroteiro+"&ativo=0&id="+id;		
		$("#obj_"+id).remove();
		msg = "Objetivo excluído com sucesso!";	
	}else if(servico == "Atividade"){	
		alterar ="&nome="+dataServico.nome+"&numero="+dataServico.numero+"&descricao="+dataServico.descricao+"&objetivo="+dataServico.objetivo.idobjetivo+"&paginaLivro="+dataServico.paginaLivro+"&livro="+dataServico.livro+"&ativo=0&id="+id,				
		$("#atv_"+id).remove();	
		msg = "Atividade excluída com sucesso!";		
	}
	//console.log(alterar);
	
	var retorno = setUpdateData(servico,alterar,id);
	if(retorno != "erro"){
		$( "#boxMensagemGeral" ).hide();
		return mensagem(msg,"OK","bt_ok","sucesso");			
	}else{
		$( "#boxMensagemGeral" ).hide();
		return mensagem("Erro ao alterar!","OK","bt_ok","erro");
	}
}

function VerificaAtribuicaoRoteiroExtra(idAluno, idRoteiro){
    var ValorRetorno;
 
    $.ajax({
        type: "GET",
        async:false,
        crossDomain: true,
        url: path+"AtribuicaoRoteiroExtra/RoteiroAluno/"+idAluno+"/"+idRoteiro
	}).then(function(data) {
		ValorRetorno = data;
	});
     return ValorRetorno;
}