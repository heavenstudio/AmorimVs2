//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Variáveis globais para navegação
var navItens;
var contentItens;
var oficinasLista;
var oficinasItens;

//Atividades
var listAtvs;
var listImgs;
var oficinas = [];

//Arquivo
var Arquivo;
//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

	var aluno=1;
    var UsuarioAtivo = 2;
	var tipoArquivo = '';
	var categoria = '';
	var alunoVarObj = localStorage.objetoAlunoVariavel;
	var alunoVar = parseInt(alunoVarObj.substring(19).split(",",1));

//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

var dataUsuario 		=	getData("Usuario", null);
var dataProducaoAluno 	=	getData("ProducaoAluno", null);

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

var userID = usuarioId;
var alunoID = getAlunoByUsuario();


//var tipoSelecao = base64_decode(GetURLParameter('tipoProducao'));
var tipoSelecao = GetURLParameter('tipoProducao');

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function(){
	
	var cats = getData("CategoriaProducaoAluno", null);
	htmlCat = '';
	for(i=0;i<cats.length;i++){
		htmlCat += '<div class="infoValueP BorderBottom " style="height: 42px"> '+cats[i].categoria+' </div> <div class="inputImg tipoP BorderBottom categoria" style="height: 42px " value="'+cats[i].idcategoriaProducaoAluno+'"> </div>';
	}
	$('#opcoesCategoria').html(htmlCat);
	
	$(".categoria").click(function(){
		$("div.categoria").css("background-position","0px 0px");
		$(this).css("background-position","-39px 0px");
		categoria = $(this).attr('value');
	});
	$("div.inputImg").not(".vazio, .categoria").click(function(){
		$("div.inputImg").not('.categoria').css("background-position","0px 0px");
		$(this).css("background-position","-39px 0px");
		
		tipoArquivo = $(this).attr('value');
		
		if (tipoArquivo == 'video'){
			 $("#arquivo").hide();
			 $("#link").show();
		}else {
			 $("#link").hide();
			 $("#arquivo").show();
		}
		
		return false;
	});
	
	/*$("li").click(function(){
		if($(this).html().length != 1){
		$("#menu_lateral li").css("background", "#ECEBE5");
		$(this).css("background-color", "#D6E5A9");
			$('.imagem_objeto').filter(function() {
			    var element = $(this);

			    if(element.css('display') == 'none') {
			        element.remove();
			        return false;
			    }

			    return true;
			}).css("background-image","url(data:image/gif;base64,"+($(this).attr("ImgSelect"))+")")
		}
	});*/

	//----------------------------------------------------------
	
	//Navegação por abas
	navItens 		= $('.Prod_Aluno_Nav_Item');
	contentItens	= $('.Prod_Aluno_Content_Item');

	showTabContent(navItens[0]); //Ativar primeira aba

	$(navItens).click(function() {
		showTabContent(this);
		return false;
	});
	$(navItens).focus(function() {
		showTabContent(this);
		return false;
	});

	//Acordeon Oficinas
	showAcordeonOficinas();

	oficinasLista = $('.Prod_Oficina_Nome');
	oficinasItens = $('.Prod_Oficina_Content');

    //showOficinaContent(oficinasLista[0], oficinasLista[0].parentElement.id);

//	$('.Prod_Oficina_Nome').click(function(){
//		var idTab 		= $(this).parent().attr('id');
//		var idOficina 	= parseInt(idTab.substring(7));
//
//		showOficinaContent(this, idTab, idOficina);
//		return false;
//	});

	/*$('.Item_AtvExtra').click(function(){
		showAtividadeExtra(this.attr('address'));
		return false;
	});*/
    
    $('#Oficinas').mCustomScrollbar({
        axis: "y"
    });
	    
	$("#postagemImagem").change(function(e) {
	    var FR = new FileReader();
	    FR.onload = function(e) {
	        $("#imagemArquivo").val(e.target.result);
	    };
	    Arquivo = this.files[0];
	});

	$('#addArquivo').click(function() {
		$('#postagemImagem').trigger('click');
	});

	//----------------------------------------------------------

	CarregaProducao();
	
	var background = ($(".inputImg").css("background"));
	background = background.replace("no-repeat", "repeat");
	$(".inputImg").not($(".vazio")).css("background",background);
	//$(".vazio").css('cursor','default');


	GerarUpload($('#foto'), $("#Arquivo_Foto_Aluno"), $('#Dados_Foto_Aluno'))



    $('#btn_Sub_AE').click(function(){
    	
    	if ($('#atividadeNova').val() == ''){
			return mensagem("Preencha o campo da atividade!","OK","bt_ok","erro");
		}
		
		if (categoria == ''){
			return mensagem("Escolha a categoria!","OK","bt_ok","erro");
		}
		
		if (tipoArquivo == ''){
			return mensagem("Escolha um tipo de arquivo!","OK","bt_ok","erro");
		}
		
    	if (tipoArquivo == 'video'){
    		Arquivo = $('#linkVideo').val();
    		arq = $('#linkVideo').val();
			if (arq == ''){
				return mensagem("Preencha o link do vídeo!","OK","bt_ok","erro");
			}
    	}else var arq = '';
    	
        if (Arquivo != "" && Arquivo != undefined){
        	
        	var atv = $('#atividadeNova').val();
        	
        	
        	var valores = "anoLetivo=80&texto="+atv+"&data=21-09-2014&aluno="+alunoID+"&tipo=6&categoria="+categoria+"&arquivo="+arq;
        			
			var retorno = setCreateData("ProducaoAluno",valores);
			

			if(retorno != "erro"){
			
				$('#Cadastro_Form_imagem_PA #id').val(retorno);
				if (arq == '') {
					loading("inicial");
					addFileTo(retorno);
					//dataProducaoAluno 	=	getData("ProducaoAluno", null);
				}else{
//					$('#foto').css("background-image","url(img/foto.png)");
//		            $('#Arquivo_Foto_Aluno').val("");
//		            $('#Dados_Foto_Aluno').html("");
					
		            dataProducaoAluno 	=	getData("ProducaoAluno", null);
		            tipoSelecao = "atividade";
					mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
					CarregaProducao();
					
				}
				
				//Limpa os campos!!
				$('#atividadeNova').val('');
				$('#linkVideo').val('');
				$("div.inputImg").css("background-position","0px 0px");
				tipoArquivo = '';
				categoria = '';
				$("#arquivo, #link").hide();
				
			}else{
				return mensagem("Erro ao cadastrar!","OK","bt_ok","erro");
			}
			return false;

        } else {
            return mensagem("Por Favor, adicione um arquivo!","OK","bt_ok","erro");
        }
    }); 

	$("#Arquivo_Foto_Aluno").change(function(e){
    	$("#LegendaUpload").html("Arquivo Carregado");
    });
});

function CarregaProducao()
{
	var PrimeiroAtividade = false;

	HtmlContent1="";
	HtmlContent2="";
	HtmlContent3="";

	if(!PrimeiroAtividade)
	{
		HtmlContent2 += "<li id='List_ADD' ArquivoSelect=''> Nova Atividade </li>";
		PrimeiroAtividade = true;
	}

	for(var a = 0; a < dataProducaoAluno.length; a++)
	{
		
		if(dataProducaoAluno[a].arquivo){
			extensao = (dataProducaoAluno[a].arquivo.substring(dataProducaoAluno[a].arquivo.lastIndexOf("."))).toLowerCase();
		}
		if(dataProducaoAluno[a].aluno.idAluno == alunoID)
		{
			//if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 1)
			if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 5)
			{
				if (extensao == ".docx" || extensao == ".doc")
				{
					HtmlContent1 += "<a href='" + dataProducaoAluno[a].arquivo + "'><li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].roteiro.nome+" </li></a>";
				}
				else
				{
					HtmlContent1 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].roteiro.nome+" </li>";
				}
			} 

			//else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 2)
			else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 6)
			{

				if (extensao == ".docx" || extensao == ".doc")
				{
					HtmlContent2 += "<a href='" + dataProducaoAluno[a].arquivo + "'><li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].texto+" </li></a>";
				}
				else
				{
					HtmlContent2 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].texto+" </li>";
				}        		
			} 

			//else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 3)
			else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 4)
			{
				if (extensao == ".docx" || extensao == ".doc")
				{
					HtmlContent3 += "<a href='" + dataProducaoAluno[a].arquivo + "'><li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].roteiro.nome+" </li></a>";
				}
				else
				{
					HtmlContent3 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].roteiro.nome+" </li>";
				}
				
			}
		}
    }

    $('#menu_lateral_portfolio 	ul').html((HtmlContent1 != "" ? HtmlContent1:"Não há Portifólio!")).css({"color":"#878787","font-size":"16px","padding":"4px"});
	$('#menu_lateral_atividade 	ul').html(HtmlContent2);
	if(HtmlContent3 != "" ){
		$('#menu_lateral_fichas ul').html(HtmlContent3);
	}else{
		$('#menu_lateral_fichas ul').html("Não há Fichas de Finalização!").css({"position":"relative","width":"150%","color":"#878787","font-size":"16px","padding":"4px"});
	}
	
	if(tipoSelecao == "atividade")
	{
		//alert(tipoSelecao);
		$('#cabecalho_atividade').click();
		document.getElementById('Atividade').click();
	} else if(tipoSelecao == "fichas")
	{
		$('#cabecalho_fichas').click();
		//$('#Fichas li').click();
	} else {
		$('#cabecalho_portfolio').click();
		//$('#Portfolio li').click();
	}

	loading('final');
    reLoadClick();
}

//Pegar Aluno pelo usuario

function getAlunoByUsuario()
{
	for(var a=0; a<dataUsuario.length;a++)
	{
		if(dataUsuario[a].idusuario == userID)
		{
			return dataUsuario[a].aluno.idAluno;
		}
	}
}

function reLoadClick(){
	$("#menu_lateral_portfolio li").click(function(){
        var ex = true;
		var arquivo = $(this).attr('arquivoselect');
		extensao = (arquivo.substring(arquivo.lastIndexOf("."))).toLowerCase();

		if((extensao == ".docx")||(extensao == ".doc")){
			ex = false;
            $("#Prod_Aluno_Content li").not(':hidden').css("background-color", "#ECEBE5");
            $(this).not(':hidden').css("background-color", "#D6E5A9");
		}
				
		if(ex){
			if($(this).html().length != 1){

				$("#Prod_Aluno_Content li").not(':hidden').css("background-color", "#ECEBE5");
				$(this).not(':hidden').css("background-color", "#D6E5A9");
				
				if($(this).attr('id') == "List_ADD"){
					$('#objeto_verificar').hide();
					$('#objeto_adicionar').show();

				} else {			
					//$('.imagem_objeto iframe').css('width',$("#objeto_verificar").width()+'px');
					
					$('#objeto_adicionar').hide();
					$('#objeto_verificar').show();
					if (extensao.length <= 5){
						$('.imagem_objeto iframe').not(':hidden').attr("src",($(this).attr("ArquivoSelect")));
					}else{
						var video = (arquivo.substring(arquivo.lastIndexOf("=")));
						video = video.substring(1);
						$('.imagem_objeto iframe').not(':hidden').attr('src','http://youtube.com/embed/'+video);
						
					}
				}
			}
		}		
	});
} 

function addFileTo(ID)
{

    var formData = new FormData($('#Cadastro_Form_imagem_PA')[0]);
    formData.append("arquivo", Arquivo);

    $.ajax({
    url: path+"ProducaoAluno/upload/producaoAluno/arquivo/"+ID,
    type: "POST",
    mimeType:"multipart/form-data",
    contentType: false,
    cache: false,
    processData:false,
    data: formData,        
        success: function(d) {
            //alert("Arquivo Salvo.");
            mensagem("Arquivo salvo!","OK","bt_ok","sucesso");
            $('#foto').css("background-image","url(img/foto.png)");
            $('#Arquivo_Foto_Aluno').val("");
            $('#Dados_Foto_Aluno').html("");
            dataProducaoAluno 	=	getData("ProducaoAluno", null);
            tipoSelecao = "atividade";
            CarregaProducao();

            $("#LegendaUpload").html("Aguardando Arquivo");
            
            //CarregaProducao();
        },error: function() {
            return mensagem("Não modificado, verifique os campos!","OK","bt_ok","erro");
        }
    }); 
}

function getAnoLetivo(formato){
	var dataSalvaPortifolio = new Date();
	var anoAtual;
	
	if(formato == "idAnoLetivo"){		
		var dataAnoLetivo = getData("AnoLetivo",null);
		for(var i=0;i<dataAnoLetivo.length;i++){
			var anoLetivo = dataAnoLetivo[i].ano;
			anoLetivo = anoLetivo.split("-");		
			if(anoLetivo[0]==dataSalvaPortifolio.getUTCFullYear()){
				anoAtual = dataAnoLetivo[i].idanoLetivo;
			}
		}	
	}else if(formato == "anoAnoLetivo"){
		anoAtual = dataSalvaPortifolio.getUTCFullYear();
	}
	
	return anoAtual;
}

//---------------------------------------------------------------

/* Produçoes do aluno por Oficina */


/* ------ Funções GET ------ */

//Get Oficinas do Aluno
function getOficinasAluno()
{
	var retorno;

    $.ajax({
        url: path + 'Oficina/ListarPorAluno/' + alunoVar ,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dOficina) { retorno = dOficina; },
		error: function(e) { mensagem("Erro ao retornar as produções dessa oficina.","OK","bt_ok","erro"); }
    });

	return retorno;
}

//Get atividades por oficina
function getAtividadesOficina(idoficina)
{
	var retorno;

	$.ajax({
		url: path + 'ProducaoAluno/OficinaAluno/'+idoficina+'/'+alunoID+'/',
		async: false,
        crossDomain: true,
        type: "GET",
        success: function(dAtvOficina) { retorno = dAtvOficina; },
        error: function(e) { mensagem("Erro ao retornar as produções dessa oficina.","OK","bt_ok","erro"); }
	});

	return retorno;
}

//Carregar Atividades Extra
function getAtividadesExtras()
{
	var retorno;

	$.ajax({
	    url: path + 'ProducaoAluno/Filtos/'+alunoID+'/6/0',
	    async: false,
	    crossDomain: true,
	    type: "GET",
	    success: function(dAtvsExtras) { retorno = dAtvsExtras; },
        error: function(e) { mensagem("Erro ao retornar as produções de atividades extras.","OK","bt_ok","erro"); }
	});

	return retorno;
}


/* ------ Funções POST ------ */

//Inserir Produção Oficina (Sem serviço)
function postProducaoOficina(tabID)
{
    var d = new Date();
    var data = { ano: d.getFullYear(), mes: d.getMonth()+1, dia: d.getDate() }
    var anoLetivo = getAnoLetivo('idAnoLetivo');

    $('#anoLetivo').val(anoLetivo);
    $('#data').val(data.ano+"-"+data.mes+"-"+data.dia);
    $('#aluno').val(alunoID);
    
	$.ajax({
        url: path+"ProducaoAluno/",
        type: "POST",
        crossDomain: true,
        data: $("#form_Nova_Producao").find('input[name!="naoEnviar"]').serialize(),
        beforeSend: function(){
            loading("inicial");
        }, 
        success: function(dataPost) {
			uploadArquivo(dataPost);
			mensagem("Produção cadastrada com sucesso!","OK","bt_ok","sucesso");
        },
        complete: function () {
            loading("final");
		},
		error: function(e) {
			mensagem("Errro ao cadastrar uma nova produção.","OK","bt_ok","erro");
		}
    }); 
}

//Upload arquivo
function uploadArquivo(idpost)
{
    var formData = new FormData($("#form_Nova_Producao")[0]);
    formData.append("arquivo", Arquivo);

    $.ajax({
    	url: path + 'ProducaoAluno/upload/producaoAluno/arquivo/' + idpost,
    	type: "POST",
    	crossDomain: true,
    	async: false,
		mimeType:"multipart/form-data",
        contentType: false,
        cache: false,
        processData:false,
        data: formData,
    });
}

/* ------ Funções SHOW ------ */

// Navegação entre as abas da página
function showTabContent(tabToDisplay)
{
	for ( var i = 0; i < navItens.length; i++ )
	{
		if ( navItens[i] == tabToDisplay )
		{
			$($(navItens).get(i)).addClass('Nav_Item_Ativo');
			$($(contentItens).get(i)).show();
		}
		else
		{
			$($(navItens).get(i)).removeClass('Nav_Item_Ativo');
			$($(contentItens).get(i)).hide();
		}
	}
}

//Exibir formulário de nova produçãoi
function showFormNovaProd(idoficina, tipo)
{
	$('#container_Nova_Producao').show();
    $('#Prod_Oficina_View').hide();
	$('#Prod_Oficina_View').attr('src','');

	$('#tipo').val(tipo);
	$('#oficina').val(idoficina);

	if ( idoficina == 0 )
	{
		$('#oficina').attr('name','naoEnviar');
	}
	else
	{
		$('#oficina').attr('name','oficina');
	}
}

//Exibir atividade extra
function showAtividadeExtra(url)
{
    $('#container_Nova_Producao').hide();
    $('#Prod_Oficina_View').show();
	$('#Prod_Oficina_View').attr('src',url);
}

//Acordeon Oficinas
function showAcordeonOficinas()
{
	var listaOficinas = getOficinasAluno();
	var acordeonHtml = '';

	for (var a in listaOficinas)
	{
		oficinas.push(listaOficinas[a]);
		var nomeOficina = listaOficinas[a].nome.split(' ',1).toString();

		acordeonHtml +=
			'<div id="oficina'+listaOficinas[a].idoficina+'" class="Prod_Oficina_Item Prod_Oficina">'+
				'<div class="Prod_Oficina_Nome" style="background-color: '+listaOficinas[a].tipoOficina.cor.forte+'" onclick="showOficinaContent('+listaOficinas[a].idoficina+')">'+nomeOficina+'</div>'+
				'<div class="Prod_Oficina_Content">'+
					'<div id="oficinaAdd'+listaOficinas[a].idoficina+'"class="Oficina_Content_Item Add_Item" onclick="showFormNovaProd('+listaOficinas[a].idoficina+', 7)">Inserir novo</div>'+
				'</div>'+
			'</div>';
	}

	listAtvs = $('#Prod_Oficina_Acordeon .Item_Img');
	listImgs = $('#conteudo_principal_oficinas .Oficina_Prod_Img');

	$('#Prod_Oficina_Acordeon').prepend(acordeonHtml);
}
function showOficinaContent(id)
{
	if ( ! $('#oficina'+id).hasClass('atividadesListadas') )
	{
		var atividades = getAtividadesOficina(id);
		var htmlAtividades = '';

		if ( atividades !== undefined )
		{
			for (var a in atividades)
			{
				htmlAtividades +=
					'<div id="'+atividades[a].idproducaoAluno+'"" class="Oficina_Content_Item Item_Prod" onclick="showAtividadeExtra(\''+atividades[a].arquivo+'\')">'+
						'<span class="Item_Prod_Titulo">'+atividades[a].texto+'</span>'+
					'</div>';
			}
			$('#oficina'+id).find('.Prod_Oficina_Content').append(htmlAtividades);
			$('#oficina'+id).addClass('atividadesListadas')
		}
	}

 	for ( var i = 0; i < oficinasLista.length; i++ )
 	{
 		if ( oficinasLista[i].parentElement.id == 'oficina'+id )
 		{
 			if ( !oficinasLista[i].parentElement.classList.contains('itemExpandido') )
 			{
				$($(oficinasItens).get(i)).slideDown();
				$($(oficinasLista).get(i)).parent().addClass('itemExpandido');
 			}
 			else
 			{
 				$($(oficinasItens).get(i)).slideUp();
				$($(oficinasLista).get(i)).parent().removeClass('itemExpandido');
 			}
		}
		else 
		{
			$($(oficinasItens).get(i)).slideUp();
			$($(oficinasLista).get(i)).parent().removeClass('itemExpandido');
		}
 	}
}

function showAtividadesExtraContent()
{
	if ( !$('#AtvExtra').hasClass('atividadesListadas') )
	{
		var atividades = getAtividadesExtras();
		var htmlAtividades = '';

		if ( atividades.length > 0 ) {
			for ( a in atividades )
			{
				htmlAtividades +=
					'<div id="'+atividades[a].idproducaoAluno+'" class="Oficina_Content_Item Item_Prod" onclick="showAtividadeExtra(\''+atividades[a].arquivo+'\')">'+
						'<span class="Item_Prod_Titulo">'+atividades[a].texto+'</span>'+
					'</div>';
			}
		}

		$('#AtvExtra').find('.Prod_Oficina_Content').append(htmlAtividades);
		$('#AtvExtra').addClass('atividadesListadas')
	}

	if( !$('#AtvExtra').hasClass('itemExpandido') )
	{
		$('.Prod_Oficina').find('.Prod_Oficina_Content').slideUp();
		$('#AtvExtra').find('.Prod_Oficina_Content').slideDown();
		$('#AtvExtra').addClass('itemExpandido');
	}
	else
	{
		$('.Prod_Oficina').find('.Prod_Oficina_Content').slideUp();
		$('#AtvExtra').find('.Prod_Oficina_Content').slideUp();
		$('#AtvExtra').removeClass('itemExpandido');
	}
}


// function carregaForm(){

	// alert($(this).val());
	// return false;
	// //$("#tipoArquivo option").eq(0).hide();
	// if ($("#tipoArquivo").val() == 'video'){
		// $("#arquivo").hide();
		// $("#link").show();
	// }else {
		// $("#link").hide();
		// $("#arquivo").show();
	// }
	
	// return false;
// }