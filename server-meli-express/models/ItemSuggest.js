module.exports = class ItemSuggest {
  constructor(author,data){
    this.items = {};
    this.items['author'] = author;
    this.items['suggestions'] = data.suggested_queries.length > 0 ? this.getItems(data.suggested_queries) : null;
    this.getSuggestFormat();
  }

  getItems(arrItems){
    let resultItems = [];
    arrItems.map(values => {
      let price = {};
      if (values.filters.length === 0) {
        resultItems.push(values.q);
      }
    });
    return resultItems;
  }

  getSuggestFormat(){
    return this.items;
  }

}
