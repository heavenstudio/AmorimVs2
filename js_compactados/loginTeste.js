function logar(){$("#frm").unbind("submit").on("submit",function(a){a.preventDefault();var b=navigator.userAgent;$.ajax({url:path+"Logar",type:"post",crossDomain:!0,data:$(this).serialize()+"&versao="+b,success:function(a){if("undefined"!==typeof a)switch(localStorage.setItem("usuarioTipo",a.perfil.perfil),localStorage.setItem("usuarioId",a.idusuario),a.perfil.perfil){case"Aluno":window.location="areaAluno.html";break;case"Professor":window.location="areaProfessor.html";break;case"Coordenacao":window.location="areaCoordenacao.html";break;case"Secretaria":window.location="cadastros.html"}else alert("Login e senha inv\xe1lidos!")}})})}function caixaEsqueci(){$("#esquecisenha").css("display","block"),$(".boxGlobal").css("display","block")}function esqueciSenha(){var b,a=$("#email").val(),c="email="+a;return b=getData("Usuario/recuperarSenha",c),"erro"!=b?mensagem("Senha recuperada com sucesso!","OK","bt_ok","sucesso"):($("#esquecisenha").css("display","none"),void $(".boxGlobal").css("display","none"))}function cancelar(){$("#esquecisenha").css("display","none"),$(".boxGlobal").css("display","none")}$(document).ready(function(){$("#btnSubmit").click(function(){logar()});localStorage.getItem("usuarioTipo"),localStorage.getItem("usuarioId")});