var socket=io.connect(window.location.href);socket.on("connect",function(){}),socket.on("message",function(t){$("#progress").text(t)}),socket.on("disconnect",function(){}),$("#dimmer").click(function(){$(".ui.dimmer").dimmer("toggle")}),$("#guide").click(function(){$(".ui.modal.guide").modal("show")}),$("#about").click(function(){$(".ui.modal.about").modal("show")}),$(".ui.file.input").find("input:text, .ui.button").on("click",function(t){$(t.target).parent().find("input:file").click()}),$("input:file",".ui.file.input").on("change",function(t){for(var n=$(t.target),i="",e=0;e<t.target.files.length;e++)i+=t.target.files[e].name+", ";i=i.replace(/,\s*$/,""),$("input:text",n.parent()).val(i)}),$("input:file").on("change",function(){$(".submitbutton").prop("disabled",!$(this).val())});