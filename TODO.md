## TODO - expenses-control

- [x] Entender e implementar modal de confirmação para exclusão de categoria
  - [ ] Atualizar `frontend/src/components/DeleteCategoryModal.jsx` com UI inspirada em `CreateCategoryModal.jsx`
  - [ ] Implementar lógica: ao clicar “Sim” chamar API `deleteCategory({ id })` e atualizar listas
  - [ ] Atualizar texto de confirmação conforme pedido
  - [ ] Ajustar `frontend/src/pages/CategoriesPage.jsx` para abrir `DeleteCategoryModal` ao clicar em “Excluir categoria”
  - [ ] Passar dados `{ id, name }` (e `expensesCount` opcional) para o modal
  - [ ] Remover/retirar chamada direta de delete da página e delegar ao modal
  - [ ] Testar fluxos: abrir modal, cancelar, deletar, atualizar estado
