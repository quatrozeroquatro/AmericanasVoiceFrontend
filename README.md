

# AmericanasVoiceFrontend

Frontend da solução Americanas Voice, voltada para deficientes visuais e quem mais desejar.

# Demo
É possível baixar uma versão de demonstração do aplicativo em Android clicando [aqui](https://github.com/quatrozeroquatro/AmericanasVoiceFrontend/releases/download/1.0/app-americanas-voice.apk).


## Arquitetura

Nossa solução em resumo é uma feature que possibilitam pessoas a comprarem na Americanas por meio da voz.

Criamos um aplicativo que simula o app da americas e dentro dele implementamos a funcionalidade do americanas voice.

Para isso, utilizamos APIs da americanas, um serviço de backend e o serviço Autopilot da Twilio para fazer a inteligência conversacional.

Você pode fazer uso do nosso backend pela URL: https://americanas-voice.herokuapp.com/

Segue abaixo um diagrama da Arquitetura.

![Alt text](/arquitetura-aVoice.png?raw=true "Arquitetura da solução")

Irei passar pelos datalhes técnicos abaixo com base no fluxo de compra de um produto.

## Limitações Técnicas

Durante a implementação do produto, por motivos de segurança, não foi nos passadas as APIs utilizadas no processo de compra de um produto, logo fizemos um passo a passo do fluxo de compra e absorvemos as APIs públicas, que basicamente foram as APIs de pesquisa de produto.

Muitas APIs funcionam por chamadas locais, mas são bloqueadas quando subidas em um servidor, entao fizemos alguns testes e acabamos apenas implementando uma API com integração com a Americanas.

Atenção ao fato de, por viés de protótipo, não foi implementado a solução com multi usuários. Deixamos um usuário com dados mockados, que existe em nosso banco de dados, para que possa ser testada a conversação, que é o coração de nosso produto.

Nossa solução utiliza o Twilio para a inteligência conversacional. Infelizmente, hoje o Twilio é uma solução limitada no Brasil, pois as soluções conversacionais atendem apenas em inglês. Logo, será muito difícil o reconhecimento de chamadas que estejam fora do escopo de falas que selecionamos para o comando, por mais que o robô treine as falas, pois ele as compara com palavras de lingua inglesa. 

Reintero que escolhemos o Twilio pois além de ele ser uma das soluções patrocinadas pelo evento, sua documentação é bastante clara e direcionada tecnicamente.

Provavelmente temos mais limitações técnicas, mas acreditamos que as mais importante a serem citadas são as acima.

## Pesquisar um produto

Para pesquisar um produto, você pode inserir os seguintes comandos de voz:

 - Adicione <strong>{produto}</strong> por favor
 - Adiciona <strong>{produto}</strong> por favor
 - Adicione <strong>{produto}</strong> na minha lista
 - Adiciona <strong>{produto}</strong> na minha lista

Por trás, através do Twilio, adiciono essa tarefa a uma função serverless para integrar ao nosso backend, que faz consultas de produtos na API da Americanas.

Na ação de 'remember', inserimos os dados dos produtos para serem passados para as conversas seguintes e para o aplicativo.

Como visto no código acima, ele faz chamada com o <strong>endpoint</strong> <i>/search/:product</i> .

As APIs das Americanas que utilizamos foram:
 - https://mystique-v2-americanas.b2w.io/search
 - https://restql-server-api-v2-americanas.b2w.io/run-query/catalogo/product-buybox/2
 
## Filtro do produto por marca

<strong>OBS:</strong> Mais uma limitação que encontramos, foi o modo difícil de pesquisar o produto por filtro através da API, com diversos códigos além do nome da marca. Visto isso, não implementados essa funcionalidade, mas acredito que, desvendando os códigos por trás do nome da marca pesquisada, será bem fácil implementar esta funcionalidade.

Há a opção de filtrar ou não filtrar através dos comandos:

- Sim, quero a marca <strong>{marca}</strong>
- Pode, desejo a marca <strong>{marca}</strong>
- Tenho vontade de ver a marca <strong>{marca}</strong>
- Não, obrigado
- Não, obrigada
- Não tenho interesse

A partir daí, caso negativo, perguntamos se a pessoa deseja confirmar a adição dos produtos em sua lista.

## Confirmar adição do produto à lista

Depois de ter certeza do produto que deseja, o usuário pode confirmar ou não a adição do produto em sua lista de compras a partir dos seguintes comandos:

- Ok
- Pode sim
- Com certeza
- Claro
- Sim
- Pode
- Não, obrigado

Caso negativo, o produto é tirado da memória. Caso afirmativo, é ralizada uma chamada ao nosso backend para adicionar o produto em uma lista no banco de dados e então é adicionado o item à lista de compras

## Remover produto da lista de compras

Comando de voz:

- Quero tirar <strong>{produto}</strong>
- Desejo remover <strong>{produto}</strong>
  
A partir disso, a Função Twilio vai ao nosso backend e remove o produto especificado da lista.

## Limpar lista de produtos

A partir dos comandos abaixo, você pode remover todos os produtos de sua lista de compras:

- Limpar lista de compras
- Desejo limpar minha lista de compras

Todos os dados são removidos

## Listar lista de compras

Aqui, você consegue ter uma visão de toda a sua lista de compras e o total do valor. Seguem os comandos abaixo:

- Leia a minha lista

O comando faz integração com o nosso backend, que por sua vez faz uma consulta no banco de dados

## Realizar Compra

- Desejo comprar os produtos
- Comprar
- Fechar Compra

A partir dos comandos acima a compra é finalizada. Como não temos integração com a Americanas, não vimos muito sentido em implementar esta funcionalidade no backend por hora. A ideia aqui é o usuário já possuir sua conta integrada com um cartão de crédito ou com o Ame Digital, fazendo a compra de forma descompliacada. Se necessário, é possível implementar um token SMS para autenticação, mas a ideia é ser uma solução fácil de usar para deficientes visuais, por isso tal funcionalidade não foi implementada.

## Escolher forma de entrega/retirada

Aqui, o usuário escolhe se deseja receber o produto em casa ou retirar na loja mais próxima:

- Desejo retirar na loja
- Desejo receber em casa

Mais uma vez, não foi possível implementar o backend desta funcionalidade por falta de integração com a API da Americanas. A ideia é você poder ter a localização do usuário e dizer se ele está dentro de uma loja ou qual a loja mais próxima dele.

No final da operação é perguntado se ele deseja limpar sua lista de compras ou não.

## Futuro

Queremos implementar diversas outras funcionalidades a curto prazo:
- Exibição de ofertas;
- Recompras de produtos de forma mais inteligente (Exemplo: sempre compro pilhas, se peço para recomprar pilhas, ele já entende o tipo da pilha, pois já foi comprado outras vezes);
- Exibir apenas o valor do carrinho
