# Funcionalidades

- Criação de uma task
- Listagem de todas as tasks
- Atualização de uma task pelo id
- Remover uma task pelo id
- Marcar pelo id uma task como completa
- Importação de tasks em massa por um arquivo CSV

# Rotas e regras de negócio

- `POST - /tasks`

  [X] Deve ser possível criar uma task no banco de dados, enviando os campos `title` e `description` por meio do `body` da requisição.

  [X] Ao criar uma task, os campos: `id`, `created_at`, `updated_at` e `completed_at` devem ser preenchidos automaticamente, conforme a orientação das propriedades acima.

- `GET - /tasks`

  [x] Deve ser possível listar todas as tasks salvas no banco de dados.

  [X] Também deve ser possível realizar uma busca, filtrando as tasks pelo `title` e `description`

- `PUT - /tasks/:id`

  [X] Deve ser possível atualizar uma task pelo `id`.

  [X] No `body` da requisição, deve receber somente o `title` e/ou `description` para serem atualizados.

  [X] Se for enviado somente o `title`, significa que o `description` não pode ser atualizado e vice-versa.

  [X] Antes de realizar a atualização, deve ser feito uma validação se o `id` pertence a uma task salva no banco de dados.

- `DELETE - /tasks/:id`

  [x] Deve ser possível remover uma task pelo `id`.

  [x] Antes de realizar a remoção, deve ser feito uma validação se o `id` pertence a uma task salva no banco de dados.

- `PATCH - /tasks/:id/complete`

  [X] Deve ser possível marcar a task como completa ou não. Isso significa que se a task estiver concluída, deve voltar ao seu estado “normal”.

  [X] Antes da alteração, deve ser feito uma validação se o `id` pertence a uma task salva no banco de dados.
