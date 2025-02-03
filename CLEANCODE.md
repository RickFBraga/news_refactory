# arquivo: news-controller.ts
- id agora é newsId, deixando claro que representa uma notícia.
- Mensagem de erro padronizada em uma constante.
- Extração de parseNewsId para evitar repetição.
- O trecho parseInt(req.params.id) + validação foi movido para parseNewsId().
- Uso de isInvalidId() para melhorar a legibilidade
- Funções ficaram mais limpas, delegando a conversão do ID para parseNewsId()

# arquivo: news-repository.ts
- news → newsData em updateNews() para manter a consistência.
- emoveNews → deleteNews para manter o padrão de nomenclatura (seguindo createNews).
- Extração da lógica de formatação de publicationDate para evitar repetição.
- Funções seguem um padrão consistente, facilitando manutenção e leitura.

# arquivo: news-service.ts
- A função validateNewsData foi dividida em funções pequenas e reutilizáveis.
- Criação da função createError para evitar repetição de objetos de erro.
- Agora as funções expressam claramente o que fazem, como ensureUniqueTitle.
- Antes: if (isNew && newsWithTitle)
- Agora: A verificação de título é feita separadamente, deixando o código mais limpo.