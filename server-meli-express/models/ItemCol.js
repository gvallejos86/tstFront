module.exports = class ItemCol {
  constructor(author,data){
    this.items = {};
    this.items['author'] = author;
    this.items['categories'] = this.getCategories(data.filters[0].values[0].path_from_root);
    this.items['items'] = this.getItems(data.results);
    this.getItemsFormat();
  }

  getCategories(arrCategories) {
    let resultCategories = [];
    arrCategories.map(values => {
      resultCategories.push(values.name);
    });
    return resultCategories;
  }

  getItems(arrItems){
    let resultItems = [];
    arrItems.map(values => {
      let itemData = {};
      let price = {};
      itemData['id'] = values.id;
      itemData['title'] = values.title;
      price['currency'] = values.currency_id;
      price['amount'] = values.price.toString().indexOf('.') > -1 ? parseInt(values.price.toString().split('.')[0]) : values.price;
      price['decimals'] = values.price.toString().indexOf('.') > -1 ? parseInt(values.price.toString().split('.')[1]) : 0;
      itemData['price'] = price;
      itemData['picture'] = values.thumbnail;
      itemData['condition'] = values.condition;
      itemData['free_shipping'] = values.shipping.free_shipping;
      resultItems.push(itemData);
    });
    return resultItems;
  }

  getItemsFormat(){
    return this.items;
  }

}
