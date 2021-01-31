'use strict';

const axios = require("axios").default;
axios.defaults.baseURL = 'http://localhost:7700'
// axios.defaults.baseURL = process.env.BASE_URL;
// axios.defaults.headers.common['Authorization'] = process.env.AUTH_TOKEN;

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      const document = {};
      document.id = result.id;
      document.title = result.name;
      document.quantities = result.ingredients;
      document.tags = result.tags.map(x => x.value);
      document.ingredients = Object.keys(result.ingredients);

      console.log('Recipe has been created. Here is the document:', document);

      try {
        await axios.post('/indexes/recipes/documents', [ document ]);
      } catch (error) {
        console.log(error);
      }
    },
    async afterUpdate(result, params, data) {
      const document = {};
      document.id = result.id;
      document.title = result.name;
      document.quantities = result.ingredients;
      document.tags = result.tags.map(x => x.value);
      document.ingredients = Object.keys(result.ingredients);

      console.log("Recipe has been updated. Here is the document:", document);

      await axios.post('/indexes/recipes/documents', [ document ]);
    },
    async afterDelete(result, params) {
      const document = {};
      document.id = result.id;
      document.title = result.name;

      console.log("Recipe has been deleted. Here is the document:", document);

      await axios.delete(`/indexes/recipes/documents/${result.id}`);
    }
  }
};
