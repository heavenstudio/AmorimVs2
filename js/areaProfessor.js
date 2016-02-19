var professorId= localStorage.getItem("professorId");
var oficina = JSON.parse(localStorage.getItem("oficinaProfessor"));
var Arquivo;

$(document).ready(function() {

    adicionarBarraRolagem();
    carregarDados();
    atribuirEventos();
    rotinaMudarDia(0);

    $('.postContainer2').mCustomScrollbar({
        axis:"y"
    });
});

function adicionarBarraRolagem () {
    $('.postContainer').mCustomScrollbar({
        axis:"y"
    });
}

function carregarDados () {
    carregaPostsBlog();

}

function atribuirEventos () {
    clickPostagens();
    cancelarPostagens();
    uploadImagemPostagem();
    imagemPostagemTexto();
    removerImagemPostagem();
    clickRelatorio();
    cancelarRelatorio();
    iniciarMural();
    iniciarMuralCoordenacao();
    $("#salvarPostagem").click(novaPostagem);
}

function verificarImagemTipoBlog(dados) {
    if ( dados.imagem === "adicionar" && dados.tipo === "tutoria" )
	    $("#conteudoPostagens").attr("class", "boxTextInput postagemTutoriaComImagem");
	else if ( dados.imagem === "adicionar" && dados.tipo === "oficina" )
		$("#conteudoPostagens").attr("class", "boxTextInput postagemOficinaComImagem");
	else if ( dados.imagem === "remover" && dados.tipo === "tutoria" )
		$("#conteudoPostagens").attr("class", "boxTextInput postagemTutoriaSemImagem");
	else
		$("#conteudoPostagens").attr("class", "boxTextInput postagemOficinaSemImagem");
}

function carregaOficinaPostagens () {
    var htmlOficinas =  "";

    htmlOficinas +=     "<option class=\"placeholder\" value=\"0\" selected>Tutoria</option>";

    $.ajax({
        url: path + 'Oficina/ListaPorProfessor/' +  professorId,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var i = 0; i < d.length; i++) {
                htmlOficinas += "<option value=\""+d[i]["idoficina"]+"\">"+d[i]["nome"]+"</option>";
            }

            $('#oficinaSelecionada').html(htmlOficinas);


            $('#oficinaSelecionada').change(function(){
                var oficinaEscolhida = $('#oficinaSelecionada').val();

                if (oficinaEscolhida != 0) {
                    $.ajax({
                        url: path + "Agrupamento/ListarPorOficina/" + oficinaEscolhida,
                        async: false,
                        crossDomain: true,
                        type: "GET",
                        success: function(retornoAjax){

                            var htmlAgrupamentos = "";

                            for (var i = 0; i < retornoAjax.length; i++) {
                                htmlAgrupamentos += "<option value=\""+retornoAjax[i].idagrupamento+"\" "+(i == 0 ? "selected" : "")+">"+retornoAjax[i].nome+"</option>";
                            }

                            htmlAgrupamentos += "</select>";

                            $('#agrupamentoSelecionado').html(htmlAgrupamentos);

                        },
                        error: function(a, status, error) {
                            console.log(status + " /// " + error)
                        }
                    });
                    $("#agrupamentoSelecionado").show();

					if ($("#miniaturaDaFoto").css("display") == "none")
						verificarImagemTipoBlog({imagem: "remover", tipo: "oficina"});
					else
						verificarImagemTipoBlog({imagem: "adicionar", tipo: "oficina"});
                } else {
                	$("#agrupamentoSelecionado").html("<option value=\"0\" selected></option>");
                    $("#agrupamentoSelecionado").hide();

					if ($("#miniaturaDaFoto").css("display") == "none")
						verificarImagemTipoBlog({imagem: "remover", tipo: "tutoria"});
					else
						verificarImagemTipoBlog({imagem: "adicionar", tipo: "tutoria"});
                }
            });

        }
    });
}

function carregaGrupoOficinaMural () {
	$("#msgMural").css("display","block");
    var htmlGrupo = '<option class="placeholder" value="0" disabled selected hidden>Escolha o Grupo</option>';
    $.ajax({
        url: path + 'Agrupamento/ListarPorOficineiro/' + professorId,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var i = 0; i < d.length; i++)
            {
                htmlGrupo += '<option value="'+d[i].idagrupamento+'">'+d[i].nome+'</option>';
            }
        }
    });

    $('#grupoMuralOficina').html('<option value="todos">Todos</option>'+htmlGrupo);
}

function carregaGrupoTutoriaMural(professorId) {
	$("#msgMural").css("display","block");
    var htmlGrupo = '<option class="placeholder" value="0" disabled selected hidden>Escolha o Grupo</option>';
    $.ajax({
        url: path + 'ProfessorFuncionario/ProfessorGrupo/'+professorId,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var i = 0; i < d.length; i++)
            {
                htmlGrupo += '<option value="'+d[i].idgrupo+'">'+d[i].nomeGrupo+'</option>';
            }
        }
    });

    $('#grupoMuralTutoria').html(htmlGrupo);
}

function clickPostagens() {
    $("#novoPostagens").click(function() {

        $("#miniaturaDaFoto").hide();

        $("#conteudoPostagens").html("");
        $("#selectOficina select").html("");
        $("#tituloPostagens").html("");
        $("#postagemImagem").html("");

        $("#postagensConteudo").hide();
        $("#novoPostagens").hide();
        $("#postagensNova").show();

        $("#postagemAction").val("create");

        carregaOficinaPostagens();

    });
}

function cancelarPostagens () {
    $("#cancelarPostagens").click(function() {
        $("#postagensConteudo").show();
        $("#novoPostagens").show();
        $("#postagensNova").hide();
        verificarImagemTipoBlog({imagem: "remover", tipo: "tutoria"});
    });
}

function uploadImagemPostagem () {
    $("#uploadPostagem").click(function() {
        $("#postagemImagem").trigger("click");
    });
}

function imagemPostagemTexto () {
    $("#postagemImagem").change(function(e) {
        transformarMiniatura(this);
        $("#miniaturaDaFoto").show();
        $("#uploadPath").html($("#postagemImagem").val().split('\\')[2]);
        $("#arquivoUpload").show();

        var FR= new FileReader();
        FR.onload = function(e) {
            $("#imagemArquivo").val(e.target.result);
        };
        Arquivo = this.files[0];

    });
}

function transformarMiniatura(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#miniaturaDaFoto').attr('src', e.target.result);
        }

		if ($("#oficinaSelecionada").find("option:selected").val() == 0)
			verificarImagemTipoBlog({imagem: "adicionar", tipo: "tutoria"});
		else
			verificarImagemTipoBlog({imagem: "adicionar", tipo: "oficina"});

        $("#uploadPostagem").hide();

        reader.readAsDataURL(input.files[0]);
    }
}


function removerImagemPostagem(id) {
    window.id = id
    $("#removerUpload").click(function() {
        $("#arquivoUpload").hide();
        $("#miniaturaDaFoto").hide();
        $('#miniaturaDaFoto').attr('src', '#');
        $("#postagemImagem").val('');

		if ($("#oficinaSelecionada").find("option:selected").val() == 0)
			verificarImagemTipoBlog({imagem: "remover", tipo: "tutoria"});
		else
			verificarImagemTipoBlog({imagem: "remover", tipo: "oficina"});

        $("#uploadPostagem").show();

        $.ajax({
            url: path + 'Blog/DeletarImagem/' + window.id,
            async: true,
            crossDomain: true,
            type: "GET",
            success: function(d) {
                console.log("imagem deletadaf")
            }
        });

    });
}

function novaPostagem () {

    var conteudo = $("#conteudoPostagens").val();
    var oficina = $("#oficinaSelecionada").find("option:selected").val();
    var agrupamento = $("#agrupamentoSelecionado").find("option:selected").val();
    var titulo = $("#tituloPostagens").val();
    var imagem = $("#postagemImagem").val();

    var lastValue = imagem.split('.').length - 1
    var fileIsImage = (imagem.split('.')[lastValue] == 'png' || imagem.split('.')[lastValue] == 'jpg' || imagem.split('.')[lastValue] == 'jpeg' || imagem.split('.')[lastValue] == 'gif' || imagem.split('.')[lastValue] == 'bmp')

    console.log(imagem)

    if (conteudo != '' && titulo != '' && fileIsImage) {
        $("#postagemTitulo").val(titulo);
        $("#postagemConteudo").val(conteudo);
        $("#postagemOficina").val(oficina);
        $("#postagemAgrupamento").val(agrupamento);
        $("#postagemAutor").val(professorId);

        if ( $("#postagemOficina").val() == 0 ) {
			$("#postagemOficina").addClass("naoEnviar");
			$("#postagemAgrupamento").addClass("naoEnviar");
        }
        var idPostagem;

        console.log($("#formPostagens input").not(".naoEnviar").serialize())

        $.ajax({
            url: path + "Blog",
            async: false,
            crossDomain: true,
            type: "POST",
            data: $("#formPostagens input").not(".naoEnviar").serialize(),
            beforeSend: function() {loading("inicial");},
            success: function(d) {
                var post = {titulo : $("#tituloPostagens").val(), descricao : $("#postagemConteudo").val(), idblog : d, oficina : {nome : $("#selectOficina select :selected").text()}};
                mensagem("Postagem feita com sucesso!","OK","bt_ok","sucesso");
                $("#tituloPostagens").val('');
                $("#conteudoPostagens").val('');
                $("#oficinaSelecionada").val(0);
                $("#agrupamentoSelecionado").val(0);
                $("#cancelarPostagens").trigger("click");
                idPostagem = d;
            },
            complete: function() {loading("final");}
        });

        if (imagem != "")
        {
            $("#postagemAction").val("update");
            var formData = new FormData($("#formPostagens")[0]);
            formData.append("fotoAluno", Arquivo);

            $.ajax({
                url: path + "Blog/upload/Blog/" + idPostagem,
                async: false,
                crossDomain: true,
                type: "POST",
                mimeType:"multipart/form-data",
                contentType: false,
                cache: false,
                processData:false,
                data: formData,
                beforeSend: function() {loading("inicial");},
                success: function(d) {
                    mensagem("Postagem feita com sucesso!","OK","bt_ok","sucesso");
                },
                complete: function() {loading("final");}
            });
        }

        carregaPostsBlog()
    }
    else if (fileIsImage)
    {
        mensagem("Todos os campos devem ser preenchidos.","OK","bt_ok","erro");
    } else {
        mensagem("O arquivo deve ser uma imagem.","OK","bt_ok","erro");
    }

}

function carregaPostsBlog () {

    $("#mCSB_2_container").html("")

    var htmlPosts = '';

    $.ajax({
        url: path + "Blog/BlogProfessor/" + professorId,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dataPosts) {
            for (var i = 0; i < dataPosts.length; i++) {
                addPost(dataPosts[i]);
            };
        }
    });
}

function addPost (post) {
    var htmlPosts = '';

    var id = post.idblog;
    var titulo = post.titulo;
    var corpo = post.descricao.split("\n");
    var oficina = post.oficina.tipoOficina.nome;
    htmlPosts +=    '<div class="areaPost" id="blogPost' + id + '">' +
                        '<div class="post postMedio">' +
                            '<div class="postTitulo" id="blogPostTitulo'+id+'">' +
                                titulo +
                            '</div>' +
                            '<div class="postCorpo" id="blogPostCorpo'+id+'">';

    for (var a in corpo) { htmlPosts += "<p>"+corpo[a]+"</p>"; }

    htmlPosts +=            '</div>' +
                            '<div class="postDestinatario" id="blogPostOficina'+id+'">' +
                                oficina +
                            '</div>'+
                            '<div class="linhaConteudo">' +
                                '<div class="linhaBotoes">' +
                                    '<div class="containerIcone">' +
                                        '<div class="botaoIcone" onclick="deletePost(' + id + ')">' +
                                            '<img src="img/ic_del_peq.png">' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="containerIcone">' +
                                        '<div class="botaoIcone" onclick="editPost(' + id + ')">' +
                                            '<img src="img/ic_editar_peq.png">' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

    $("#mCSB_2_container").prepend(htmlPosts);
}

function editPost(id) {

    removerImagemPostagem(id)

    $("#postagensConteudo").hide();
    $("#novoPostagens").hide();
    $("#postagensNova").show();
    $("#miniaturaDaFoto").hide();

    $.ajax({
        url: path + "Blog/ImagemMin/" + id,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(data){
            if (data !== '') {
                $('#miniaturaDaFoto').attr('src', data);
                $("#miniaturaDaFoto").show();
                $("#arquivoUpload").show();
            }
        }
    });

    $("#conteudoPostagens").html($("#blogPostCorpo"+id).html());
    $("#selectOficina select").html($("#blogPostOficina"+id).html());
    $("#tituloPostagens").html($("#blogPostTitulo"+id).html());
    //$("#postagemImagem").html("");


    $("#postagemAction").val("update")
    $("#postagemId").val(id)

    carregaOficinaPostagens();
}

function deletePost(id) {

    var post = document.getElementById("blogPost"+id)
    if (post) {

        $.ajax({
            url: path + "Blog",
            async: false,
            crossDomain: true,
            type: "POST",
            data: "action=delete&id="+id,
            success: function(data){
                post.parentNode.removeChild(post)
            }
        });


    }

}

function clickRelatorio () {
    $("#novoRelatorio").click(function() {
        $("#relatorioConteudo").hide();
        $("#novoRelatorio").hide();
        $("#relatorioNova").show();
    });
}

function cancelarRelatorio () {
    $("#cancelarRelatorio").click(function() {
        $("#relatorioConteudo").show();
        $("#novoRelatorio").show();
        $("#relatorioNova").hide();
    });
}

// Mural coordenacao =============

function MuralCoordenacao() {

    self = this;

    this.desenharPostIndividual = function(mensagem, destinatario){
        var html =  '<div class="areaPost">'+
                        '<div class="post postMedio">'+
                            '<div class="postCorpo">'+
                                mensagem+
                            '</div>'+
                        '</div>'+
                    '<div>'

        $("#muralCoordenacao").prepend(html);
    }

    this.desenharPosts = function() {

        $.ajax({
            url: path + "MuralCoordenacao/",
            async: false,
            crossDomain: true,
            type: "GET",
            success: function(retornoAjax){


                for (var i = 0; i < retornoAjax.length ; i++) {

                    var mensagem = retornoAjax[i]["mensagem"];

                    self.desenharPostIndividual(mensagem)
                };

            },
            error: function(a, status, error) {
                console.log(status + " /// " + error)
            }
        });

    }

}

function iniciarMuralCoordenacao() {

    window.muralCoordenacao = new MuralCoordenacao();

    muralCoordenacao.desenharPosts()
}

// Mural Professor ======================

function Mural() {

    var self = this;

    this.open = function() {
        $("#muralConteudo").hide();
        $("#novoMural").hide();
        $("#muralNova").show();
        $("#msgMural").show();
        $("#muralTextMsg").html("");
        $("#primeiroSelect").show();
    }

    this.close = function() {
        $("#muralConteudo").show();
        $("#novoMural").show();
        $("#muralNova").hide();
        $("#oficinaMural").hide();
        $("#tutoriaMural").hide();
        $("#msgMural").hide();
        $('#grupoMural option[value="0"]').attr({ selected : "selected" });
    }

    this.atualizarListaGrupos = function() {
        var grupo = $('#grupoMural').val();
        if( grupo == "oficina"){
            $("#tutoriaMural").css("display","none")
            $("#oficinaMural").css("display","block");
            carregaGrupoOficinaMural();
        }
        else if (grupo == "tutoria"){
            $("#oficinaMural").css("display","none");
        }
        else {
            $("#oficinaMural").css("display","none");
            $("#tutoriaMural").css("display","none");
        }
    }

    this.desenharPostIndividual = function(mensagem, id, lugar){
        var html = '<div class="areaPost deletablePost" id="muralPost'+id+'">'+
                        '<div class="post postMedio">'+
                            mensagem+
                            '<div class="linhaConteudo linhaIconeInferior">'+
                                '<div class="linhaBotoes">'+
                                    '<div class="containerIcone">'+
                                        '<div class="botaoIcone" onclick="mural.deletarPost('+id+')">'+
                                            '<img src="img/ic_delete.png">'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="containerIcone">'+
                                        '<div class="botaoIco   ne" onclick="mural.editarPost('+id+')">'+
                                            '<img src="img/ic_editar_peq.png">'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>  '+
                        '</div>'+
                    '</div>';

        return $(lugar).prepend(html);
    }

    this.enviarMsgGrupo = function() {
        var valores;
        var grupo = $('#grupoMural').val();
        var parametros,mensagemMural;
        var temMsgMural = $("#muralTextMsg").val();
        if(grupo == "oficina"){
            var grupoMuraloficina = $("#grupoMuralOficina").val();
            if(grupoMuraloficina == "todos"){
                parametros = "&agrupamento=0&oficina="+oficina[0].oficina.idoficina;
            }else{
                parametros = "&agrupamento="+grupoMuraloficina+"&oficina=0";
            }
            mensagemMural = $("#muralTextMsg").val();
            valores = "&mensagem="+mensagemMural+"&idProfessor="+professorId+parametros+"&tutoria=0&grupo=0";

        }else if(grupo == "tutoria"){
            var grupoMuralTutoria = $("#grupoMuralTutoria").val();

            parametros = "&tutoria=1";

            mensagemMural = $("#muralTextMsg").val();
            valores = "&mensagem="+mensagemMural+"&idProfessor="+professorId+"&agrupamento=0&oficina=0"+parametros;
        }
        if (temMsgMural) {
            $.ajax({
                url: path + "Mural",
                async: false,
                crossDomain: true,
                type: "POST",
                data: "action=create"+valores,
                success: function(data){
                    mural.desenharPosts('#postMural #mCSB_4 #mCSB_4_container')
                    mensagem("Mensagem enviada com sucesso!","OK","bt_ok","sucesso");
                    mural.close();
                }
            });
        } else {
            mensagem("Todos os campos devem ser preenchidos.","OK","bt_ok","erro");
        }

    }

    this.verificarDestinarario = function(tutoria, grupo, oficina, agrupamento, professor) {
        if (tutoria == 1) {
            return "Tutoria"
        } else if (grupo != undefined) {
            return "Grupo " + grupo["nomeGrupo"]
        } else if (oficina != undefined) {
            return "Oficina " + oficina["nome"]
        } else if (agrupamento != undefined) {
            return "Agrupamento " + agrupamento["nome"]
        } else {
            return "Prof. " + professor["nome"]
        }
    }

    this.desenharPosts = function(lugar) {

        $.ajax({
            url: path + "Mural/ListarProfessor/"+professorId,
            async: false,
            crossDomain: true,
            type: "GET",
            success: function(retornoAjax){

                $('#postMural #mCSB_4 #mCSB_4_container').html("");



                for (var i = 0; i < retornoAjax.length ; i++) {

                    var mensagem = retornoAjax[i]["mensagem"];
                    var idMural = retornoAjax[i]["idmural"];
                    var tutoria = retornoAjax[i]["tutoria"];
                    var grupo = retornoAjax[i]["grupo"];
                    var oficina = retornoAjax[i]["oficina"];
                    var agrupamento = retornoAjax[i]["agrupamento"];
                    var professor = retornoAjax[i]["professor"];

                    var destinatario = self.verificarDestinarario(tutoria, grupo, oficina, agrupamento, professor)

                    mensagem = mensagem + "<br>-" + destinatario


                    self.desenharPostIndividual(mensagem, idMural, lugar)
                };

            },
            error: function(a, status, error) {
                console.log(status + " /// " + error)
            }
        });

        adicionarBarraRolagem();

    }



    this.editarPost = function(idPost) {

        var msg;
        this.open();
        $("#primeiroSelect").hide();

        //pega mensagem anterior para editar
        $.ajax({
            url: path + "Mural/ListarProfessor/"+professorId,
            async: false,
            crossDomain: true,
            type: "GET",
            success: function(retornoAjax){

                for (var i = retornoAjax.length - 1; i >= 0; i--) {
                    if (retornoAjax[i]["idmural"] == idPost) {

                        var mensagemAnterior = retornoAjax[i]["mensagem"]

                        $("#containerTextAreaMural").html('<textarea class="inputArea inputMensagem mensagemMedia" id="muralTextMsg" placeholder="Digite aqui a mensagem.">'+mensagemAnterior+'</textarea>')

                        $("#enviarMsgGrupo").unbind("click")
                        $("#enviarMsgGrupo").click(function() {

                            var mensagemMural = $(".mensagemMedia").val();

                            //envia mensagem nova
                            $.ajax({
                                url: path + "Mural",
                                async: false,
                                crossDomain: true,
                                type: "POST",
                                data: "action=update&id="+idPost+"&mensagem="+mensagemMural,
                                success: function(data){
                                    mural.desenharPosts('#postMural #mCSB_4 #mCSB_4_container');
                                    mural.close();
                                }
                            });

                        })
                    }
                };
            },
            error: function(a, status, error) {
                console.log(status + " /// " + error);
            }
        });

    }

    this.deletarPost = function(idPost) {
        var post = document.getElementById("muralPost"+idPost)
        if (post) {

            $.ajax({
                url: path + "Mural",
                async: false,
                crossDomain: true,
                type: "POST",
                data: "action=delete&id="+idPost,
                success: function(data){
                    post.parentNode.removeChild(post)
                }
            });


        }
    }
}

function iniciarMural() {

    window.mural = new Mural();

    mural.desenharPosts('#postMural')

    $("#novoMural").click(function() {
        mural.open()
        $("#muralTextMsg").html("")
        $("#enviarMsgGrupo").unbind("click")
        $("#enviarMsgGrupo").click(function() {
            mural.enviarMsgGrupo()
        })
    })

    $("#cancelarMural").click(function() {
        mural.close()
    });

    $("#grupoMural").change(function() {
        mural.atualizarListaGrupos()
    })
}


var diasSemana = {
    "1" : "Segunda-Feira",
    "2" : "Terça-Feira",
    "3" : "Quarta-Feira",
    "4" : "Quinta-Feira",
    "5" : "Sexta-Feira"
}

var d = new Date
var diaHoje = d.getDay()
var horarios = [7, 8, 9, 10, 11]

//Preencher Rotina Semanal
function CarregarRotina() {

    $('#Rotina_Semanal_Dia').html(diasSemana[diaHoje])
        $.ajax({
        url: path+"Rotina/RotinaDiariaProfessor/"+professorId+"/"+diaHoje,
        type: "GET",
        async: true,
        crossDomain: true,
        success: function(result) {

            horarios.forEach(function(horario) {
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Materia').html(" ")
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Professor').html(" ")
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Local').html(" ")
            })

            result.forEach(function(rotina){
                $('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Materia').html(rotina.oficina.nome)
                $('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Materia').css("background-color", rotina.oficina.tipoOficina.cor.forte)

                $('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Professor').html(rotina.agrupamento)

                $('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Professor').css("background-color", rotina.oficina.tipoOficina.cor.medio)
                $('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Local').html(rotina.sala[0].sala.sala)
                $('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Local').css("background-color", rotina.oficina.tipoOficina.cor.fraco)
            })
        },
        error: function (a, status, error) {
            console.log(status + " /// " + error)
        }
    });

}

function rotinaMudarDia(quanto) {

    horarios.forEach(function(horario) {
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Materia').html("...")
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Professor').html("...")
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Local').html("...")
            })

    diaHoje = (diaHoje + quanto)
    if (diaHoje > 5) {diaHoje = 1};
    if (diaHoje < 1) {diaHoje = 5}
    CarregarRotina()
}

