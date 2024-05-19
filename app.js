document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("cep").addEventListener("blur", function() {
        let cep = this.value.replace(/\D/g, '');
        if (cep != "") {
            let validacep = /^[0-9]{8}$/;
            if(validacep.test(cep)) {
                fetch("https://viacep.com.br/ws/" + cep + "/json/")
                    .then(response => response.json())
                    .then(dados => {
                        if (!("erro" in dados)) {
                            document.getElementById("rua").value = dados.logradouro;
                            document.getElementById("bairro").value = dados.bairro;
                            document.getElementById("cidade").value = dados.localidade;
                            document.getElementById("uf").value = dados.uf;
                            document.getElementById("ibge").value = dados.ibge;
                        } else {
                            limpaFormularioCep();
                            alert("CEP não encontrado.");
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao buscar o CEP:', error);
                        limpaFormularioCep();
                        alert("Erro ao buscar o CEP.");
                    });
            } else {
                limpaFormularioCep();
                alert("Formato de CEP inválido.");
            }
        } else {
            limpaFormularioCep();
        }
    });

    loadenderecosalvo();

    document.getElementById("salvarButton").addEventListener("click", function() {
        let dados = {
            logradouro: document.getElementById("rua").value,
            bairro: document.getElementById("bairro").value,
            localidade: document.getElementById("cidade").value,
            uf: document.getElementById("uf").value,
            ibge: document.getElementById("ibge").value
        };

        // Validação para verificar se todos os campos não estão vazios
        if (dados.logradouro && dados.bairro && dados.localidade && dados.uf && dados.ibge) {
            saveendereco(dados);
            loadenderecosalvo();
            alert("Dados salvos com sucesso!");
        } else {
            alert("Por favor, preencha todos os campos antes de salvar.");
        }
    });
});

function limpaFormularioCep() {
    document.getElementById("rua").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("uf").value = "";
    document.getElementById("ibge").value = "";
}

function saveendereco(dados) {
    let enderecosalvo = JSON.parse(localStorage.getItem("enderecoes")) || [];
    enderecosalvo.push(dados);
    localStorage.setItem("enderecoes", JSON.stringify(enderecosalvo));
}

function loadenderecosalvo() {
    let enderecosalvo = JSON.parse(localStorage.getItem("enderecoes")) || [];
    let enderecosalvoDiv = document.getElementById("enderecosalvo");
    enderecosalvoDiv.innerHTML = "";

    enderecosalvo.forEach((endereco, index) => {
        let enderecoDiv = document.createElement("div");
        enderecoDiv.classList.add("saved-item");
        enderecoDiv.innerHTML = `
            <p><strong>Endereço ${index + 1}</strong></p>
            <p>Rua: ${endereco.logradouro}</p>
            <p>Bairro: ${endereco.bairro}</p>
            <p>Cidade: ${endereco.localidade}</p>
            <p>Estado: ${endereco.uf}</p>
            <p>IBGE: ${endereco.ibge}</p>
            <button onclick="deleteEndereco(${index})">Excluir</button>
        `;
        enderecosalvoDiv.appendChild(enderecoDiv);
    });

    if (enderecosalvo.length > 0) {
        let ultimoendereco = enderecosalvo[enderecosalvo.length - 1];
        document.getElementById("rua").value = ultimoendereco.logradouro;
        document.getElementById("bairro").value = ultimoendereco.bairro;
        document.getElementById("cidade").value = ultimoendereco.localidade;
        document.getElementById("uf").value = ultimoendereco.uf;
        document.getElementById("ibge").value = ultimoendereco.ibge;
    }
}

function deleteEndereco(index) {
    let enderecosalvo = JSON.parse(localStorage.getItem("enderecoes")) || [];
    enderecosalvo.splice(index, 1);
    localStorage.setItem("enderecoes", JSON.stringify(enderecosalvo));
    loadenderecosalvo();
}
