# arquivo: news-controller.ts
- Todas as funções estavam com a palavra 'Noticia' em português;
- A lógica de validação do ID foi extraída para a função validateNewsId(id: string) para reduzir a duplicação de código e torná-la mais reutilizável.
- As mensagens de erro foram reformuladas para uma maior clareza e consistência, e agora informam com mais precisão o tipo de erro ocorrido (como "Invalid news ID", "News not found", etc.)
- Funções como getNews e createNews foram renomeadas para getAllNews e createNewNews, respectivamente, tornando os nomes mais claros quanto às suas responsabilidades
- A função alterNews foi simplificada e dividida de forma a ficar mais coesa em sua responsabilidade de alterar as notícias
- A função deleteNews foi renomeada para removeNews, refletindo melhor a ação realizada. Além disso, a estrutura de erro foi tratada adequadamente com o código de status NO_CONTENT quando a remoção é bem-sucedida

# arquivo: news-repository.ts
- getNews foi renomeada para getAllNews para refletir que está recuperando todas as notícias, não apenas uma específica.
- createNews foi renomeada para createNewNews para tornar o nome mais semântico e claro quanto ao propósito da função

# arquivo: news-service.ts
- getNews foi renomeado para getAllNews para refletir que esta função recupera todas as notícias, melhorando a semântica.
- getSpecificNews foi renomeado para getNewsById para melhorar a clareza sobre o que está sendo feito — recuperar uma notícia específica via ID.
- createNews foi renomeado para createNewNews para tornar o nome mais explícito.
- alterNews foi renomeado para updateNews para melhorar a semântica e alinhar com as convenções de nomenclatura.
- A função createError foi criada para evitar duplicação na criação de erros. Isso centraliza a criação de objetos de erro e facilita futuras alterações no formato de erro.
- A função validate foi renomeada para validateNewsData para refletir melhor seu propósito.
- Adicionado o parâmetro isNew na validação para indicar se a notícia está sendo criada ou atualizada.
- 