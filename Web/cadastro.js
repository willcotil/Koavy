document.addEventListener("DOMContentLoaded", () => {
    const API = "http://localhost:8080";
    const form = document.getElementById("formCadastro");
    const erroMsg = document.getElementById("mensagemErro");
    const sucessoMsg = document.getElementById("mensagemSucesso");

    if (!form) return;

    // Utilitário de idade
    function calcularIdade(dataNascimento) {
        if (!dataNascimento) return null;
        const hoje = new Date();
        const nasc = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nasc.getFullYear();
        const m = hoje.getMonth() - nasc.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
            idade--;
        }
        return idade;
    }

    // Feedback Visual
    function mostrarFeedback(msg, tipo) {
        if (tipo === 'erro') {
            erroMsg.innerText = msg;
            erroMsg.classList.remove('hidden');
            sucessoMsg.classList.add('hidden');
        } else {
            sucessoMsg.innerHTML = msg;
            sucessoMsg.classList.remove('hidden');
            erroMsg.classList.add('hidden');
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const dataNascValue = document.getElementById("dataNascimento").value;
        
        const usuario = {
            perfilId: 1,
            ativo: true,
            nome: document.getElementById("nome").value.trim(),
            email: document.getElementById("email").value.trim(),
            senha: document.getElementById("senha").value.trim(),
            telefone: document.getElementById("telefone").value.trim(),
            dataNascimento: dataNascValue || null,
            idade: calcularIdade(dataNascValue),
            peso: Number(document.getElementById("peso").value) || null,
            altura: Number(document.getElementById("altura").value) || null,
            sexo: document.getElementById("sexo").value,
            tipoSanguineo: document.getElementById("tipoSanguineo").value.trim(),
            marcapasso: document.getElementById("marcapasso").value,
            cep: document.getElementById("cep").value.trim(),
            obsMed: document.getElementById("obsMed").value.trim()
        };

        // Validação básica
        if (!usuario.nome || !usuario.email || !usuario.senha) {
            mostrarFeedback("Preencha os campos obrigatórios (Nome, Email, Senha)", "erro");
            return;
        }

        try {
            const response = await fetch(`${API}/api/usuarios/cadastro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                const data = await response.json();
                const pacienteId = data.id;
                sessionStorage.setItem("pacienteId", pacienteId);
                
                mostrarFeedback(`
                    <div class="flex flex-col gap-2">
                        <span class="text-lg">✔ Cadastro realizado!</span>
                        <span>Seu ID de paciente é: <strong class="text-xl tracking-widest">${pacienteId}</strong></span>
                        <span class="text-xs opacity-80">Guarde este ID para seu tutor.</span>
                        <a href="cadastrotutor.html" class="mt-4 bg-white text-black py-2 rounded-xl font-bold">Vincular Tutor Agora</a>
                    </div>
                `, "sucesso");
                
                form.reset();
            } else {
                const text = await response.text();
                mostrarFeedback(text || "Erro ao realizar cadastro.", "erro");
            }
        } catch (err) {
            console.error(err);
            mostrarFeedback("Falha na conexão com o servidor.", "erro");
        }
    });
});